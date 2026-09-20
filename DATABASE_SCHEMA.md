# Database Schema — MoodGarden (Supabase / Postgres)

## Tables

### `entries`
One row per user per day.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK, default `gen_random_uuid()` | |
| user_id | uuid, FK → `auth.users.id` | not null |
| entry_date | date | not null; unique together with `user_id` |
| text | text | max 500 chars, enforced in app layer |
| mood_score | smallint | 1–5, not null |
| sentiment_score | numeric(4,3) | nullable; -1.000 to 1.000, filled async by AI call |
| created_at | timestamptz | default `now()` |
| updated_at | timestamptz | default `now()`, updated on edit |

Constraint: `UNIQUE (user_id, entry_date)` — enforces one entry per day.

### `habit_logs`
One row per habit checked for a given entry.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK, default `gen_random_uuid()` | |
| entry_id | uuid, FK → `entries.id` ON DELETE CASCADE | |
| habit_key | text | e.g. `'sleep'`, `'exercise'`, `'hydrate'`, `'socialize'`, `'eat_well'` |

### `habits` (static reference table, seeded once — not user-editable in v1)

| Column | Type | Notes |
|---|---|---|
| key | text, PK | e.g. `'exercise'` |
| label | text | e.g. `'Exercise'` |
| icon | text | emoji or icon name for UI |

Seed rows:
```sql
insert into habits (key, label, icon) values
  ('sleep', 'Slept well', '🌙'),
  ('exercise', 'Exercised', '🏃'),
  ('hydrate', 'Drank water', '💧'),
  ('socialize', 'Socialized', '👥'),
  ('eat_well', 'Ate well', '🥗');
```

## SQL — create tables
```sql
create extension if not exists pgcrypto;

create table entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  text text,
  mood_score smallint not null check (mood_score between 1 and 5),
  sentiment_score numeric(4,3),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, entry_date)
);

create table habits (
  key text primary key,
  label text not null,
  icon text
);

create table habit_logs (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references entries(id) on delete cascade,
  habit_key text not null references habits(key)
);
```

## Row Level Security (RLS)
Enable RLS and restrict all access to the row's own `user_id`.

```sql
alter table entries enable row level security;

create policy "Users can view own entries"
  on entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own entries"
  on entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own entries"
  on entries for delete
  using (auth.uid() = user_id);

-- habit_logs: scope through the parent entry's user_id
alter table habit_logs enable row level security;

create policy "Users can view own habit logs"
  on habit_logs for select
  using (
    exists (
      select 1 from entries
      where entries.id = habit_logs.entry_id
      and entries.user_id = auth.uid()
    )
  );

create policy "Users can insert own habit logs"
  on habit_logs for insert
  with check (
    exists (
      select 1 from entries
      where entries.id = habit_logs.entry_id
      and entries.user_id = auth.uid()
    )
  );

create policy "Users can delete own habit logs"
  on habit_logs for delete
  using (
    exists (
      select 1 from entries
      where entries.id = habit_logs.entry_id
      and entries.user_id = auth.uid()
    )
  );

-- habits table is public read-only reference data
alter table habits enable row level security;
create policy "Anyone can read habits"
  on habits for select
  using (true);
```

## Indexes
```sql
create index idx_entries_user_date on entries (user_id, entry_date desc);
create index idx_habit_logs_entry on habit_logs (entry_id);
```
