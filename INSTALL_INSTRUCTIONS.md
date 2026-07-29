# Module 3 — Setup Instructions

## Steps

1. Extract this ZIP.

2. Copy these files/folders into your project, preserving paths exactly:
   ```
      middleware.ts                                  → project root (new file)
         src/lib/supabase/middleware.ts                 → new file
            src/lib/auth/actions.ts                        → new file
               src/lib/auth/get-current-profile.ts            → new file
                  src/components/auth/RequireRole.tsx            → new file
                     src/app/(auth)/login/page.tsx                  → new file
                        src/app/(auth)/signup/page.tsx                 → new file
                           src/app/auth/callback/route.ts                 → new file
                              src/app/(dashboard)/dashboard/page.tsx          → new file
                                 ```
                                    Note: folders in parentheses like `(auth)` and `(dashboard)` are Next.js
                                       "route groups" — they organize files without adding to the URL. `/login`
                                          works even though the folder is `(auth)/login`.

                                          3. Add the new environment variable to `.env.local`:
                                             ```
                                                NEXT_PUBLIC_SITE_URL=http://localhost:3000
                                                   ```
                                                      (Use your actual Codespaces forwarded URL if testing there instead of localhost.
                                                         Update to your real Vercel URL in production env vars.)

                                                         4. Also add `NEXT_PUBLIC_SITE_URL` in your Vercel project's Environment Variables
                                                            (production value = your real deployed URL).

                                                            5. In Supabase Dashboard → Authentication → URL Configuration, add your site URL
                                                               and `/auth/callback` path to the allowed redirect URLs list.

                                                               6. Run through the **Testing Steps** in `MODULE_REPORT.md` before moving to Module 4.

                                                               ## Files in this ZIP
                                                               ```
                                                               dispatch-desk-v2/
                                                               ├── middleware.ts
                                                               └── src/
                                                                   ├── app/
                                                                       │   ├── (auth)/login/page.tsx
                                                                           │   ├── (auth)/signup/page.tsx
                                                                               │   ├── (dashboard)/dashboard/page.tsx
                                                                                   │   └── auth/callback/route.ts
                                                                                       ├── components/auth/RequireRole.tsx
                                                                                           └── lib/
                                                                                                   ├── auth/actions.ts
                                                                                                           ├── auth/get-current-profile.ts
                                                                                                                   └── supabase/middleware.ts
                                                                                                                   MODULE_REPORT.md
                                                                                                                   CHANGELOG.md
                                                                                                                   PROJECT_PROGRESS.md
                                                                                                                   ```
                                                                                                                   