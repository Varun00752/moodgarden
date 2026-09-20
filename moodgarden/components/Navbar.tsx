"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ThemeToggle from "./ThemeToggle";
import { Sprout, Calendar, PenLine, LogOut, LogIn } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <header className="w-full max-w-xl mx-auto px-4 py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-2xl transition-transform duration-300 group-hover:scale-110">🌱</span>
        <span className="font-serif text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          MoodGarden
        </span>
      </Link>

      <nav className="flex items-center gap-1 sm:gap-2">
        {!isAuthPage && (
          <>
            <Link
              href="/today"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname === "/today"
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Today</span>
            </Link>

            <Link
              href="/garden"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname === "/garden"
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Garden</span>
            </Link>
          </>
        )}

        <ThemeToggle />

        {user ? (
          <button
            onClick={handleSignOut}
            title="Log out"
            className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        ) : !isAuthPage ? (
          <Link
            href="/login"
            title="Log in"
            className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <LogIn className="w-4 h-4" />
          </Link>
        ) : null}
      </nav>
    </header>
  );
}
