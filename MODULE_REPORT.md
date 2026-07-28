# Module 2 Report — Database Schema

## What Was Built
Full Postgres schema (via 5 SQL migration files) covering:
- User profiles + global role system (pilot / airline_admin / system_admin)
- Airlines + many-to-many pilot membership with per-airline roles
- Aviation reference data: airports, runways, aircraft, navaids, airways (+ waypoints), SID/STAR procedures (+ waypoints)
- Dispatches (planned flights) and flight_history (actually-flown flights)
- A `pilot_statistics` view (not a table) for always-accurate stats
- Row Level Security (RLS) policies on every table

## Why Designed This Way

**Profiles separate from auth.users**
Supabase manages `auth.users` internally — we never extend it directly. Instead, `profiles` is a 1:1 shadow table holding app-specific fields, auto-created via a trigger when someone signs up. This is the standard, safe Supabase pattern.

**Global role vs. airline role are separate**
`profiles.role` answers "what can this person do platform-wide" (e.g., is this a system_admin?). `airline_members.role` answers "what can this person do within *this specific airline*" (member vs admin). A pilot's global role is `pilot` but they might be an `admin` of one airline and a plain `member` of another — these needed to be independent.

**Reference data is public read-only**
Airports, aircraft, navaids, etc. are shared infrastructure, not owned by any pilot or airline. Everyone can read them; only `system_admin` can write (via the data import pipeline planned for Module 4). This matches how SimBrief-style platforms treat aviation data — a shared public resource.

**Dispatches vs. flight_history are separate tables**
A dispatch (flight plan) can exist and never be flown — that's normal and shouldn't be conflated with "did the flight happen." `flight_history` only exists for dispatches that were actually flown, and carries fields (actual times, landing rate) that don't make sense on an unflown plan.

**Statistics as a view, not a table**
Storing pre-computed stats risks them going stale if flight_history changes. A view recalculates live from `flight_history` on every query — always correct, and simpler than maintaining triggers to keep a stats table in sync. If this becomes a performance bottleneck at scale, it can be converted to a materialized view with a refresh schedule later — noted as technical debt below.

**RLS as default-deny**
Every table has RLS enabled with no implicit access — policies must explicitly grant it. For a public multi-tenant platform, this means a bug in the Next.js app code (e.g., forgetting a `.eq('pilot_id', ...)` filter) still can't leak another pilot's private dispatch data, because the database itself blocks it regardless of what the app queries for.

## Packages Installed
None new this module — pure SQL migrations, no additional npm packages.

## Database Changes
5 migration files added under `supabase/migrations/`:
1. `001_profiles.sql` — profiles, user_role enum, auto-create-on-signup trigger
2. `002_airlines.sql` — airlines, airline_members, airline_member_role enum
3. `003_aviation_reference_data.sql` — airports, runways, aircraft, navaids, airways, airway_waypoints, procedures, procedure_waypoints
4. `004_dispatches_and_history.sql` — dispatches, flight_history, dispatch_status enum, pilot_statistics view
5. `005_rls_policies.sql` — RLS enabled + policies on all tables, plus `is_system_admin()` and `is_airline_admin()` helper functions

## Environment Variables
No new variables this module (still just the two Supabase keys from Module 1).

## Testing Steps
1. In Supabase SQL Editor (or via CLI `supabase db push`), run migrations 001 → 005 in order.
2. Sign up a test user via Supabase Auth → confirm a matching row auto-appears in `profiles`.
3. As that user, try `select * from profiles` — should return all profiles (public read).
4. Try `update profiles set full_name = 'Test' where id != auth.uid()` — should affect 0 rows (blocked by RLS).
5. Insert a test airline with your `owner_id`, confirm you can update it, confirm a different user cannot.
6. Insert a dispatch as your pilot_id, confirm another test user cannot see or edit it unless they're an airline_admin for that dispatch's airline.
7. Manually insert a flight_history row and query `select * from pilot_statistics where pilot_id = '...'` — confirm numbers match.

## What's Next
**Module 3: Authentication** — wiring up Supabase Auth in the Next.js app itself: sign-up/login/logout flows, session middleware, protected routes, and role-based UI (pilot vs airline_admin vs system_admin views).

## Technical Debt / Notes
- `pilot_statistics` is a plain view; fine at current scale, but should become a materialized view (with a refresh job) if pilot counts get large enough that live aggregation slows down.
- Aviation reference data tables are empty — actual airport/aircraft/navdata import is Module 4, likely sourced from an open aviation dataset.
- No soft-delete pattern yet (deletes are hard deletes via cascade). Worth revisiting before Module 9 (dispatch history) if audit trails matter.
