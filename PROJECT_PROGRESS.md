# Dispatch Desk V2 — PROJECT_PROGRESS.md
*Single source of truth. Paste this at the start of a new chat to resume.*

---

## 1. Current Project Status
**Module 4 (Aviation Data Import) complete.** Ready to begin Module 5 (Flight Dispatch Engine). Airways/SIDs/STARs import was scoped out of Module 4 — see note in section 12.

## 2. Project Vision
Public, multi-airline flight planning/dispatch PWA for Infinite Flight — similar in spirit to SimBrief, not a copy. Modern aviation-SaaS aesthetic, dark theme, inspired by professional dispatch systems (not a literal cockpit). Free core features forever; premium/supporter tiers fund hosting and development.

## 3. Completed Modules

### Module 1 — Project Initialization & Environment Setup ✅
Next.js 15, Tailwind, shadcn/ui, Supabase clients, PWA config, GitHub → Vercel pipeline.

### Module 2 — Database Schema ✅
Profiles/roles, airlines + membership, aviation reference tables, dispatches, flight_history, pilot_statistics view, RLS on every table.

### Module 3 — Authentication ✅
Supabase Auth (sign-up/sign-in/sign-out via Server Actions), session/route-protection middleware, role helpers, server-side `RequireRole` gating, email confirmation flow.

### Module 4 — Aviation Data Import ✅
Import scripts (aircraft, airports, runways, navaids) using OurAirports open data + a hand-curated aircraft spec list. Service-role admin client for privileged imports. Unique constraints added for idempotent upserts. Airways/SIDs/STARs explicitly deferred.

## 4. Architecture Decisions
| Decision | Reasoning |
|---|---|
| Next.js 15 App Router, single repo | Simplicity, maintainability |
| Supabase (Postgres+Auth+Storage+Edge Functions) | Unified backend |
| Global role vs per-airline role kept separate | Different scopes of permission |
| Dispatches vs flight_history as separate tables | A plan isn't the same as a flown flight |
| RLS default-deny on every table | DB-level safety net |
| Server Actions for auth | Avoids cookie/session sync bugs |
| `RequireRole` as a server component | Real security, not just UI convenience |
| Service-role client isolated to `admin.ts`, scripts-only | Bypasses RLS deliberately, never browser-facing |
| Aircraft data hand-curated, not scraped | No reliable open dataset covers fuel/payload/cruise specs consistently |
| Airports filtered to large/medium/small only | Keeps ~80k OurAirports rows relevant to actual dispatch use |
| Airways/SIDs/STARs deferred to a future module | Needs a different, more complex data source; avoids rushing a combined import |
| Dark aviation-SaaS theme | User preference |

## 5. Folder Structure
```
dispatch-desk-v2/
├── middleware.ts
├── scripts/                                # NEW (Module 4)
│   ├── data/aircraft-seed.json
│   └── import/
│       ├── import-aircraft.ts
│       ├── import-airports.ts
│       ├── import-runways.ts
│       ├── import-navaids.ts
│       └── import-all.ts
├── src/
│   ├── app/ (auth, dashboard routes)
│   ├── components/auth/RequireRole.tsx
│   ├── lib/
│   │   ├── auth/
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       ├── middleware.ts
│   │       └── admin.ts                    # NEW (Module 4)
│   └── types/database.ts
├── supabase/migrations/ (001–006)
├── public/{icons/, manifest.json}
├── .env.local
└── next.config.ts
```

## 6. Installed Packages
`@supabase/supabase-js`, `@supabase/ssr`, `next-pwa`, shadcn/ui
**New dev dependencies (Module 4):** `csv-parse`, `tsx`, `dotenv`

## 7. Database Schema & Migrations
Modules 2 tables (unchanged) + Migration 006: unique constraints on `runways(airport_id, ident)` and `navaids(ident, type)` for idempotent imports.

**Data populated (Module 4):** `aircraft` (~20 curated types), `airports` (OurAirports, large/medium/small only), `runways`, `navaids` (VOR/NDB/DME only — plain waypoints deferred).

## 8. Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
SUPABASE_SERVICE_ROLE_KEY=      # NEW (Module 4) — server-only, never expose to browser
```

## 9. API Routes Created
- `GET /auth/callback` — exchanges email confirmation code for a session
(No new API routes in Module 4 — scripts run standalone via terminal, not through the app.)

## 10. Remaining Tasks / Module Roadmap
1. ✅ Project initialization & environment setup
2. ✅ Database schema
3. ✅ Authentication
4. ✅ Aviation data import (airports/aircraft/runways/navaids — airways/SIDs/STARs deferred)
5. ⬜ Flight dispatch engine (route, fuel, payload, altitude, time, distance)
6. ⬜ Weather integration (METAR/TAF/NOTAM)
7. ⬜ OFP generation + professional PDF export
8. ⬜ .fpl and KML export (Infinite Flight import-compatible)
9. ⬜ Pilot dashboard
10. ⬜ Pilot logbook + dispatch history
11. ⬜ Flight statistics UI
12. ⬜ Virtual Airline management (multi-airline, branding, dashboards)
13. ⬜ Admin dashboard + analytics
14. ⬜ Monetization
15. ⬜ Testing strategy implementation
16. ⬜ Logging & monitoring
17. ⬜ Security hardening pass
18. ⬜ Launch prep
19. ⬜ (Unscheduled) Airways/SIDs/STARs import — needs data-source decision

## 11. Next Recommended Module
**Module 5: Flight Dispatch Engine** — building route planning, fuel calculation, payload calculation, cruise altitude selection, flight time, and distance calculation using the aircraft/airport data now in the database.

## 12. Implementation Notes / Technical Debt
- PWA icons still not generated; design references still pending
- `pilot_statistics` may need to become a materialized view at scale
- No soft-delete pattern yet
- Auth forms use plain Tailwind, not shadcn components yet
- No "forgot password" flow, no rate-limiting on login, no OAuth providers yet
- **Airways/SIDs/STARs explicitly not imported in Module 4** — needs a nav-data source decision (X-Plane default data vs. commercial provider) before scheduling that module
- `navaids(ident, type)` unique constraint is a known simplification (rare real-world duplicate idents across regions not handled)
- Aircraft seed list covers ~20 common types — expand as needed
- No scheduled/automatic re-import job — manual script only for now
- No testing framework or logging/monitoring chosen yet
