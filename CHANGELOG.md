# Changelog

## Module 2 — Database Schema
**Date:** 2026-07-27

### Added
- `supabase/migrations/001_profiles.sql` — profiles table, user_role enum, signup trigger
- `supabase/migrations/002_airlines.sql` — airlines + airline_members tables
- `supabase/migrations/003_aviation_reference_data.sql` — airports, runways, aircraft, navaids, airways, airway_waypoints, procedures, procedure_waypoints
- `supabase/migrations/004_dispatches_and_history.sql` — dispatches, flight_history, pilot_statistics view
- `supabase/migrations/005_rls_policies.sql` — RLS policies + helper functions on all tables
- `src/types/database.ts` — TypeScript types matching the schema

### Notes
- No packages added this module
- No env variables added this module
- Reference data tables (airports/aircraft/navaids) are structurally ready but empty — populated in Module 4

---

## Module 1 — Project Initialization & Environment Setup
**Date:** 2026-07-27

### Added
- `next.config.ts` — PWA configuration via `next-pwa`
- `public/manifest.json` — PWA manifest (dark theme colors, app metadata)
- `src/lib/supabase/client.ts` — Supabase browser client
- `src/lib/supabase/server.ts` — Supabase server client (cookie-based session handling)
- `.env.local.example` — environment variable template

### Setup performed (via CLI, not included as files)
- Next.js 15 App Router project scaffolded (TypeScript, Tailwind, src-dir)
- shadcn/ui initialized
- Dependencies installed: `@supabase/supabase-js`, `@supabase/ssr`, `next-pwa`
- GitHub repo created, connected to Vercel for auto-deploy

### Notes
- PWA icons not yet generated (needs 192x192 + 512x512 PNGs)
