# Dispatch Desk V2 — PROJECT_PROGRESS.md
*Single source of truth. Paste this at the start of a new chat to resume.*

---

## 1. Current Project Status
**Module 1 (Foundation Setup) complete.** Ready to begin Module 2 (Database Schema).

## 2. Project Vision
Public, multi-airline flight planning/dispatch PWA for Infinite Flight — similar in spirit to SimBrief, not a copy. Modern aviation-SaaS aesthetic, dark theme, inspired by professional dispatch systems (not a literal cockpit). Free core features forever; premium/supporter tiers fund hosting and development.

## 3. Completed Modules

### Module 1 — Project Initialization & Environment Setup ✅
- Next.js 15 (App Router, TypeScript, Tailwind, src-dir) scaffolded
- shadcn/ui initialized
- Supabase client dependencies installed
- PWA config (`next-pwa`) + manifest set up
- GitHub repo → Vercel auto-deploy pipeline connected
- **Files sent:** `next.config.ts`, `public/manifest.json`, setup commands (given as chat instructions/code blocks, not as downloadable files — user runs these directly in Codespaces terminal)

## 4. Architecture Decisions
| Decision | Reasoning |
|---|---|
| Next.js 15 App Router (not separate front/back repos) | Single deployable unit; file-based routing; fits solo/small-team maintainability |
| Supabase (Postgres+Auth+Storage+Edge Functions) | One platform for DB, auth, file storage, background jobs — avoids managing 4 services early |
| Row Level Security for roles (Pilot/Airline Admin/System Admin) | Permission enforcement at DB layer, not just app code — more secure by default |
| Vercel hosting | Built by Next.js team; free tier; auto-deploy from GitHub |
| Dark aviation-SaaS theme | User preference — professional, not literal cockpit; readability/responsiveness prioritized |

## 5. Folder Structure
```
dispatch-desk-v2/
├── src/
│   ├── app/               # routes (pages, layouts, API routes)
│   ├── components/        # shared UI components
│   ├── lib/
│   │   └── supabase/      # client + server Supabase instances
│   └── types/             # shared TypeScript types
├── public/
│   ├── icons/             # PWA icons (192x192, 512x512 — not yet generated)
│   └── manifest.json
├── .env.local
└── next.config.ts
```

## 6. Installed Packages
- `@supabase/supabase-js`
- `@supabase/ssr`
- `next-pwa`
- shadcn/ui (via CLI — adds `components.json`, `components/ui/*`)

## 7. Database Schema & Migrations
None yet. Scheduled for Module 2: users, airlines, pilots, airports, aircraft, navigation data, dispatches, flight history, statistics.

## 8. Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
(Set in `.env.local` locally and in Vercel dashboard for production.)

## 9. API Routes Created
None yet.

## 10. Remaining Tasks / Module Roadmap
1. ✅ Project initialization & environment setup
2. ⬜ Database schema (all core tables + RLS foundations)
3. ⬜ Authentication (roles: Pilot / Airline Admin / System Admin)
4. ⬜ Aviation data (airports, aircraft, navdata, airways, SIDs/STARs, runways)
5. ⬜ Flight dispatch engine (route, fuel, payload, altitude, time, distance)
6. ⬜ Weather integration (METAR/TAF/NOTAM)
7. ⬜ OFP generation + professional PDF export
8. ⬜ .fpl and KML export
9. ⬜ Pilot dashboard
10. ⬜ Pilot logbook + dispatch history
11. ⬜ Flight statistics
12. ⬜ Virtual Airline management (multi-airline, branding, dashboards)
13. ⬜ Admin dashboard + analytics
14. ⬜ Monetization (premium features, donations, supporter memberships, VA subscriptions)
15. ⬜ Testing strategy implementation
16. ⬜ Logging & monitoring
17. ⬜ Security hardening pass
18. ⬜ Launch prep

## 11. Next Recommended Module
**Module 2: Database Schema** — design tables/relationships for users, airlines, pilots, airports, aircraft, navigation data, dispatches, flight history, and statistics, plus initial RLS policies.

## 12. Implementation Notes / Technical Debt
- PWA icons (192x192, 512x512) not yet generated — needed before manifest is fully functional
- Design references for dark aviation-SaaS theme pending from user — UI/component styling to follow once received
- No testing framework chosen yet
- No logging/monitoring chosen yet
