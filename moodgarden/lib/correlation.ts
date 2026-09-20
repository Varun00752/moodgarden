import { EntryWithHabits, CorrelationResult } from "@/types";

export const MIN_SAMPLE = 7; // minimum entries on each side to trust the comparison

export function computeStrongestCorrelation(
  entries: EntryWithHabits[],
  habitKeys: string[]
): CorrelationResult | null {
  let best: CorrelationResult | null = null;

  for (const habit of habitKeys) {
    const withHabit = entries.filter((e) => e.habits.includes(habit));
    const withoutHabit = entries.filter((e) => !e.habits.includes(habit));

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

export function toSentence(result: CorrelationResult, habitLabel: string): string {
  const direction = result.delta >= 0 ? "higher" : "lower";
  return `You've scored ${Math.abs(result.delta)} points ${direction} on mood on days you ${habitLabel.toLowerCase()}, over your last ${
    result.sampleSizeWith + result.sampleSizeWithout
  } entries.`;
}
