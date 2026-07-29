# Changelog

## Module 4 — Aviation Data Import
**Date:** 2026-07-28

### Added
- `src/lib/supabase/admin.ts` — service-role client for privileged import scripts
- `scripts/data/aircraft-seed.json` — curated list of ~20 common airliner types
- `scripts/import/import-aircraft.ts`
- `scripts/import/import-airports.ts`
- `scripts/import/import-runways.ts`
- `scripts/import/import-navaids.ts`
- `scripts/import/import-all.ts` — orchestrator
- `supabase/migrations/006_module4_constraints.sql` — unique constraints for idempotent upserts

### Environment
- Added `SUPABASE_SERVICE_ROLE_KEY` (server-only, never exposed to browser)

### Dev Dependencies (need manual install — see INSTALL_INSTRUCTIONS.md)
- `csv-parse`, `tsx`, `dotenv`

### Scope Note
- Airways and SID/STAR procedures intentionally deferred to a future module — see MODULE_REPORT.md

---

## Module 3 — Authentication
**Date:** 2026-07-27
Sign-up/sign-in/sign-out, session middleware, route protection, role-based gating.

## Module 2 — Database Schema
**Date:** 2026-07-27
Profiles/roles, airlines, aviation reference tables, dispatches, flight_history, RLS.

## Module 1 — Project Initialization & Environment Setup
**Date:** 2026-07-27
Next.js 15, Tailwind, shadcn/ui, Supabase clients, PWA config, GitHub → Vercel pipeline.
