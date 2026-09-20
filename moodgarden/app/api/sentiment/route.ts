import { NextRequest, NextResponse } from "next/server";
import { scoreSentiment } from "@/lib/sentiment";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { fallbackStore } from "@/lib/storageFallback";

export async function POST(req: NextRequest) {
  try {
    const { entry_id, text } = await req.json();

    if (!entry_id || typeof text !== "string") {
      return NextResponse.json(
        { error: "entry_id and text string required" },
        { status: 400 }
      );
    }

    const sentiment_score = await scoreSentiment(text);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMock = url.includes("mock-project") || !url.startsWith("http");

    if (isMock) {
      fallbackStore.updateSentiment(entry_id, sentiment_score);
    } else {
      const supabase = await createServerSupabaseClient();
      await supabase
        .from("entries")
        .update({ sentiment_score })
        .eq("id", entry_id);
    }

    return NextResponse.json({ sentiment_score });
  } catch (error: any) {
    console.warn("Sentiment route error (graceful):", error);
    return NextResponse.json({ sentiment_score: null });
  }
}
