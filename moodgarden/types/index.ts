export interface Habit {
  key: string;
  label: string;
  icon?: string;
}

export interface Entry {
  id: string;
  user_id: string;
  entry_date: string; // YYYY-MM-DD
  text: string | null;
  mood_score: number; // 1 - 5
  sentiment_score: number | null; // -1.000 to 1.000
  created_at?: string;
  updated_at?: string;
  habits?: string[];
}

export interface EntryInput {
  entry_date: string;
  text: string;
  mood_score: number;
  habits: string[];
}

export interface HabitLog {
  id: string;
  entry_id: string;
  habit_key: string;
}

export interface EntryWithHabits {
  mood_score: number;
  habits: string[];
}

export interface CorrelationResult {
  habit: string;
  delta: number; // avg mood WITH habit - avg mood WITHOUT
  sampleSizeWith: number;
  sampleSizeWithout: number;
}

export interface InsightResponse {
  insight: string | null;
  habit?: string;
  delta?: number;
  sample_size?: number;
  reason?: "not_enough_data";
}
