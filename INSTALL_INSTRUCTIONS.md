# Module 1 — Setup Instructions

This ZIP is **not a full runnable project** — it contains only the files I authored by hand.
The base Next.js scaffold (node_modules, package.json, tsconfig.json, etc.) must be generated
by the official CLI, since I don't have network access to run installs myself.

## Step-by-step

1. In GitHub Codespaces, run:
   ```bash
   npx create-next-app@latest dispatch-desk-v2 --typescript --tailwind --app --src-dir --import-alias "@/*"
   cd dispatch-desk-v2
   npm install @supabase/supabase-js @supabase/ssr next-pwa
   npx shadcn@latest init
   ```

2. Extract this ZIP. Copy these files into your new project, **overwriting/adding** at these exact paths:

   | File in this ZIP | Destination in your project |
   |---|---|
   | `dispatch-desk-v2/next.config.ts` | `next.config.ts` (project root — overwrite) |
   | `dispatch-desk-v2/public/manifest.json` | `public/manifest.json` (new file) |
   | `dispatch-desk-v2/src/lib/supabase/client.ts` | `src/lib/supabase/client.ts` (new file) |
   | `dispatch-desk-v2/src/lib/supabase/server.ts` | `src/lib/supabase/server.ts` (new file) |
   | `dispatch-desk-v2/.env.local.example` | `.env.local.example` (project root — reference only) |

3. Copy `.env.local.example` to `.env.local` and fill in your real Supabase URL + anon key
   (from Supabase dashboard → Settings → API). **Never commit `.env.local`.**

4. Generate two PWA icons (192x192 and 512x512 PNG) and place them in `public/icons/`.
   I can help design these once your theme references are in.

5. Push to GitHub, connect the repo to Vercel, and add the same two env variables in
   Vercel's project settings (Environment Variables).

## Empty folders included (for structure)
- `src/components/` — will hold shared UI components (Module 2+)
- `src/types/` — will hold shared TypeScript types (Module 2+)
- `public/icons/` — will hold PWA icons (you generate/add these)
