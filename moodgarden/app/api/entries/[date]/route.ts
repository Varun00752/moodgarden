import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { fallbackStore } from "@/lib/storageFallback";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params;
    if (!date) {
      return NextResponse.json({ error: "Date parameter required" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMock = url.includes("mock-project") || !url.startsWith("http");

    if (isMock) {
      const entry = fallbackStore.getEntryByDate("local-user", date);
      if (!entry) {
        return NextResponse.json({ error: "Entry not found" }, { status: 404 });
      }
      return NextResponse.json(entry);
    }

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
      .select("*, habit_logs(habit_key)")
      .eq("user_id", user.id)
      .eq("entry_date", date)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      entry_date: data.entry_date,
      mood_score: data.mood_score,
      sentiment_score: data.sentiment_score,
      text: data.text,
      habits: (data.habit_logs || []).map((h: any) => h.habit_key),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
