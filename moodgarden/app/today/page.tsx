"use client";

import { useEffect, useState } from "react";
import EntryForm from "@/components/EntryForm";
import { Loader2 } from "lucide-react";

export default function TodayPage() {
  const [loading, setLoading] = useState(true);
  const [todayEntry, setTodayEntry] = useState<any>(null);

  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const loadTodayEntry = async () => {
    try {
      const res = await fetch(`/api/entries/${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        setTodayEntry(data);
      }
    } catch (err) {
      console.warn("Could not fetch today's entry:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodayEntry();
  }, [dateStr]);

  return (
    <div className="space-y-6 pt-2 sm:pt-4">
      <div className="text-center sm:text-left">
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)]">
          Daily Journal
        </span>
        <h1 className="text-3xl font-bold font-serif text-[var(--text-primary)] mt-1">
          {formattedDate}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Take 60 seconds to check in with yourself and tend to your garden.
        </p>
      </div>

      {loading ? (
        <div className="w-full h-80 bg-[var(--surface)] rounded-2xl border border-[var(--border)] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
        </div>
      ) : (
        <EntryForm
          initialDate={dateStr}
          initialEntry={todayEntry}
          onSaved={loadTodayEntry}
        />
      )}
    </div>
  );
}
