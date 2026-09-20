-- MoodGarden Database Schema
-- Supabase / PostgreSQL Setup Script

-- 1. Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Habits table (static reference table)
CREATE TABLE IF NOT EXISTS habits (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT
);

-- Seed default habits
INSERT INTO habits (key, label, icon) VALUES
  ('sleep', 'Slept well', '🌙'),
  ('exercise', 'Exercised', '🏃'),
  ('hydrate', 'Drank water', '💧'),
  ('socialize', 'Socialized', '👥'),
  ('eat_well', 'Ate well', '🥗')
ON CONFLICT (key) DO NOTHING;

-- 3. Entries table (one entry per user per day)
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  text TEXT,
  mood_score SMALLINT NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
  sentiment_score NUMERIC(4,3),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, entry_date)
);

-- 4. Habit logs table (habits logged per entry)
CREATE TABLE IF NOT EXISTS habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  habit_key TEXT NOT NULL REFERENCES habits(key)
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for entries
DROP POLICY IF EXISTS "Users can view own entries" ON entries;
CREATE POLICY "Users can view own entries"
  ON entries FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own entries" ON entries;
CREATE POLICY "Users can insert own entries"
  ON entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own entries" ON entries;
CREATE POLICY "Users can update own entries"
  ON entries FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own entries" ON entries;
CREATE POLICY "Users can delete own entries"
  ON entries FOR DELETE
  USING (auth.uid() = user_id);

-- 7. RLS Policies for habit_logs (scoped through parent entry)
DROP POLICY IF EXISTS "Users can view own habit logs" ON habit_logs;
CREATE POLICY "Users can view own habit logs"
  ON habit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM entries
      WHERE entries.id = habit_logs.entry_id
      AND entries.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own habit logs" ON habit_logs;
CREATE POLICY "Users can insert own habit logs"
  ON habit_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM entries
      WHERE entries.id = habit_logs.entry_id
      AND entries.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own habit logs" ON habit_logs;
CREATE POLICY "Users can delete own habit logs"
  ON habit_logs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM entries
      WHERE entries.id = habit_logs.entry_id
      AND entries.user_id = auth.uid()
    )
  );

-- 8. RLS Policy for habits (public reference data)
DROP POLICY IF EXISTS "Anyone can read habits" ON habits;
CREATE POLICY "Anyone can read habits"
  ON habits FOR SELECT
  USING (true);

-- 9. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_entries_user_date ON entries (user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_habit_logs_entry ON habit_logs (entry_id);
