/**
 * MoodGarden Mood-to-Color Mapping
 * Based on DESIGN_SYSTEM.md
 */

export const MOOD_COLORS: Record<number, string> = {
  1: "#D9C7B8", // Muted clay
  2: "#E3D4C2",
  3: "#D8DFC8", // Neutral sage
  4: "#BFDCC4",
  5: "#9FCBAE", // Soft green
};

export const MOOD_DESCRIPTIONS: Record<number, { label: string; emoji: string }> = {
  1: { label: "Very Low", emoji: "🌧️" },
  2: { label: "Low", emoji: "⛅" },
  3: { label: "Neutral", emoji: "🌱" },
  4: { label: "Good", emoji: "🌿" },
  5: { label: "Flourishing", emoji: "🌸" },
};

/**
 * Returns hex color for given mood score (1-5), or null if no entry.
 */
export function getMoodColor(moodScore?: number | null): string | null {
  if (!moodScore || moodScore < 1 || moodScore > 5) {
    return null;
  }
  return MOOD_COLORS[moodScore] || null;
}
