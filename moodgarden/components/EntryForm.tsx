"use client";

import { useState, useEffect } from "react";
import MoodPicker from "./MoodPicker";
import HabitChecklist from "./HabitChecklist";
import { Check, Loader2, Sparkles } from "lucide-react";

interface EntryFormProps {
  initialDate?: string; // YYYY-MM-DD
  initialEntry?: {
    mood_score?: number;
    text?: string;
    habits?: string[];
  } | null;
  onSaved?: () => void;
}

export default function EntryForm({
  initialDate,
  initialEntry,
  onSaved,
}: EntryFormProps) {
  const todayDate =
    initialDate || new Date().toISOString().split("T")[0];

  const [moodScore, setMoodScore] = useState<number | null>(
    initialEntry?.mood_score || null
  );
  const [text, setText] = useState<string>(initialEntry?.text || "");
  const [habits, setHabits] = useState<string[]>(initialEntry?.habits || []);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialEntry) {
      if (typeof initialEntry.mood_score === "number") {
        setMoodScore(initialEntry.mood_score);
      }
      if (typeof initialEntry.text === "string") {
        setText(initialEntry.text);
      }
      if (Array.isArray(initialEntry.habits)) {
        setHabits(initialEntry.habits);
      }
    }
  }, [initialEntry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moodScore) {
      setErrorMessage("Please select your mood for today.");
      return;
    }

    setSaving(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry_date: todayDate,
          mood_score: moodScore,
          text,
          habits,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save entry");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
      if (onSaved) onSaved();
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const charCount = text.length;
  const maxChars = 500;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--surface)] p-6 sm:p-8 rounded-2xl shadow-calm border border-[var(--border)] space-y-7"
    >
      {/* Mood Picker */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
          How are you feeling today?
        </label>
        <MoodPicker
          value={moodScore}
          onChange={(val) => {
            setMoodScore(val);
            setErrorMessage(null);
          }}
          disabled={saving}
        />
      </div>

      {/* Habit Checklist */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Daily Habits
          </label>
          <span className="text-[11px] text-[var(--text-muted)]">
            {habits.length} checked
          </span>
        </div>
        <HabitChecklist
          selectedHabits={habits}
          onChange={setHabits}
          disabled={saving}
        />
      </div>

      {/* Journal Reflection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Daily Reflection
          </label>
          <span
            className={`text-xs ${
              charCount > 450
                ? "text-amber-600 dark:text-amber-400 font-semibold"
                : "text-[var(--text-muted)]"
            }`}
          >
            {charCount}/{maxChars}
          </span>
        </div>
        <textarea
          rows={4}
          maxLength={maxChars}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind? A moment of gratitude, a challenge, or how your day unfolded..."
          disabled={saving}
          className="w-full p-4 rounded-xl border border-[var(--border)] bg-black/[0.01] dark:bg-white/[0.02] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm leading-relaxed placeholder:text-[var(--text-muted)]/60 resize-none transition-all"
        />
      </div>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="p-3.5 text-xs rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200">
          {errorMessage}
        </div>
      )}

      {/* Submit button & confirmation */}
      <div className="flex items-center justify-between pt-2">
        <div>
          {savedSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 animate-fade-in">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              Bloom recorded for today
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={saving || !moodScore}
          className="py-2.5 px-6 rounded-xl bg-[var(--accent)] hover:opacity-90 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cultivating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Plant Today&apos;s Tile</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
