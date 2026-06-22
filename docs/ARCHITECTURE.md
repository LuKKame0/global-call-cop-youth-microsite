# Architecture — The Global Call / COP Youth Platform

## Production URLs (theglobalcall.org)

| Path | Source | Purpose |
|------|--------|---------|
| `/` | `sites/marketing/index.html` | Main marketing landing |
| `/buildthefuture` | `sites/marketing/build-the-future.html` | Strategic partner funnel |
| `/insights` | `app/insights/page.tsx` | Youth Policy Implementation wizard |
| `/faq` | `app/faq/page.tsx` | FAQ & examples |
| `/api/submit` | Framework submissions | |
| `/api/apply`, `/api/partner`, `/api/coordination` | Marketing funnels | |

## Legacy redirects

| Legacy host / path | Redirect |
|--------------------|----------|
| `youthframework.theglobalcall.org` | `theglobalcall.org/insights` |
| `insights.theglobalcall.org` | `theglobalcall.org/insights` |
| `/framework` | `/insights` |
| `/build-the-future` | `/buildthefuture` |

## Directory layout

```
sites/marketing/       Static HTML source (index, build-the-future)
public/marketing/      Build output (sync script — gitignored)
app/
  insights/            Framework submission surface
  faq/
  api/
lib/
  branding/routes.ts   Canonical paths & domain
  email/               Unified Resend layer
middleware.ts          Static rewrites + legacy host redirects
```

## Routing

Middleware rewrites:

- `GET /` → `public/marketing/index.html`
- `GET /buildthefuture` → `public/marketing/build-the-future.html`
- `GET /insights` → Next.js React wizard (with SiteHeader/Footer)

Marketing pages are static (no React layout). Framework/FAQ use `app/layout.tsx`.

## Email

All forms use `lib/email/` with light-mode branded templates. Framework submissions include full personalized theme content in internal notifications.

## Marketing leads CRM

Lead forms persist to segmented JSON stores:

- `data/leads/apply.json`
- `data/leads/partner.json`
- `data/leads/coordination.json`

When `DATABASE_URL` is set, leads also mirror to Postgres (`marketing_leads`).

Admin CRM: `/admin/leads` (requires `platform_admin` login).

Export segmented JSON: `/api/admin/leads/export?type=apply|partner|coordination`

## Related docs

- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [STANDARDS.md](./STANDARDS.md)
