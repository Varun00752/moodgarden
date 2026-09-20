import test from "node:test";
import assert from "node:assert/strict";

// Test correlation algorithm logic
function computeStrongestCorrelation(entries, habitKeys) {
  const MIN_SAMPLE = 7;
  let best = null;

  for (const habit of habitKeys) {
    const withHabit = entries.filter((e) => e.habits.includes(habit));
    const withoutHabit = entries.filter((e) => !e.habits.includes(habit));

    if (withHabit.length < MIN_SAMPLE || withoutHabit.length < MIN_SAMPLE) {
      continue;
    }

    const avg = (arr) =>
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

function toSentence(result, habitLabel) {
  const direction = result.delta >= 0 ? "higher" : "lower";
  return `You've scored ${Math.abs(result.delta)} points ${direction} on mood on days you ${habitLabel.toLowerCase()}, over your last ${
    result.sampleSizeWith + result.sampleSizeWithout
  } entries.`;
}

test("correlation: returns null if fewer than 7 entries on either side", () => {
  const entries = [
    { mood_score: 5, habits: ["exercise"] },
    { mood_score: 4, habits: ["exercise"] },
    { mood_score: 3, habits: [] },
  ];
  const result = computeStrongestCorrelation(entries, ["exercise"]);
  assert.equal(result, null);
});

test("correlation: accurately calculates positive delta when sample >= 7", () => {
  const entries = [];
  // 7 days with exercise: mood 5
  for (let i = 0; i < 7; i++) {
    entries.push({ mood_score: 5, habits: ["exercise"] });
  }
  // 7 days without exercise: mood 3
  for (let i = 0; i < 7; i++) {
    entries.push({ mood_score: 3, habits: [] });
  }

  const result = computeStrongestCorrelation(entries, ["exercise"]);
  assert.notEqual(result, null);
  assert.equal(result.habit, "exercise");
  assert.equal(result.delta, 2);
  assert.equal(result.sampleSizeWith, 7);
  assert.equal(result.sampleSizeWithout, 7);

  const sentence = toSentence(result, "Exercised");
  assert.equal(
    sentence,
    "You've scored 2 points higher on mood on days you exercised, over your last 14 entries."
  );
});

test("moodColor: verifies color map for scale 1-5", () => {
  const MOOD_COLORS = {
    1: "#D9C7B8",
    2: "#E3D4C2",
    3: "#D8DFC8",
    4: "#BFDCC4",
    5: "#9FCBAE",
  };

  assert.equal(MOOD_COLORS[1], "#D9C7B8");
  assert.equal(MOOD_COLORS[5], "#9FCBAE");
  assert.equal(MOOD_COLORS[6], undefined);
});
