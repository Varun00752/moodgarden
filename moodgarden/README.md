# MoodGarden — AI Mood & Habit Journal

<p align="center">
  <img src="public/moodgarden_architecture.jpg" alt="MoodGarden Architecture and Pipeline" width="100%" />
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.3-black?logo=next.js" alt="Next.js" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css" alt="Tailwind CSS" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Auth%20%26%20Postgres-3ECF8E?logo=supabase" alt="Supabase" /></a>
  <a href="https://huggingface.co"><img src="https://img.shields.io/badge/Hugging_Face-DistilBERT-FFD21E?logo=huggingface" alt="Hugging Face" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" /></a>
</p>

> **"A journal that tells you *why* you feel the way you do, and shows it as a garden."**

MoodGarden is a daily journaling application designed to make emotional reflection rewarding and insightful. In under 60 seconds a day, users log their mood, track daily habits (sleep, exercise, hydration, socializing, nutrition), and write a short reflection. The app scores sentiment with AI, calculates statistically grounded habit correlations, and visualizes the month as a blooming calendar garden.

---

## Quickstart & Local Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org) v18+ or v20+ LTS
- [Git](https://git-scm.com)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create `.env.local` from `.env.local.example`:
```bash
cp .env.local.example .env.local
```

Configure your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
HUGGINGFACE_API_KEY=hf_your_api_token
```
*(Note: With placeholder keys, the app automatically runs in local memory fallback mode.)*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Run Unit Tests & Build
```bash
node --test test/logic.test.mjs
npm run build
```

---

## License

This project is licensed under the [MIT License](LICENSE).
