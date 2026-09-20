# Contributing to MoodGarden

Thank you for your interest in contributing to MoodGarden! We welcome bug fixes, documentation improvements, and feature contributions.

## Code of Conduct
Please be respectful and constructive in all issues and pull requests.

## Local Development Setup

1. **Prerequisites**:
   - Node.js (v18+ or v20+ LTS recommended)
   - npm or pnpm
   - Supabase account (free tier)
   - Hugging Face account (free access token)

2. **Clone & Install**:
   ```bash
   git clone https://github.com/your-username/moodgarden.git
   cd moodgarden/moodgarden # or cd moodgarden if root
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   Add your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `HUGGINGFACE_API_KEY`

4. **Database Setup**:
   Run the SQL script located in `supabase/schema.sql` in your Supabase SQL Editor.

5. **Start Dev Server**:
   ```bash
   npm run dev
   ```

6. **Run Tests**:
   ```bash
   node --test test/logic.test.mjs
   ```

7. **Build Check**:
   ```bash
   npm run build
   ```

## Pull Request Guidelines
- Ensure your code adheres to TypeScript typing without any `any` bypasses unless strictly necessary.
- Verify tests pass and the production build compiles cleanly (`npm run build`).
- Provide a clear PR description detailing your changes and screenshots for UI updates.
