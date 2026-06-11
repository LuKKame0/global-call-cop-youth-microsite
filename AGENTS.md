# Agent Guide — The Global Call / COP Youth Platform

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This project uses **Next.js 16** — APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## What this is

Unified platform for **theglobalcall.org**: a static marketing landing (`sites/marketing/`), a partner funnel (`/buildthefuture`), and a Next.js policy-implementation wizard (`/insights`) with admin dashboard, Postgres (Neon + Drizzle ORM), Auth.js, and transactional email.

## Commands

| Task | Command |
|---|---|
| Install | `npm install` |
| Dev server | `npm run dev` (runs marketing sync first) |
| Build | `npm run build` |
| Lint / types | `npm run lint` · `npm run typecheck` |
| Tests | `npm test` (Vitest) |
| DB schema | `npm run db:generate` · `npm run db:push` |

Before committing, always run: `npm run lint && npm run typecheck && npm test`.

## Structure

```
app/            Next.js App Router (pages, API routes, dashboard)
components/     React components
lib/            Domain logic: auth/, db/ (Drizzle schema), email, content
middleware.ts   Routing/auth middleware (legacy-host redirects live here)
sites/marketing/  Static landing — synced to public/marketing/ by scripts/
scripts/        sync-marketing-to-public.mjs (runs on pre-dev/pre-build)
docs/           ARCHITECTURE.md, DEPLOYMENT.md, STANDARDS.md, BRANDING.md
```

`public/marketing/` is generated — never edit it directly; edit `sites/marketing/` instead.

## Environment & security rules (non-negotiable)

1. **No secrets in code or commits.** All credentials come from environment variables. `.env.example` documents every variable with empty/placeholder values — that is the only env file tracked by git.
2. Copy `.env.example` → `.env.local` for local work. Database and email features degrade gracefully when unset; the wizard UI runs without them.
3. Never hardcode emails, API keys, connection strings, or access codes — including in tests (use obviously fake fixtures).
4. Sandbox first: do not point `DATABASE_URL` at any production database. Use a free Neon branch or local Postgres.
5. If you find a leaked credential anywhere, stop and flag it — do not commit, do not use it.

## Conventions

- TypeScript strict; Tailwind 4; Prettier enforced (`npm run format`).
- Validation with Zod at every API boundary.
- See `docs/STANDARDS.md` for the full engineering standards.
