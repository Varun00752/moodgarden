"use client";

import { useEffect, useState } from "react";
import { Sprout, Sparkles, Loader2 } from "lucide-react";
import { InsightResponse } from "@/types";

export default function InsightCard() {
  const [data, setData] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insight")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
      })
      .catch((err) => {
        console.warn("Error fetching insight:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] border-l-4 border-l-[var(--accent)] shadow-calm flex items-center gap-3">
        <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />
        <span className="text-xs text-[var(--text-muted)]">
          Synthesizing habit correlations...
        </span>
      </div>
    );
  }

  if (!data || !data.insight) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] border-l-4 border-l-[var(--accent)] shadow-calm flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] mt-0.5">
          <Sprout className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] block mb-0.5">
            Garden Insight
          </span>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            Keep tending your garden daily! Statistical habit insights unlock once you have at least 14 days logged.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] border-l-4 border-l-[var(--accent)] shadow-calm flex items-start gap-3.5 transition-all">
      <div className="p-2 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] mt-0.5">
        <Sparkles className="w-4 h-4" />
      </div>
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] block mb-0.5">
          Weekly Correlation Insight
        </span>
        <p className="text-xs sm:text-sm text-[var(--text-primary)] font-medium leading-relaxed">
          {data.insight}
        </p>
      </div>
    </div>
  );
}
