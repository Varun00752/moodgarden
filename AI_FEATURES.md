# AI Features — MoodGarden

This project has two AI/algorithmic components. Both must be isolated in
`lib/` as pure, testable functions — not inlined into route handlers.

---

## 1. Sentiment scoring (`lib/sentiment.ts`)

**Model**: `distilbert-base-uncased-finetuned-sst-2-english` via the
Hugging Face Inference API (free tier, no GPU required).

**Call**
```ts
// lib/sentiment.ts
export async function scoreSentiment(text: string): Promise<number | null> {
  if (!text || text.trim().length === 0) return null;

  const res = await fetch(
    "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
      signal: AbortSignal.timeout(5000),
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  // data shape: [[{label: "POSITIVE", score: 0.98}, {label: "NEGATIVE", score: 0.02}]]
  const top = data[0]?.[0];
  if (!top) return null;

  // Normalize to a single -1..1 scale
  return top.label === "POSITIVE" ? top.score : -top.score;
}
```

**Failure mode**: on any error/timeout, return `null`. The caller stores
`null` in `sentiment_score` and the UI simply omits sentiment-dependent
elements for that entry rather than blocking. Never let this call delay
the entry save response to the user.

**Why DistilBERT over a bigger model**: it's small, fast, free-tier
friendly, and "good enough" for short journal-length text. Swappable later
for OpenAI/Claude by changing only this file.

---

## 2. Correlation insight (`lib/correlation.ts`)

This is the differentiating algorithmic piece — plain statistics, no ML
model needed, but genuine logic you can explain in an interview.

**Goal**: for each habit, compare average mood on days the habit was
logged vs. days it wasn't, and surface the habit with the largest positive
difference (if it's backed by enough data).

**Algorithm**
```ts
// lib/correlation.ts
export interface EntryWithHabits {
  mood_score: number;
  habits: string[]; // habit keys logged that day
}

export interface CorrelationResult {
  habit: string;
  delta: number;         // avg mood WITH habit - avg mood WITHOUT
  sampleSizeWith: number;
  sampleSizeWithout: number;
}

const MIN_SAMPLE = 7; // minimum entries on each side to trust the result

export function computeStrongestCorrelation(
  entries: EntryWithHabits[],
  habitKeys: string[]
): CorrelationResult | null {
  let best: CorrelationResult | null = null;

  for (const habit of habitKeys) {
    const withHabit = entries.filter(e => e.habits.includes(habit));
    const withoutHabit = entries.filter(e => !e.habits.includes(habit));

    if (withHabit.length < MIN_SAMPLE || withoutHabit.length < MIN_SAMPLE) {
      continue; // not enough data to trust this comparison
    }

    const avg = (arr: EntryWithHabits[]) =>
      arr.reduce((sum, e) => sum + e.mood_score, 0) / arr.length;

    const delta = avg(withHabit) - avg(withoutHabit);

    if (!best || Math.abs(delta) > Math.abs(best.delta)) {
      best = {
        habit,
        delta: Math.round(delta * 10) / 10,
        sampleSizeWith: withHabit.length,
        sampleSizeWithout: withoutHabit.length,
      };
    }
  }

  return best;
}
```

**Turning the result into a sentence** (in the API route):
```ts
function toSentence(result: CorrelationResult, habitLabel: string): string {
  const direction = result.delta >= 0 ? "higher" : "lower";
  return `You've scored ${Math.abs(result.delta)} points ${direction} on mood ` +
    `on days you ${habitLabel.toLowerCase()}, over your last ` +
    `${result.sampleSizeWith + result.sampleSizeWithout} entries.`;
}
```

**Interview talking points this gives you**:
- Why `MIN_SAMPLE = 7` on each side — avoids false insights from tiny
  samples (a real statistics consideration, easy to explain).
- This is a mean-comparison, not a proper correlation coefficient
  (Pearson's r) — mention that as a stated limitation/future improvement
  if asked, it shows awareness rather than overclaiming rigor.
- Possible v2 upgrade: replace with Pearson correlation or a simple
  t-test for statistical significance instead of a raw mean difference.

---

## What NOT to do
- Do not call the sentiment API on every keystroke — only on submit.
- Do not block entry save on the AI call completing.
- Do not hardcode the Hugging Face API key — always from `process.env`.
- Do not compute the insight on every page load if entries haven't
  changed — cache it (even a simple in-memory cache per session is fine
  for v1) to avoid unnecessary API/DB load.
