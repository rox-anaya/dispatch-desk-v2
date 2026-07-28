# Module 2 — Setup Instructions

This ZIP contains SQL migrations and a types file — no CLI scaffolding needed this time,
just running SQL against your existing Supabase project from Module 1.

## Steps

1. Extract this ZIP.

2. Copy the `supabase/migrations/` folder into your project root (alongside `src/`, `public/`, etc.):
   - `supabase/migrations/001_profiles.sql`
      - `supabase/migrations/002_airlines.sql`
         - `supabase/migrations/003_aviation_reference_data.sql`
            - `supabase/migrations/004_dispatches_and_history.sql`
               - `supabase/migrations/005_rls_policies.sql`

               3. Copy `src/types/database.ts` into your project's `src/types/` folder.

               4. Run the migrations against your Supabase project, **in order** (001 → 005).
                  Easiest method on Android: open your Supabase project dashboard → SQL Editor →
                     paste each file's contents → Run, one at a time in order.
                        (If you have the Supabase CLI working in Codespaces, `supabase db push` works too.)

                        5. Follow the **Testing Steps** section in `MODULE_REPORT.md` to confirm everything
                           (especially RLS policies) is working before moving to Module 3.

                           ## Files in this ZIP
                           ```
                           dispatch-desk-v2/
                           ├── supabase/migrations/001_profiles.sql
                           ├── supabase/migrations/002_airlines.sql
                           ├── supabase/migrations/003_aviation_reference_data.sql
                           ├── supabase/migrations/004_dispatches_and_history.sql
                           ├── supabase/migrations/005_rls_policies.sql
                           └── src/types/database.ts
                           MODULE_REPORT.md
                           CHANGELOG.md
                           PROJECT_PROGRESS.md
                           ```
                           