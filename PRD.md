# PRD — MoodGarden

## Problem
Mood trackers log data but rarely explain it. Users see a mood chart but no
insight into what's driving it. MoodGarden closes that gap with lightweight
AI analysis, presented in a calm, non-clinical visual style.

## Target user
Someone who wants a 60-second daily journaling habit with a payoff: a visual
that feels rewarding to look at, and an occasional insight that feels earned,
not gimmicky.

## Core user flow
1. User signs up / logs in.
2. User lands on "Today" screen: writes a short journal entry, picks a mood
   (1–5 scale, emoji-labeled), checks off habits completed today.
3. On submit: entry is saved, sentiment score is computed via AI, both are
   stored against today's date.
4. User visits "Garden" screen: a calendar grid where each day is a colored
   tile (color = mood score) with a small bloom icon if a habit streak was
   kept. Clicking a tile shows that day's entry.
5. Weekly, an "Insight" card appears: a one-line correlation statement
   generated from the user's own data (e.g. "You've scored 1.3 points
   higher on mood on days you exercised, over the last 14 entries.").

## Features — must have (v1)
- Auth: sign up, log in, log out, session persistence
- Daily entry: text (max 500 chars), mood picker (5 states), habit
  checkboxes (configurable list, default: Sleep well, Exercise, Hydrate,
  Socialize, Eat well)
- One entry per user per day (edit allowed same day)
- Sentiment scoring on submit (see AI_FEATURES.md)
- Garden view: month grid, color-coded by mood, bloom icon by habit count
- Day detail view/modal: shows entry text, mood, habits, sentiment score
- Insight card: correlation calculation, refreshed weekly or on demand
- Light/dark mode toggle
- Fully responsive (phone-first)

## Features — nice to have (v2, only if v1 is solid)
- Streak counter (consecutive days logged)
- Export entries as JSON/CSV
- Multiple habit sets / custom habit creation
- Push/email weekly summary

## Explicit non-goals (do not build)
- No social features, sharing, or public profiles
- No native mobile app — web only, responsive
- No offline mode
- No multi-language support in v1
- No admin dashboard

## Success criteria
- A new user can sign up and log their first entry in under 60 seconds
- Garden view loads in under 1 second for a full year of entries
- Sentiment scoring completes in under 3 seconds and never blocks the UI
  (entry saves immediately; sentiment attaches asynchronously if slow)
- App is usable and looks correct on a 375px-wide mobile viewport
