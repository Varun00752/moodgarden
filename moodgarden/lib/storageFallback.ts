/**
 * Local development fallback store for when Supabase credentials are placeholders.
 * Ensures the app can be fully previewed, tested, and used locally immediately.
 */
import { Entry, HabitLog } from "@/types";

declare global {
  var __moodgarden_entries: Map<string, Entry> | undefined;
  var __moodgarden_habit_logs: Map<string, HabitLog[]> | undefined;
}

if (!global.__moodgarden_entries) {
  global.__moodgarden_entries = new Map();
}
if (!global.__moodgarden_habit_logs) {
  global.__moodgarden_habit_logs = new Map();
}

export const fallbackStore = {
  getEntries(userId: string): Entry[] {
    const list: Entry[] = [];
    global.__moodgarden_entries?.forEach((entry) => {
      if (entry.user_id === userId || userId === "local-user") {
        const habits = (global.__moodgarden_habit_logs?.get(entry.id) || []).map(
          (h) => h.habit_key
        );
        list.push({ ...entry, habits });
      }
    });
    return list.sort((a, b) => b.entry_date.localeCompare(a.entry_date));
  },

  getEntryByDate(userId: string, date: string): Entry | null {
    let found: Entry | null = null;
    global.__moodgarden_entries?.forEach((entry) => {
      if ((entry.user_id === userId || userId === "local-user") && entry.entry_date === date) {
        const habits = (global.__moodgarden_habit_logs?.get(entry.id) || []).map(
          (h) => h.habit_key
        );
        found = { ...entry, habits };
      }
    });
    return found;
  },

  saveEntry(
    userId: string,
    entryDate: string,
    text: string,
    moodScore: number,
    habits: string[]
  ): Entry {
    let existing = this.getEntryByDate(userId, entryDate);
    const entryId = existing?.id || crypto.randomUUID();

    const newEntry: Entry = {
      id: entryId,
      user_id: userId,
      entry_date: entryDate,
      text,
      mood_score: moodScore,
      sentiment_score: existing?.sentiment_score ?? null,
      created_at: existing?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      habits,
    };

    global.__moodgarden_entries?.set(entryId, newEntry);

    const habitLogs: HabitLog[] = habits.map((h) => ({
      id: crypto.randomUUID(),
      entry_id: entryId,
      habit_key: h,
    }));
    global.__moodgarden_habit_logs?.set(entryId, habitLogs);

    return newEntry;
  },

  updateSentiment(entryId: string, sentiment: number | null) {
    const entry = global.__moodgarden_entries?.get(entryId);
    if (entry) {
      entry.sentiment_score = sentiment;
      global.__moodgarden_entries?.set(entryId, entry);
    }
  },
};
