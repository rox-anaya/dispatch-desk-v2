# Changelog

## Module 1 — Project Initialization & Environment Setup
**Date:** 2026-07-27

### Added
- `next.config.ts` — PWA configuration via `next-pwa`
- `public/manifest.json` — PWA manifest (dark theme colors, app metadata)
- `src/lib/supabase/client.ts` — Supabase browser client
- `src/lib/supabase/server.ts` — Supabase server client (cookie-based session handling)
- `.env.local.example` — environment variable template

### Setup performed (via CLI, not included as files)
- Next.js 15 App Router project scaffolded (TypeScript, Tailwind, src-dir)
- shadcn/ui initialized
- Dependencies installed: `@supabase/supabase-js`, `@supabase/ssr`, `next-pwa`
- GitHub repo created, connected to Vercel for auto-deploy

### Notes
- PWA icons not yet generated (needs 192x192 + 512x512 PNGs)
- No database schema yet — Module 2
- No authentication logic yet — Module 3
