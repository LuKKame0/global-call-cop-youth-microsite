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

## Hero globe (3D background)

The hero renders a photorealistic Three.js earth — NASA Blue Marble surface with real terrain relief (displacement + normal maps), glossy "glass" oceans (clearcoat + inverted-specular roughness), drifting clouds — plus 194 country nodes (color-coded by region with brand palette) and animated great-circle arcs representing multilateral coordination.

- `globe.js` — scene, PBR earth, shaders, arcs, theme sync, performance guards
- `globe-data.js` — `[name, iso2, lat, lon, region]` per independent country (generated from `world-countries@5.1.0`, MIT)
- `assets/earth/` — albedo/normal/specular/clouds (three.js examples, NASA imagery, public domain) + bump (threex.planets, MIT)
- `vendor/three.module.min.js` + `vendor/three.core.min.js` — three.js r180, self-hosted so the CSP (`script-src 'self'`) holds; the sync script copies `vendor/` verbatim (no path rewriting)

Behavior: WebGL unavailable → falls back to the 2D canvas network in `main.js`; `prefers-reduced-motion` → renders one static frame; pauses when the tab is hidden or the hero scrolls off-screen. ES modules require HTTP — preview with `npx serve sites/marketing` (or `npm run dev`), not `file://`.

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
