import Link from "next/link";
import { Sparkles, Calendar, PenLine, Heart, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="pt-6 sm:pt-14 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Mood & Habit Journal</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold font-serif text-[var(--text-primary)] tracking-tight leading-[1.15]">
          A journal that shows why you feel the way you do.
        </h1>

        <p className="text-base text-[var(--text-muted)] leading-relaxed max-w-md mx-auto">
          Log your mood in 60 seconds, score daily sentiment with AI, correlate
          habits, and watch your month bloom as a living garden.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link
            href="/today"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--accent)] hover:opacity-90 active:scale-[0.98] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <PenLine className="w-4 h-4" />
            <span>Plant Today&apos;s Entry</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>

          <Link
            href="/garden"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-primary)] font-medium text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Explore Garden</span>
          </Link>
        </div>
      </div>

      {/* 3 Pillar Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-calm space-y-2">
          <span className="text-2xl block mb-1">🌿</span>
          <h3 className="font-serif font-bold text-base text-[var(--text-primary)]">
            60-Second Check-in
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Pick your daily mood score (1–5), check off habits, and pen a short
            reflection without pressure.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-calm space-y-2">
          <span className="text-2xl block mb-1">🌸</span>
          <h3 className="font-serif font-bold text-base text-[var(--text-primary)]">
            Living Garden Grid
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Your calendar transforms into soft colored tiles that bloom with SVG
            flowers as habits are kept.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-calm space-y-2">
          <span className="text-2xl block mb-1">💡</span>
          <h3 className="font-serif font-bold text-base text-[var(--text-primary)]">
            AI & Habit Insights
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            DistilBERT sentiment analysis plus statistical correlation uncovering
            which habits elevate your mood.
          </p>
        </div>
      </div>
    </div>
  );
}
