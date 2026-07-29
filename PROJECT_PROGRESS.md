# Dispatch Desk V2 — PROJECT_PROGRESS.md
*Single source of truth. Paste this at the start of a new chat to resume.*

---

## 1. Current Project Status
**Module 3 (Authentication) complete.** Ready to begin Module 4 (Aviation Data Import).

## 2. Project Vision
Public, multi-airline flight planning/dispatch PWA for Infinite Flight — similar in spirit to SimBrief, not a copy. Modern aviation-SaaS aesthetic, dark theme, inspired by professional dispatch systems (not a literal cockpit). Free core features forever; premium/supporter tiers fund hosting and development.

## 3. Completed Modules

### Module 1 — Project Initialization & Environment Setup ✅
Next.js 15, Tailwind, shadcn/ui, Supabase clients, PWA config, GitHub → Vercel pipeline.

### Module 2 — Database Schema ✅
Profiles/roles, airlines + membership, aviation reference tables, dispatches, flight_history, pilot_statistics view, RLS on every table.

### Module 3 — Authentication ✅
Supabase Auth (sign-up/sign-in/sign-out via Server Actions), session-refresh + route-protection middleware, `getCurrentProfile`/`getAirlineRole` helpers, server-side `RequireRole` gating component, email confirmation flow, example protected dashboard page.

## 4. Architecture Decisions
| Decision | Reasoning |
|---|---|
| Next.js 15 App Router, single repo | Simplicity, maintainability |
| Supabase (Postgres+Auth+Storage+Edge Functions) | Unified backend |
| `profiles` shadow table, auto-created via trigger | Supabase's supported pattern |
| Global role vs per-airline role kept separate | Different scopes of permission |
| Reference data public read-only, system_admin write | Shared infrastructure |
| Dispatches vs flight_history as separate tables | A plan isn't the same as a flown flight |
| `pilot_statistics` as a view | Always accurate, no sync burden |
| RLS default-deny on every table | DB-level safety net |
| Server Actions for auth (not client fetch to API routes) | Avoids cookie/session sync bugs |
| Route protection centralized in one middleware array | One place to audit what's gated |
| `RequireRole` as a server component | Real security, not just UI convenience |
| Dark aviation-SaaS theme | User preference |

## 5. Folder Structure
```
dispatch-desk-v2/
├── middleware.ts                          # NEW (Module 3)
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx             # NEW (Module 3)
│   │   │   └── signup/page.tsx            # NEW (Module 3)
│   │   ├── (dashboard)/
│   │   │   └── dashboard/page.tsx         # NEW (Module 3)
│   │   └── auth/callback/route.ts         # NEW (Module 3)
│   ├── components/
│   │   └── auth/RequireRole.tsx           # NEW (Module 3)
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── actions.ts                 # NEW (Module 3)
│   │   │   └── get-current-profile.ts     # NEW (Module 3)
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── middleware.ts              # NEW (Module 3)
│   └── types/database.ts
├── supabase/migrations/ (001–005)
├── public/{icons/, manifest.json}
├── .env.local
└── next.config.ts
```

## 6. Installed Packages
`@supabase/supabase-js`, `@supabase/ssr`, `next-pwa`, shadcn/ui — no new packages in Modules 2 or 3.

## 7. Database Schema & Migrations
See Module 2 (unchanged this module): profiles, airlines, airline_members, airports, runways, aircraft, navaids, airways, airway_waypoints, procedures, procedure_waypoints, dispatches, flight_history, pilot_statistics view, RLS policies.

## 8. Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=          # NEW (Module 3) — used for email confirmation redirect
```

## 9. API Routes Created
- `GET /auth/callback` — exchanges email confirmation code for a session

## 10. Remaining Tasks / Module Roadmap
1. ✅ Project initialization & environment setup
2. ✅ Database schema
3. ✅ Authentication
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
14. ⬜ Monetization
15. ⬜ Testing strategy implementation
16. ⬜ Logging & monitoring
17. ⬜ Security hardening pass
18. ⬜ Launch prep

## 11. Next Recommended Module
**Module 4: Aviation Data Import** — sourcing an open airport/navdata dataset and building the import pipeline to populate Module 2's reference tables.

## 12. Implementation Notes / Technical Debt
- PWA icons still not generated; design references still pending
- `pilot_statistics` may need to become a materialized view at scale
- No soft-delete pattern yet
- Auth forms use plain Tailwind, not shadcn components yet — cosmetic only, safe to restyle later
- No "forgot password" flow yet
- No rate-limiting on login attempts yet (planned for Module 17 security pass)
- No OAuth providers yet (email/password only)
- No testing framework or logging/monitoring chosen yet
