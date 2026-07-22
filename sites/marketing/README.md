# Marketing site (The Global Call)

Static HTML/CSS/JS source for the **marketing surface** of the platform.

## Routes (production)

| Path | File | Purpose |
|------|------|---------|
| `/` | `index.html` | Main landing — `theglobalcall.org` |
| `/buildthefuture` | `build-the-future.html` | Strategic partner funnel |

## Build integration

This folder is **not deployed independently** in the unified architecture. At build time:

```bash
npm run sync:marketing
```

copies and transforms assets to `public/marketing/` for serving via Next.js middleware (host-based routing).

## Forms

Forms POST to unified Next.js API routes:

- `/api/apply` — join applications (`index.html`)
- `/api/partner` — partnership inquiries (`index.html`)
- `/api/coordination` — Build the Future funnel

Email logic lives in `lib/email/marketing/`.

## Legacy standalone deploy

The `api/` folder and local `vercel.json` remain for reference only. Prefer the root Next.js deploy for production.

## Local preview

1. `npm run dev`
2. Framework surface: `http://localhost:3000`
3. Marketing preview: set `SITE_KIND=marketing` in `.env.local`, or open static files from `public/marketing/` after sync.
