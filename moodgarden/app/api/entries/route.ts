import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { fallbackStore } from "@/lib/storageFallback";
import { scoreSentiment } from "@/lib/sentiment";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { entry_date, text, mood_score, habits } = body;

    // 1. Validation
    if (
      !entry_date ||
      typeof mood_score !== "number" ||
      mood_score < 1 ||
      mood_score > 5
    ) {
      return NextResponse.json(
        { error: "Invalid input: mood_score must be 1-5 and entry_date is required." },
        { status: 400 }
      );
    }

    if (text && text.length > 500) {
      return NextResponse.json(
        { error: "Journal text exceeds 500 characters limit." },
        { status: 400 }
      );
    }

    const cleanHabits: string[] = Array.isArray(habits) ? habits : [];
    const cleanText: string = typeof text === "string" ? text : "";

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMock = url.includes("mock-project") || !url.startsWith("http");

    let userId = "local-user";
    let entryId: string;

    if (!isMock) {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      userId = user.id;

      // Upsert into entries
      const { data: entryData, error: upsertErr } = await supabase
        .from("entries")
        .upsert(
          {
            user_id: userId,
            entry_date,
            text: cleanText,
            mood_score,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,entry_date" }
        )
        .select("id")
        .single();

      if (upsertErr || !entryData) {
        console.error("Upsert entry error:", upsertErr);
        return NextResponse.json({ error: "Failed to save entry" }, { status: 500 });
      }

      entryId = entryData.id;

      // Delete existing habit_logs for this entry, then insert new ones
      await supabase.from("habit_logs").delete().eq("entry_id", entryId);

      if (cleanHabits.length > 0) {
        const habitInserts = cleanHabits.map((habit_key) => ({
          entry_id: entryId,
          habit_key,
        }));
        await supabase.from("habit_logs").insert(habitInserts);
      }

      // Non-blocking asynchronous sentiment scoring
      if (cleanText.trim().length > 0) {
        (async () => {
          try {
            const score = await scoreSentiment(cleanText);
            if (score !== null) {
              await supabase
                .from("entries")
                .update({ sentiment_score: score })
                .eq("id", entryId);
            }
          } catch (err) {
            console.warn("Async sentiment update failed:", err);
          }
        })();
      }
    } else {
      // Local development fallback
      const saved = fallbackStore.saveEntry(
        userId,
        entry_date,
        cleanText,
        mood_score,
        cleanHabits
      );
      entryId = saved.id;

      if (cleanText.trim().length > 0) {
        (async () => {
          try {
            const score = await scoreSentiment(cleanText);
            fallbackStore.updateSentiment(entryId, score);
          } catch (err) {
            console.warn("Async sentiment score failed:", err);
          }
        })();
      }
    }

    return NextResponse.json({
      id: entryId,
      entry_date,
      saved: true,
    });
  } catch (error: any) {
    console.error("POST /api/entries error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const month = req.nextUrl.searchParams.get("month"); // e.g. "2026-09"
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMock = url.includes("mock-project") || !url.startsWith("http");

    if (isMock) {
      let entries = fallbackStore.getEntries("local-user");
      if (month) {
        entries = entries.filter((e) => e.entry_date.startsWith(month));
      }
      return NextResponse.json({ entries });
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from("entries")
      .select("*, habit_logs(habit_key)")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: true });

    if (month) {
      // month is YYYY-MM
      const startDate = `${month}-01`;
      const endDate = `${month}-31`;
      query = query.gte("entry_date", startDate).lte("entry_date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("GET /api/entries DB error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedEntries = (data || []).map((row: any) => ({
      id: row.id,
      entry_date: row.entry_date,
      mood_score: row.mood_score,
      sentiment_score: row.sentiment_score,
      text: row.text,
      habits: (row.habit_logs || []).map((h: any) => h.habit_key),
    }));

    return NextResponse.json({ entries: formattedEntries });
  } catch (error: any) {
    console.error("GET /api/entries error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
