# Build Tasks — MoodGarden

Work through these in order. Each milestone should leave the app in a
runnable state. Check items off as completed.

## Milestone 1 — Project scaffold
- [x] `create-next-app` with TypeScript + Tailwind + App Router
- [x] Install `@supabase/supabase-js`, `@supabase/ssr`, `framer-motion`
- [x] Set up `.env.local` and `.env.local.example` (see SETUP.md)
- [x] Apply the design tokens from DESIGN_SYSTEM.md to `tailwind.config.ts`
      and `globals.css` (colors, fonts, dark mode via `class` strategy)
- [x] Add Fraunces + Inter via Google Fonts in `layout.tsx`

## Milestone 2 — Database
- [x] Create Supabase project
- [x] Run all SQL from DATABASE_SCHEMA.md in order: tables → seed →
      RLS enable → policies → indexes
- [x] Verify RLS by testing a query with and without a valid session

## Milestone 3 — Auth
- [x] `lib/supabaseClient.ts` — browser client
- [x] Server client helper using `@supabase/ssr` for route handlers
- [x] `/login` page: email/password form, calls
      `supabase.auth.signInWithPassword`
- [x] `/signup` page: calls `supabase.auth.signUp`
- [x] `middleware.ts`: redirect unauthenticated users away from
      `/today` and `/garden` to `/login`
- [x] Logout button/action

## Milestone 4 — Entry flow (no AI yet)
- [x] `components/MoodPicker.tsx`
- [x] `components/HabitChecklist.tsx` (fetch habit list from `habits` table)
- [x] `components/EntryForm.tsx` combining both + text area
- [x] `POST /api/entries` route: upsert entry + replace habit_logs
- [x] `GET /api/entries/:date` route
- [x] Wire `/today` page to load today's existing entry (if any) and save

## Milestone 5 — Garden visualization
- [x] `lib/moodColor.ts`: mood score → color per DESIGN_SYSTEM.md table
- [x] `GET /api/entries?month=` route
- [x] `components/GardenGrid.tsx`: 7-column month grid, fetch + render tiles
- [x] `components/GardenTile.tsx`: color, bloom icon by habit count,
      fade+scale-in animation with stagger
- [x] `components/DayModal.tsx`: click tile → show that day's entry
- [x] Month navigation (prev/next arrows)

## Milestone 6 — AI: sentiment scoring
- [x] `lib/sentiment.ts` exactly as specified in AI_FEATURES.md
- [x] `POST /api/sentiment` route
- [x] Call sentiment scoring right after entry save (fire-and-forget or
      awaited — document which you chose and why)
- [x] Handle null/failed sentiment gracefully in the UI (no crash, no
      blocking spinner forever)

## Milestone 7 — AI: correlation insight
- [x] `lib/correlation.ts` exactly as specified in AI_FEATURES.md
- [x] `GET /api/insight` route, including the `toSentence()` formatting
- [x] `components/InsightCard.tsx` — shows the sentence, or a friendly
      "keep logging, insights unlock after two weeks" message if
      `not_enough_data`
- [x] Place `InsightCard` above or below `GardenGrid` on `/garden`

## Milestone 8 — Polish
- [x] `components/ThemeToggle.tsx` + dark mode CSS variables
- [x] Full mobile responsiveness pass at 375px width
- [x] `prefers-reduced-motion` handling in Framer Motion configs
- [x] Empty states: new user with zero entries sees a friendly prompt,
      not a blank grid
- [x] Loading states: skeleton tiles while garden data fetches
- [x] Error states: failed save shows a toast, doesn't lose the user's
      typed text

## Milestone 9 — Deploy & verify
- [ ] Push to GitHub, connect Vercel, add env vars
- [ ] Test full flow on the deployed URL from an actual phone
- [ ] Re-enable Supabase email confirmation if it was disabled for testing
- [ ] Write the project README (separate from this doc set) with
      screenshots/GIF, setup instructions, and the tech stack list

## Milestone 10 — Get real usage (for the resume claim)
- [ ] Share link with 15–20 real users
- [ ] Collect at least one piece of qualitative feedback
- [ ] Note actual user count and timeframe for the resume line
