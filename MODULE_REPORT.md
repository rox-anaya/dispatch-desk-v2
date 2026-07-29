# Module 3 Report — Authentication

## What Was Built
- Supabase Auth wired into the Next.js app: sign-up, sign-in, sign-out
- `middleware.ts` — protects `/dashboard`, `/admin`, `/airline` routes; refreshes session on every request
- Server actions (`signUp`, `signIn`, `signOut`) instead of client-side API calls
- `getCurrentProfile()` / `getAirlineRole()` — central helpers for "who is this and what can they do"
- `RequireRole` — server component that gates content by global role
- Email confirmation callback route
- Login/signup pages and an example protected dashboard page demonstrating role-based rendering

## Why Designed This Way

**Server Actions, not client-side fetch to API routes**
Next.js Server Actions run on the server and set auth cookies directly in the response. A client-side `fetch()` to a custom `/api/login` route can end up with the session cookie not syncing properly between client and server renders — a very common Next.js + Supabase bug. Server Actions avoid that whole class of problem.

**Middleware split into two files**
`src/lib/supabase/middleware.ts` only refreshes the session token. `middleware.ts` (root) only decides which routes require auth and redirects if missing. Keeping "refresh session" and "enforce access" separate means either can be changed (e.g., adding a new protected route) without touching the trickier cookie-handling code.

**Route protection list is one array, not scattered checks**
`PROTECTED_PREFIXES` in `middleware.ts` is the single place that defines what's gated. As the app grows to 15+ more modules, anyone (including future-you, or ChatGPT in another session) can read one file to know what's protected — rather than hunting through every page for an `if (!user) redirect()` check.

**RequireRole is a server component, not a client hook**
A `useRole()` client-side hook can be bypassed by anyone who disables JS or inspects/edits browser state — it would only be a UI convenience, not real security (the real security is still RLS from Module 2). By making `RequireRole` a server component, gated content is never sent to the browser at all if the role doesn't match, which is both more secure and avoids a "flash of admin content" bug.

**Global role vs. airline role checked separately**
`getCurrentProfile()` returns the global role (from Module 2's `profiles.role`). `getAirlineRole(airlineId)` is a separate lookup for the airline-specific role, matching the Module 2 decision to keep these two concepts independent.

## Packages Installed
None new — this module only uses `@supabase/ssr` and `@supabase/supabase-js`, already installed in Module 1.

## Database Changes
None — Module 3 uses the `profiles` and `airline_members` tables from Module 2 as-is. No new migrations.

## Environment Variables
One new variable:
```
NEXT_PUBLIC_SITE_URL=https://your-deployed-url.vercel.app
```
Used for the email confirmation redirect link. Set this in both `.env.local` (use `http://localhost:3000` or your Codespaces forwarded URL for local testing) and in Vercel's environment variables (use your real production URL).

## Testing Steps
1. Add `NEXT_PUBLIC_SITE_URL` to your env vars (see above).
2. Go to `/signup`, create an account with a real email you can check.
3. Confirm a row appears in Supabase Auth → Users, and a matching row in `profiles` (auto-created by the Module 2 trigger).
4. Click the confirmation link in your email — you should land on `/dashboard` with a session.
5. Try visiting `/dashboard` in an incognito/private tab (no session) — should redirect to `/login?redirectTo=/dashboard`.
6. Log in on that private tab — should redirect back to `/dashboard` automatically.
7. Click "Sign out" — should return you to `/login`, and `/dashboard` should redirect again if revisited.
8. Manually set your test user's `profiles.role` to `system_admin` in Supabase Table Editor, refresh `/dashboard` — the "System admin tools" block should now appear.

## What's Next
**Module 4: Aviation Data Import** — populating the empty reference tables from Module 2 (airports, aircraft, navaids, airways, SIDs/STARs, runways) from an open aviation dataset, plus the import pipeline itself (likely a Supabase Edge Function or a one-time seed script).

## Technical Debt / Notes
- Login/signup forms use plain Tailwind-styled inputs, not shadcn/ui `<Input>`/`<Button>` components — this was intentional so the files work standalone without depending on exactly which shadcn components you've generated locally. Safe to swap in shadcn components later for visual consistency once your design references are in.
- No "forgot password" flow yet — worth adding alongside Module 9 (pilot dashboard) or sooner if needed.
- No rate-limiting on sign-in attempts yet — worth revisiting in the security hardening pass (Module 17).
- OAuth (Google/Discord sign-in) not included — email/password only for now; can be added later with minimal changes to the actions file.
