# Setup — MoodGarden

## Accounts needed (all free tier)
1. **Supabase** — supabase.com → New Project → note the project URL and
   the `anon` public key, and the `service_role` key (server-side only).
2. **Hugging Face** — huggingface.co → Settings → Access Tokens → create a
   read-only token.
3. **Vercel** — vercel.com → connect your GitHub repo for auto-deploy.
4. **GitHub** — repo to host the code and connect to Vercel.

## Local install
```bash
npx create-next-app@latest moodgarden --typescript --tailwind --app
cd moodgarden
npm install @supabase/supabase-js @supabase/ssr framer-motion
```

## Environment variables (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-side only, never exposed to client
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxx
```

Create `.env.local.example` with the same keys but placeholder values, and
commit that file (never commit `.env.local` itself — confirm it's in
`.gitignore`).

## Supabase project setup
1. In the Supabase SQL editor, run everything in `DATABASE_SCHEMA.md`
   (create tables → seed habits → enable RLS → create policies → indexes),
   in that order.
2. In Supabase Auth settings, enable Email provider (default), disable
   email confirmation for faster local testing if desired (re-enable
   before any public demo).

## Running locally
```bash
npm run dev
```
Visit `http://localhost:3000`.

## Deploying
1. Push the repo to GitHub.
2. In Vercel, import the repo.
3. Add all four environment variables from `.env.local` into Vercel's
   Project Settings → Environment Variables.
4. Deploy. Vercel auto-builds on every push to `main`.

## Getting real test users (for the resume line)
- Share the deployed link with 15–20 classmates, ask them to log entries
  for two weeks.
- Optionally add a simple feedback form (Google Form link in the footer)
  to collect a quote or two you can reference if asked in an interview.

## Pre-interview checklist
- [ ] App is deployed and the link works from a phone, not just your laptop
- [ ] You can explain the RLS policies without looking at the code
- [ ] You can explain what happens if the Hugging Face API call fails
- [ ] You can explain the `MIN_SAMPLE = 7` choice in the correlation logic
- [ ] You have a 60-second live demo path memorized: sign up → log an
      entry → show the garden tile appear → show the insight card
