"use client";

import { motion } from "framer-motion";
import { MOOD_DESCRIPTIONS, MOOD_COLORS } from "@/lib/moodColor";

interface MoodPickerProps {
  value: number | null;
  onChange: (score: number) => void;
  disabled?: boolean;
}

const moods = [
  { score: 1, ...MOOD_DESCRIPTIONS[1] },
  { score: 2, ...MOOD_DESCRIPTIONS[2] },
  { score: 3, ...MOOD_DESCRIPTIONS[3] },
  { score: 4, ...MOOD_DESCRIPTIONS[4] },
  { score: 5, ...MOOD_DESCRIPTIONS[5] },
];

export default function MoodPicker({ value, onChange, disabled }: MoodPickerProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {moods.map((item) => {
          const isSelected = value === item.score;
          const moodBg = MOOD_COLORS[item.score];

          return (
            <button
              key={item.score}
              type="button"
              disabled={disabled}
              onClick={() => onChange(item.score)}
              className="flex-1 flex flex-col items-center gap-1.5 focus:outline-none group"
            >
              <motion.div
                whileHover={disabled ? {} : { scale: 1.08 }}
                whileTap={disabled ? {} : { scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  backgroundColor: isSelected ? moodBg : undefined,
                }}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl transition-all border ${
                  isSelected
                    ? "ring-2 ring-[var(--accent)] ring-offset-2 dark:ring-offset-[var(--bg)] border-transparent shadow-sm"
                    : "border-[var(--border)] bg-black/[0.02] dark:bg-white/[0.02] hover:border-[var(--accent)]/50"
                }`}
              >
                <span className="select-none">{item.emoji}</span>
              </motion.div>
              <span
                className={`text-[11px] sm:text-xs font-medium transition-colors ${
                  isSelected
                    ? "text-[var(--text-primary)] font-semibold"
                    : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
