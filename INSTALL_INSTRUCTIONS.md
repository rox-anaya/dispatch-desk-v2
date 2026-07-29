# Module 4 — Setup Instructions

## Steps

1. Extract this ZIP. Copy these into your project, preserving paths:
   ```
      src/lib/supabase/admin.ts                    → new file
         scripts/data/aircraft-seed.json               → new file
            scripts/import/import-aircraft.ts             → new file
               scripts/import/import-airports.ts             → new file
                  scripts/import/import-runways.ts              → new file
                     scripts/import/import-navaids.ts              → new file
                        scripts/import/import-all.ts                  → new file
                           supabase/migrations/006_module4_constraints.sql → new file
                              ```

                              2. Install new dev dependencies (in Codespaces terminal):
                                 ```bash
                                    npm install --save-dev csv-parse tsx dotenv
                                       ```

                                       3. Add to `.env.local` (get the key from Supabase Dashboard → Settings → API → service_role):
                                          ```
                                             SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
                                                ```
                                                   **Do not** add this to Vercel's environment variables unless you specifically need
                                                      server-side admin actions in production later — for now it's only used by scripts
                                                         run manually from your terminal, never by the deployed app itself.

                                                         4. Run the new migration in Supabase SQL Editor:
                                                            `supabase/migrations/006_module4_constraints.sql`

                                                            5. Download the OurAirports datasets into `scripts/data/`:
                                                               ```bash
                                                                  curl -o scripts/data/airports.csv https://davidmegginson.github.io/ourairports-data/airports.csv
                                                                     curl -o scripts/data/runways.csv https://davidmegginson.github.io/ourairports-data/runways.csv
                                                                        curl -o scripts/data/navaids.csv https://davidmegginson.github.io/ourairports-data/navaids.csv
                                                                           ```

                                                                           6. (Optional but recommended) Add convenience scripts to your `package.json`:
                                                                              ```json
                                                                                 "scripts": {
                                                                                      "import:all": "tsx scripts/import/import-all.ts",
                                                                                           "import:aircraft": "tsx scripts/import/import-aircraft.ts",
                                                                                                "import:airports": "tsx scripts/import/import-airports.ts",
                                                                                                     "import:runways": "tsx scripts/import/import-runways.ts",
                                                                                                          "import:navaids": "tsx scripts/import/import-navaids.ts"
                                                                                                             }
                                                                                                                ```
                                                                                                                   Then you can just run `npm run import:all`.

                                                                                                                   7. Run the import: `npx tsx scripts/import/import-all.ts` (or `npm run import:all` if you added the scripts above).

                                                                                                                   8. Follow the **Testing Steps** in `MODULE_REPORT.md` to verify the data landed correctly.

                                                                                                                   ## Files in this ZIP
                                                                                                                   ```
                                                                                                                   dispatch-desk-v2/
                                                                                                                   ├── src/lib/supabase/admin.ts
                                                                                                                   ├── scripts/
                                                                                                                   │   ├── data/aircraft-seed.json
                                                                                                                   │   └── import/
                                                                                                                   │       ├── import-aircraft.ts
                                                                                                                   │       ├── import-airports.ts
                                                                                                                   │       ├── import-runways.ts
                                                                                                                   │       ├── import-navaids.ts
                                                                                                                   │       └── import-all.ts
                                                                                                                   └── supabase/migrations/006_module4_constraints.sql
                                                                                                                   MODULE_REPORT.md
                                                                                                                   CHANGELOG.md
                                                                                                                   PROJECT_PROGRESS.md
                                                                                                                   ```
                                                                                                                   