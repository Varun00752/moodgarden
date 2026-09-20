"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/today";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-[var(--surface)] p-8 rounded-2xl shadow-calm border border-[var(--border)]">
      <div className="text-center mb-6">
        <span className="text-3xl">🌱</span>
        <h1 className="text-2xl font-bold mt-2 font-serif text-[var(--text-primary)]">
          Welcome back
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Log in to cultivate your MoodGarden
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 text-xs rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-transparent text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-transparent text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-[var(--accent)] hover:opacity-90 active:scale-[0.99] text-white font-medium text-sm transition-all shadow-sm disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-[var(--text-muted)]">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/signup"
          className="text-[var(--accent)] font-semibold hover:underline"
        >
          Create one
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-8 sm:pt-16">
      <Suspense
        fallback={
          <div className="w-full max-w-sm h-80 bg-[var(--surface)] p-8 rounded-2xl border border-[var(--border)] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
