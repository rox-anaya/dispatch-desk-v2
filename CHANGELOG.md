# Changelog

## Module 3 — Authentication
**Date:** 2026-07-27

### Added
- `middleware.ts` — route protection for /dashboard, /admin, /airline
- `src/lib/supabase/middleware.ts` — session refresh helper
- `src/lib/auth/actions.ts` — signUp, signIn, signOut server actions
- `src/lib/auth/get-current-profile.ts` — getCurrentProfile, getAirlineRole helpers
- `src/components/auth/RequireRole.tsx` — server-side role gating component
- `src/app/(auth)/login/page.tsx` — login page
- `src/app/(auth)/signup/page.tsx` — signup page
- `src/app/auth/callback/route.ts` — email confirmation handler
- `src/app/(dashboard)/dashboard/page.tsx` — example protected page with role-based rendering

### Environment
- Added `NEXT_PUBLIC_SITE_URL` (required for email confirmation redirect)

### Notes
- No new packages or database migrations this module
- Email/password auth only — no OAuth providers yet
- No "forgot password" flow yet

---

## Module 2 — Database Schema
**Date:** 2026-07-27

### Added
- `supabase/migrations/001_profiles.sql` through `005_rls_policies.sql`
- `src/types/database.ts`

---

## Module 1 — Project Initialization & Environment Setup
**Date:** 2026-07-27

### Added
- `next.config.ts`, `public/manifest.json`
- `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`
- `.env.local.example`
