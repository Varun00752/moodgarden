"use client";

import GardenGrid from "@/components/GardenGrid";
import InsightCard from "@/components/InsightCard";
import { MOOD_COLORS, MOOD_DESCRIPTIONS } from "@/lib/moodColor";

export default function GardenPage() {
  return (
    <div className="space-y-6 pt-2 sm:pt-4">
      {/* Page Title */}
      <div className="text-center sm:text-left">
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)]">
          Monthly Landscape
        </span>
        <h1 className="text-3xl font-bold font-serif text-[var(--text-primary)] mt-1">
          Your Mood Garden
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Each day is a tile shaped by your mood, blooming with every habit nurtured.
        </p>
      </div>

      {/* Insight Card */}
      <InsightCard />

      {/* Garden Calendar Grid */}
      <GardenGrid />

      {/* Soft Calm Legend */}
      <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-calm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            Mood:
          </span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((score) => (
              <div
                key={score}
                className="flex items-center gap-1"
                title={`${score}: ${MOOD_DESCRIPTIONS[score].label}`}
              >
                <div
                  style={{ backgroundColor: MOOD_COLORS[score] }}
                  className="w-3.5 h-3.5 rounded-full border border-black/5 dark:border-white/10"
                />
              </div>
            ))}
          </div>
          <span className="text-[11px] text-[var(--text-muted)] ml-1">
            (Clay to Sage)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            Habits:
          </span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-200">
            <span>🌱 1 Habit (Bud)</span>
            <span>→</span>
            <span>🌸 5 Habits (Bloom)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
