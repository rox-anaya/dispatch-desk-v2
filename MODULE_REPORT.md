# Module 4 Report — Aviation Data Import

## What Was Built
- Import scripts to populate Module 2's empty reference tables: `aircraft`, `airports`, `runways`, `navaids`
- A curated JSON seed file of ~20 common airliner types (fuel/payload/cruise specs)
- A service-role Supabase admin client for privileged, RLS-bypassing import jobs
- A unique-constraint migration so imports are safely re-runnable (upsert, not insert)
- An orchestrator script (`import-all.ts`) to run everything in the correct order

## Scope Decision — Airways & SID/STAR Deferred
This module intentionally does **not** import airways or SID/STAR procedures. Reasoning:
- Airports/runways/navaids all come from one clean, reliable open dataset (OurAirports, public domain).
- Airways and SIDs/STARs don't have an equivalent simple CSV source — they typically come from aeronautical nav databases (e.g. X-Plane's `earth_awy.dat`/`earth_fix.dat` format, or commercial providers like Navigraph), which need a different, more complex parser and raise their own data-currency/licensing questions worth a dedicated module rather than rushing into this one.
- Following the "one module, one verified piece at a time" principle: airports/aircraft/runways/navaids are independently useful right now (dispatch calculations don't strictly require airway data), so shipping this now and tackling airways/procedures as their own module is lower-risk than one large combined import.

**Recommendation:** treat Airways/SIDs/STARs as its own module later (proposed as Module 4B or folded into Module 5 planning) once we've decided on a nav-data source.

## Why Designed This Way

**Service-role client for imports, not the app's normal Supabase client**
Module 2's RLS policies only let `system_admin` write to reference tables — correct for the running app, but these import scripts run standalone from a terminal with no logged-in user session to check against. The service role key bypasses RLS entirely by design, so it's isolated into its own `admin.ts` file with a loud comment: never import this into browser-facing code.

**CSV download is a separate manual step, not automated in the script**
The scripts don't fetch the CSVs themselves. This keeps the import scripts deterministic and offline-repeatable — you control exactly which dataset snapshot you're importing, and re-running the script later doesn't silently pull new data mid-way through testing.

**Aircraft data hand-curated, not scraped**
Unlike airports, there's no single trustworthy open dataset with fuel burn/payload/cruise figures per aircraft type. A short, correct, manually-verified list of ~20 relevant types is safer than importing bulk data of uncertain accuracy — and it's easy to extend by just adding rows to `aircraft-seed.json`.

**Filtering airport types on import**
OurAirports has ~80,000 entries including closed airports and balloonports. Filtering to `large_airport`/`medium_airport`/`small_airport` keeps the table relevant to what Infinite Flight pilots would actually dispatch to.

**Upsert with unique constraints, not plain insert**
Re-running an import script (say, after downloading an updated CSV) shouldn't create duplicate rows. Migration 006 adds unique constraints on `runways(airport_id, ident)` and `navaids(ident, type)` specifically to make upserts possible.

## Packages Installed (need to be added — see Install Instructions)
- `csv-parse` — robust CSV parsing (handles quoted fields with embedded commas, which a naive `.split(",")` would break on)
- `tsx` — runs TypeScript scripts directly without a separate compile step
- `dotenv` — loads `.env.local` into these standalone scripts (Next.js does this automatically for the app itself, but standalone scripts need it explicitly)

## Database Changes
`supabase/migrations/006_module4_constraints.sql`:
- Unique constraint on `runways(airport_id, ident)`
- Unique constraint on `navaids(ident, type)`

## Environment Variables
One new variable, **server-only, never prefixed `NEXT_PUBLIC_`:**
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
Find it in Supabase Dashboard → Settings → API → service_role key.
**Never commit this or expose it to the browser** — it bypasses all RLS.

## Testing Steps
1. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`.
2. Install the new dev dependencies (see Install Instructions).
3. Run migration `006_module4_constraints.sql` in Supabase SQL Editor.
4. Download the datasets:
   ```
      curl -o scripts/data/airports.csv https://davidmegginson.github.io/ourairports-data/airports.csv
         curl -o scripts/data/runways.csv https://davidmegginson.github.io/ourairports-data/runways.csv
            curl -o scripts/data/navaids.csv https://davidmegginson.github.io/ourairports-data/navaids.csv
               ```
               5. Run `npx tsx scripts/import/import-all.ts` and watch for errors in the console.
               6. In Supabase Table Editor, spot-check: search `airports` for a familiar ICAO (e.g. `KJFK`), confirm `runways` has entries linked to it, confirm `aircraft` has your 20 seeded types, confirm `navaids` has some VOR entries near that airport.
               7. Re-run the import a second time — row counts shouldn't double (proves the upsert/unique-constraint setup works).

               ## What's Next
               **Module 5: Flight Dispatch Engine** — route planning, fuel/payload/cruise-altitude/flight-time/distance calculations using the aircraft and airport data now in place.

               ## Technical Debt / Notes
               - Airways, SIDs, and STARs are not imported — deferred to a future module pending a nav-data source decision (see Scope Decision above).
               - `navaids(ident, type)` unique constraint is a simplification — in rare real-world cases two different navaids share both an ident and type in different regions; this edge case is accepted for now.
               - Aircraft seed list covers ~20 common types; expand `aircraft-seed.json` as needed for less common types your pilots request.
               - No scheduled/automatic re-import — this is a manual, on-demand script for now. Worth revisiting once Edge Functions / background jobs are introduced later in the roadmap.
               