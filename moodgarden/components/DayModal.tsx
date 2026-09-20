"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Entry } from "@/types";
import { MOOD_DESCRIPTIONS, getMoodColor } from "@/lib/moodColor";
import { DEFAULT_HABITS } from "./HabitChecklist";
import { X, Sparkles, Calendar, HeartHandshake } from "lucide-react";
import Link from "next/link";

interface DayModalProps {
  isOpen: boolean;
  dateStr: string | null;
  entry: Entry | null;
  onClose: () => void;
}

export default function DayModal({
  isOpen,
  dateStr,
  entry,
  onClose,
}: DayModalProps) {
  if (!isOpen || !dateStr) return null;

  const dateObj = new Date(dateStr + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const moodInfo = entry?.mood_score
    ? MOOD_DESCRIPTIONS[entry.mood_score]
    : null;
  const moodBg = getMoodColor(entry?.mood_score);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-md bg-[var(--surface)] p-6 sm:p-7 rounded-2xl shadow-calm border border-[var(--border)] z-10 space-y-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[var(--accent)] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Garden Tile Details
              </span>
              <h3 className="text-xl font-bold font-serif text-[var(--text-primary)] mt-1">
                {formattedDate}
              </h3>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {entry ? (
            <div className="space-y-4">
              {/* Mood & Sentiment header badge */}
              <div
                style={{ backgroundColor: moodBg || undefined }}
                className="p-3.5 rounded-xl border border-black/5 dark:border-white/10 flex items-center justify-between text-black/90 dark:text-white/95"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{moodInfo?.emoji}</span>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-75 block">
                      Mood
                    </span>
                    <span className="text-sm font-bold">{moodInfo?.label}</span>
                  </div>
                </div>

                {typeof entry.sentiment_score === "number" && (
                  <div className="text-right">
                    <span className="text-[11px] font-semibold uppercase tracking-wider opacity-75 flex items-center gap-1 justify-end">
                      <Sparkles className="w-3 h-3" />
                      AI Sentiment
                    </span>
                    <span className="text-xs font-mono font-medium">
                      {entry.sentiment_score > 0 ? "+" : ""}
                      {entry.sentiment_score.toFixed(3)}
                    </span>
                  </div>
                )}
              </div>

              {/* Habits */}
              {entry.habits && entry.habits.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Habits logged ({entry.habits.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.habits.map((habitKey) => {
                      const habit = DEFAULT_HABITS.find((h) => h.key === habitKey);
                      return (
                        <span
                          key={habitKey}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/[0.03] dark:bg-white/[0.05] border border-[var(--border)] text-[var(--text-primary)]"
                        >
                          <span>{habit?.icon || "🌱"}</span>
                          <span>{habit?.label || habitKey}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reflection */}
              {entry.text ? (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Journal Reflection
                  </h4>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap bg-black/[0.015] dark:bg-white/[0.02] p-3.5 rounded-xl border border-[var(--border)]">
                    {entry.text}
                  </p>
                </div>
              ) : (
                <p className="text-xs italic text-[var(--text-muted)]">
                  No reflection text logged for this day.
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <span className="text-3xl">🌱</span>
              <p className="text-sm text-[var(--text-muted)]">
                No entry was planted for this day yet.
              </p>
              <Link
                href="/today"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-[var(--accent)] text-white hover:opacity-90 transition-all"
              >
                Go to Today&apos;s Entry
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
