"use client";

import { useState, useEffect } from "react";
import GardenTile from "./GardenTile";
import DayModal from "./DayModal";
import { Entry } from "@/types";
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function GardenGrid() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Format month string YYYY-MM for API
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/entries?month=${monthStr}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch (err) {
      console.warn("Failed to load month entries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [monthStr]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calendar calculations
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = new Date().toISOString().split("T")[0];

  // Month title e.g. "September 2026"
  const monthTitle = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleTileClick = (dateStr: string, entry?: Entry) => {
    setSelectedDate(dateStr);
    setSelectedEntry(entry || null);
    setIsModalOpen(true);
  };

  const hasAnyEntries = entries.length > 0;

  return (
    <div className="bg-[var(--surface)] p-5 sm:p-7 rounded-2xl shadow-calm border border-[var(--border)] space-y-6">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)]">
            Garden View
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[var(--text-primary)] mt-0.5">
            {monthTitle}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            type="button"
            aria-label="Previous Month"
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            type="button"
            aria-label="Next Month"
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 text-center">
        {DAYS_OF_WEEK.map((d) => (
          <span
            key={d}
            className="text-[11px] sm:text-xs font-semibold text-[var(--text-muted)] py-1 select-none"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Grid of Tiles */}
      {loading ? (
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
          {/* Empty prefix tiles */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
              dayNum
            ).padStart(2, "0")}`;
            const matchedEntry = entries.find((e) => e.entry_date === dateString);
            const isToday = dateString === todayStr;

            return (
              <GardenTile
                key={dateString}
                dayNumber={dayNum}
                dateStr={dateString}
                isToday={isToday}
                isCurrentMonth={true}
                entry={matchedEntry}
                index={i}
                onClick={() => handleTileClick(dateString, matchedEntry)}
              />
            );
          })}
        </div>
      )}

      {/* Empty State message if zero entries in this month */}
      {!loading && !hasAnyEntries && (
        <div className="text-center py-6 border-t border-[var(--border)] mt-4">
          <p className="text-xs text-[var(--text-muted)] mb-2">
            No garden tiles planted in {monthTitle} yet.
          </p>
          <Link
            href="/today"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Plant your first tile today
          </Link>
        </div>
      )}

      {/* Detail Modal */}
      <DayModal
        isOpen={isModalOpen}
        dateStr={selectedDate}
        entry={selectedEntry}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
