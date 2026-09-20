/**
 * Hugging Face Inference API Sentiment Scoring
 * Model: distilbert-base-uncased-finetuned-sst-2-english
 * Fallback: Returns null on timeout (>5s) or API error to ensure non-blocking UX.
 */

export async function scoreSentiment(text: string): Promise<number | null> {
  if (!text || text.trim().length === 0) return null;

  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey || apiKey.startsWith("mock-")) {
      // Local development without live token
      return null;
    }

    const res = await fetch(
      "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) {
      console.warn("Hugging Face API returned non-OK status:", res.status);
      return null;
    }

    const data = await res.json();
    // Expected shape: [[{label: "POSITIVE", score: 0.98}, {label: "NEGATIVE", score: 0.02}]]
    const top = Array.isArray(data) && Array.isArray(data[0]) ? data[0][0] : null;
    if (!top || typeof top.score !== "number") return null;

    // Normalize to single -1..1 scale
    const rawScore = top.label === "POSITIVE" ? top.score : -top.score;
    return Math.round(rawScore * 1000) / 1000;
  } catch (error) {
    console.warn("Sentiment scoring timed out or failed gracefully:", error);
    return null;
  }
}
