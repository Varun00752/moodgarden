"use client";

import { motion } from "framer-motion";
import { getMoodColor, MOOD_DESCRIPTIONS } from "@/lib/moodColor";
import { Entry } from "@/types";

interface GardenTileProps {
  dayNumber: number;
  dateStr: string;
  isToday: boolean;
  isCurrentMonth: boolean;
  entry?: Entry;
  index: number;
  onClick: () => void;
}

// SVG Petal variants based on habit count
function BloomIcon({ count }: { count: number }) {
  if (count <= 0) return null;

  if (count === 1) {
    // Small bud
    return (
      <svg
        className="w-3.5 h-3.5 text-emerald-800/70 dark:text-emerald-200/90"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C9.5 5.5 8 9 9 12.5C9.8 15.3 12 17 12 22C12 17 14.2 15.3 15 12.5C16 9 14.5 5.5 12 2Z" />
      </svg>
    );
  } else if (count <= 3) {
    // Half bloom
    return (
      <svg
        className="w-4 h-4 text-emerald-900/80 dark:text-emerald-200"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <circle cx="12" cy="12" r="3.5" />
        <ellipse cx="12" cy="5.5" rx="2.5" ry="3.5" />
        <ellipse cx="12" cy="18.5" rx="2.5" ry="3.5" />
        <ellipse cx="5.5" cy="12" rx="3.5" ry="2.5" />
        <ellipse cx="18.5" cy="12" rx="3.5" ry="2.5" />
      </svg>
    );
  } else {
    // Full radiant bloom
    return (
      <svg
        className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-950 dark:text-emerald-100"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="6" r="3.2" />
        <circle cx="12" cy="18" r="3.2" />
        <circle cx="6" cy="12" r="3.2" />
        <circle cx="18" cy="12" r="3.2" />
        <circle cx="7.8" cy="7.8" r="2.8" />
        <circle cx="16.2" cy="7.8" r="2.8" />
        <circle cx="7.8" cy="16.2" r="2.8" />
        <circle cx="16.2" cy="16.2" r="2.8" />
      </svg>
    );
  }
}

export default function GardenTile({
  dayNumber,
  dateStr,
  isToday,
  isCurrentMonth,
  entry,
  index,
  onClick,
}: GardenTileProps) {
  const hasEntry = !!entry;
  const moodScore = entry?.mood_score;
  const moodBg = getMoodColor(moodScore);
  const habitCount = entry?.habits?.length || 0;

  // Stagger entrance animation: ~20ms per tile
  const tileVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.35,
        delay: index * 0.018,
        ease: "easeOut" as const,
      },
    },
  };

  if (!isCurrentMonth) {
    return (
      <div className="aspect-square rounded-xl border border-transparent opacity-20 flex items-center justify-center text-xs text-[var(--text-muted)]">
        {dayNumber}
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      variants={tileVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        backgroundColor: hasEntry && moodBg ? moodBg : undefined,
      }}
      className={`relative aspect-square w-full rounded-2xl p-1.5 sm:p-2 flex flex-col justify-between border transition-shadow text-left focus:outline-none ${
        hasEntry
          ? "border-black/5 dark:border-white/10 shadow-xs hover:shadow-md text-[var(--text-primary)]"
          : "border-[var(--border)] bg-black/[0.015] dark:bg-white/[0.02] hover:border-[var(--accent)]/40"
      } ${
        isToday && !hasEntry
          ? "ring-2 ring-[var(--accent)] ring-offset-2 dark:ring-offset-[var(--bg)] animate-pulse"
          : ""
      }`}
    >
      {/* Date Label */}
      <div className="flex items-center justify-between w-full">
        <span
          className={`text-xs sm:text-sm font-medium ${
            isToday
              ? "font-bold text-[var(--accent)]"
              : hasEntry
              ? "text-black/70 dark:text-white/90"
              : "text-[var(--text-muted)]"
          }`}
        >
          {dayNumber}
        </span>
        {hasEntry && moodScore && (
          <span className="text-xs sm:text-sm select-none" title={MOOD_DESCRIPTIONS[moodScore]?.label}>
            {MOOD_DESCRIPTIONS[moodScore]?.emoji}
          </span>
        )}
      </div>

      {/* Habit Bloom Indicator */}
      <div className="self-end mt-auto">
        <BloomIcon count={habitCount} />
      </div>
    </motion.button>
  );
}
