# API Spec — MoodGarden

All routes live under `app/api/` (Next.js Route Handlers). All routes below
require an authenticated session unless noted; the session is read from the
Supabase cookie via the server client — reject with 401 if missing.

---

## `POST /api/entries`
Create or update today's (or a given date's) entry.

**Request body**
```json
{
  "entry_date": "2026-09-20",
  "text": "Felt good today, went for a run.",
  "mood_score": 4,
  "habits": ["exercise", "hydrate"]
}
```

**Behavior**
1. Validate `mood_score` is 1–5, `text` ≤ 500 chars.
2. Upsert into `entries` on `(user_id, entry_date)`.
3. Delete existing `habit_logs` for this entry, insert new ones from `habits[]`.
4. Respond immediately (do not wait for sentiment scoring — see AI_FEATURES.md).
5. Trigger sentiment scoring asynchronously (or via a follow-up call to
   `/api/sentiment`, see below).

**Response `200`**
```json
{ "id": "uuid", "entry_date": "2026-09-20", "saved": true }
```

**Errors**: `400` invalid input, `401` unauthenticated, `500` db error.

---

## `GET /api/entries?month=2026-09`
List all entries for the authenticated user in a given month.

**Response `200`**
```json
{
  "entries": [
    {
      "entry_date": "2026-09-20",
      "mood_score": 4,
      "sentiment_score": 0.812,
      "text": "Felt good today, went for a run.",
      "habits": ["exercise", "hydrate"]
    }
  ]
}
```

---

## `GET /api/entries/:date`
Fetch a single day's full entry (used by the day-detail modal).

**Response `200`**: same shape as one item above, or `404` if no entry exists.

---

## `POST /api/sentiment`
Internal-use route: scores a given text and writes it back to the entry.
Called by `/api/entries` right after save, or can be retried if the first
call failed/timed-out.

**Request body**
```json
{ "entry_id": "uuid", "text": "Felt good today, went for a run." }
```

**Behavior**: calls `lib/sentiment.ts`, which calls the Hugging Face
Inference API, normalizes the label+score into a single -1..1 float
(see AI_FEATURES.md), and updates `entries.sentiment_score`.

**Response `200`**
```json
{ "sentiment_score": 0.812 }
```

**Failure handling**: if the Hugging Face API errors or times out (>5s),
respond `200` with `{ "sentiment_score": null }` and log the error —
never let a failed AI call block or fail the entry save.

---

## `GET /api/insight`
Computes and returns the current correlation insight for the logged-in user.

**Behavior**: pulls the user's last 30 entries (with habit_logs joined),
runs `lib/correlation.ts` for each habit against `mood_score`, returns the
strongest correlation as a human-readable sentence. See AI_FEATURES.md for
the exact algorithm.

**Response `200`**
```json
{
  "insight": "You've scored 1.3 points higher on mood on days you exercised, over your last 18 entries.",
  "habit": "exercise",
  "delta": 1.3,
  "sample_size": 18
}
```

If there isn't enough data (fewer than 7 entries with and without the habit),
respond:
```json
{ "insight": null, "reason": "not_enough_data" }
```

---

## Auth routes
Handled by Supabase Auth client-side (`supabase.auth.signUp`,
`supabase.auth.signInWithPassword`, `supabase.auth.signOut`) — no custom
API routes needed for these; just call the Supabase JS client directly from
the login/signup pages.
