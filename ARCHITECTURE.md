# Architecture — MoodGarden

## Stack
| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router, TypeScript) | SSR pages + API routes in one project |
| Styling | Tailwind CSS | Utility-first, fast to theme |
| Animation | Framer Motion | Tile bloom transitions, page transitions |
| Auth | Supabase Auth | Email/password, JWT-based sessions |
| Database | Supabase Postgres | Relational, has row-level security |
| AI | Hugging Face Inference API (`distilbert-base-uncased-finetuned-sst-2-english`) | Sentiment scoring; swappable for OpenAI/Claude API |
| Hosting | Vercel | Auto-deploy from GitHub main branch |
| Package manager | pnpm (or npm if pnpm unavailable) | |

## Why these choices (for the build agent — do not substitute without reason)
- Supabase over hand-rolled backend: gives Postgres + Auth + Row Level
  Security out of the box, avoids reinventing session handling.
- Next.js API routes over a separate backend service: keeps one deploy
  target, simpler for a solo project, still demonstrates real backend code.
- Hugging Face Inference API over self-hosted model: no GPU/server needed,
  free tier is enough for demo-scale usage. Code should isolate this call
  behind a single function (`lib/sentiment.ts`) so it can be swapped for
  OpenAI/Claude later without touching other files.

## Folder structure
```
moodgarden/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── today/page.tsx          # daily entry form
│   ├── garden/page.tsx         # calendar visualization
│   ├── api/
│   │   ├── entries/route.ts    # POST create/update, GET list
│   │   ├── entries/[date]/route.ts
│   │   ├── sentiment/route.ts  # calls Hugging Face API
│   │   └── insight/route.ts    # correlation calculation
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── EntryForm.tsx
│   ├── MoodPicker.tsx
│   ├── HabitChecklist.tsx
│   ├── GardenGrid.tsx
│   ├── GardenTile.tsx
│   ├── DayModal.tsx
│   ├── InsightCard.tsx
│   └── ThemeToggle.tsx
├── lib/
│   ├── supabaseClient.ts
│   ├── sentiment.ts             # isolated AI call
│   ├── correlation.ts           # stats logic, pure functions, unit-testable
│   └── moodColor.ts             # maps mood score -> tile color
├── types/
│   └── index.ts
├── middleware.ts                # protects /today and /garden routes
├── .env.local.example
└── package.json
```

## Data flow
1. Client submits entry form → `POST /api/entries`
2. Route handler saves entry to Supabase immediately (fast path), returns
   success to client so UI doesn't block.
3. Route handler then calls `lib/sentiment.ts` → Hugging Face API → writes
   sentiment score back to the same row (async, fire-and-forget from the
   client's perspective, but awaited server-side before responding is also
   acceptable for v1 simplicity — see AI_FEATURES.md for the tradeoff).
4. Garden page: `GET /api/entries?month=YYYY-MM` fetches the month's rows,
   client maps mood score → color via `lib/moodColor.ts`.
5. Insight card: `GET /api/insight` runs `lib/correlation.ts` server-side
   over the user's last 30 entries, returns one generated sentence.

## Auth flow
- Supabase Auth issues a JWT on login, stored in an HTTP-only cookie via
  `@supabase/ssr` helper.
- `middleware.ts` checks for a valid session on `/today` and `/garden`,
  redirects to `/login` if absent.
- Every Supabase query is scoped by Row Level Security policies keyed on
  `auth.uid()` — see DATABASE_SCHEMA.md. The API routes never manually
  filter by user id as the sole safeguard; RLS is the source of truth.

## Environment variables
See `SETUP.md` for the full list and where to get each value.
