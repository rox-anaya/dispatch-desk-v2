# Dispatch Desk V2 — PROJECT_PROGRESS.md
*Single source of truth. Paste this at the start of a new chat to resume.*

---

## 1. Current Project Status
**Module 2 (Database Schema) complete.** Ready to begin Module 3 (Authentication).

## 2. Project Vision
Public, multi-airline flight planning/dispatch PWA for Infinite Flight — similar in spirit to SimBrief, not a copy. Modern aviation-SaaS aesthetic, dark theme, inspired by professional dispatch systems (not a literal cockpit). Free core features forever; premium/supporter tiers fund hosting and development.

## 3. Completed Modules

### Module 1 — Project Initialization & Environment Setup ✅
Next.js 15 (App Router, TypeScript, Tailwind) scaffolded, shadcn/ui initialized, Supabase clients set up, PWA config/manifest added, GitHub → Vercel pipeline connected.

### Module 2 — Database Schema ✅
Full Postgres schema: profiles (with global roles), airlines + membership (with per-airline roles), aviation reference data tables (airports, runways, aircraft, navaids, airways, procedures), dispatches, flight_history, a `pilot_statistics` view, and RLS policies on every table (default-deny, role-aware).

## 4. Architecture Decisions
| Decision | Reasoning |
|---|---|
| Next.js 15 App Router, single repo | Simplicity, maintainability for solo/small team |
| Supabase (Postgres+Auth+Storage+Edge Functions) | One platform for DB, auth, storage, jobs |
| `profiles` shadow table (not extending auth.users) | Supabase's supported pattern; auto-created via trigger |
| Global role (`profiles.role`) separate from per-airline role (`airline_members.role`) | A pilot's platform-wide permissions differ from their standing within any one airline |
| Aviation reference data = public read-only, system_admin write | Shared infrastructure, not owned by any single user/airline |
| Dispatches and flight_history as separate tables | A planned flight (dispatch) may never actually be flown |
| `pilot_statistics` as a view, not a stored table | Always accurate, no sync/trigger maintenance burden |
| RLS enabled on every table, default-deny | DB-level safety net independent of app code correctness |
| Dark aviation-SaaS theme | User preference — professional, not literal cockpit |

## 5. Folder Structure
```
dispatch-desk-v2/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   │   └── supabase/
│   ├── types/
│   │   └── database.ts        # NEW (Module 2)
├── supabase/
│   └── migrations/             # NEW (Module 2)
│       ├── 001_profiles.sql
│       ├── 002_airlines.sql
│       ├── 003_aviation_reference_data.sql
│       ├── 004_dispatches_and_history.sql
│       └── 005_rls_policies.sql
├── public/
│   ├── icons/
│   └── manifest.json
├── .env.local
└── next.config.ts
```

## 6. Installed Packages
- `@supabase/supabase-js`
- `@supabase/ssr`
- `next-pwa`
- shadcn/ui
- (No new packages in Module 2 — pure SQL)

## 7. Database Schema & Migrations
**Tables:** profiles, airlines, airline_members, airports, runways, aircraft, navaids, airways, airway_waypoints, procedures, procedure_waypoints, dispatches, flight_history
**Views:** pilot_statistics
**Enums:** user_role, airline_member_role, dispatch_status
**Security:** RLS enabled on all tables; helper functions `is_system_admin()`, `is_airline_admin(uuid)`
**Migration files:** see folder structure above (001–005)

## 8. Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 9. API Routes Created
None yet — Module 3 introduces auth-related routes/middleware.

## 10. Remaining Tasks / Module Roadmap
1. ✅ Project initialization & environment setup
2. ✅ Database schema
3. ⬜ Authentication (roles: Pilot / Airline Admin / System Admin)
4. ⬜ Aviation data import (airports, aircraft, navdata, airways, SIDs/STARs, runways)
5. ⬜ Flight dispatch engine (route, fuel, payload, altitude, time, distance)
6. ⬜ Weather integration (METAR/TAF/NOTAM)
7. ⬜ OFP generation + professional PDF export
8. ⬜ .fpl and KML export (Infinite Flight import-compatible)
9. ⬜ Pilot dashboard
10. ⬜ Pilot logbook + dispatch history
11. ⬜ Flight statistics UI
12. ⬜ Virtual Airline management (multi-airline, branding, dashboards)
13. ⬜ Admin dashboard + analytics
14. ⬜ Monetization (premium features, donations, supporter memberships, VA subscriptions)
15. ⬜ Testing strategy implementation
16. ⬜ Logging & monitoring
17. ⬜ Security hardening pass
18. ⬜ Launch prep

## 11. Next Recommended Module
**Module 3: Authentication** — sign-up/login/logout flows, session middleware, protected routes, role-based UI rendering based on `profiles.role` and `airline_members.role`.

## 12. Implementation Notes / Technical Debt
- PWA icons (192x192, 512x512) still not generated
- Design references for dark aviation-SaaS theme still pending from user
- `pilot_statistics` view may need to become a materialized view at scale
- No soft-delete pattern yet — worth revisiting before Module 9/10 if audit trails matter
- No testing framework or logging/monitoring chosen yet
