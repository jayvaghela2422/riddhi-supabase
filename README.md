# Go Shop Black – Supabase + Next.js Paid Test
**Timebox:** 3–5 hours • **Stack:** Supabase (your own project) + Next.js (App Router)

Use **your own Supabase account/project**. Do not request access to ours.

## Build
- Email/password auth (Supabase Auth)
- List all `businesses` (name, category, city, created_at)
- Add Business form (logged-in only). Attach `owner = auth.uid()` and enforce via RLS
- Realtime: new businesses appear for all users without refresh
- Deploy to Vercel and share preview

See `schema.sql` for required schema & policies.

## Deliverables
- GitHub repo + Vercel preview
- README explaining auth, realtime, and RLS choices

## Evaluation (100 pts)
- Security/RLS 30 • Correctness 25 • Code Quality 20 • UX 10 • Docs 10 • Deploy 5

## Steps
1) Create a new Supabase project (your account), run `schema.sql`
2) Set env vars in Next/Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3) Implement features and deploy
