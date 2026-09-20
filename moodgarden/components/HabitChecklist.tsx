"use client";

import { Habit } from "@/types";
import { Check } from "lucide-react";

export const DEFAULT_HABITS: Habit[] = [
  { key: "sleep", label: "Slept well", icon: "🌙" },
  { key: "exercise", label: "Exercised", icon: "🏃" },
  { key: "hydrate", label: "Drank water", icon: "💧" },
  { key: "socialize", label: "Socialized", icon: "👥" },
  { key: "eat_well", label: "Ate well", icon: "🥗" },
];

interface HabitChecklistProps {
  selectedHabits: string[];
  onChange: (habits: string[]) => void;
  disabled?: boolean;
}

export default function HabitChecklist({
  selectedHabits,
  onChange,
  disabled,
}: HabitChecklistProps) {
  const toggleHabit = (key: string) => {
    if (disabled) return;
    if (selectedHabits.includes(key)) {
      onChange(selectedHabits.filter((h) => h !== key));
    } else {
      onChange([...selectedHabits, key]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {DEFAULT_HABITS.map((habit) => {
        const isChecked = selectedHabits.includes(habit.key);

        return (
          <button
            key={habit.key}
            type="button"
            disabled={disabled}
            onClick={() => toggleHabit(habit.key)}
            className={`flex items-center justify-between p-3 rounded-xl border text-left text-sm transition-all select-none ${
              isChecked
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)] font-medium shadow-xs"
                : "border-[var(--border)] bg-black/[0.02] dark:bg-white/[0.02] text-[var(--text-muted)] hover:border-[var(--accent)]/40 hover:text-[var(--text-primary)]"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span className="text-lg">{habit.icon}</span>
              <span>{habit.label}</span>
            </span>

            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                isChecked
                  ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                  : "border-[var(--border)] bg-transparent"
              }`}
            >
              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
