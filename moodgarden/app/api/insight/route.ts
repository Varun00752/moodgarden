import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { fallbackStore } from "@/lib/storageFallback";
import { computeStrongestCorrelation, toSentence } from "@/lib/correlation";
import { DEFAULT_HABITS } from "@/components/HabitChecklist";
import { EntryWithHabits } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMock = url.includes("mock-project") || !url.startsWith("http");

    let entries: EntryWithHabits[] = [];

    if (isMock) {
      const allEntries = fallbackStore.getEntries("local-user").slice(0, 30);
      entries = allEntries.map((e) => ({
        mood_score: e.mood_score,
        habits: e.habits || [],
      }));
    } else {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { data, error } = await supabase
        .from("entries")
        .select("mood_score, habit_logs(habit_key)")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false })
        .limit(30);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      entries = (data || []).map((row: any) => ({
        mood_score: row.mood_score,
        habits: (row.habit_logs || []).map((h: any) => h.habit_key),
      }));
    }

    const habitKeys = DEFAULT_HABITS.map((h) => h.key);
    const result = computeStrongestCorrelation(entries, habitKeys);

    if (!result) {
      return NextResponse.json({
        insight: null,
        reason: "not_enough_data",
      });
    }

    const matchedHabit = DEFAULT_HABITS.find((h) => h.key === result.habit);
    const habitLabel = matchedHabit ? matchedHabit.label : result.habit;
    const sentence = toSentence(result, habitLabel);

    return NextResponse.json({
      insight: sentence,
      habit: result.habit,
      delta: result.delta,
      sample_size: result.sampleSizeWith + result.sampleSizeWithout,
    });
  } catch (error: any) {
    console.error("GET /api/insight error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
