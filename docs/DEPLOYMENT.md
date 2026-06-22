# Deployment & DevOps

## Production domain

**Primary:** `https://theglobalcall.org`

| Path | Surface |
|------|---------|
| `/` | Marketing landing |
| `/buildthefuture` | Build the Future funnel |
| `/insights` | Framework wizard |
| `/faq` | FAQ |

## Vercel

- **Project:** `cop-youth-policy`
- **Root directory:** repository root
- **Build:** `npm run build` (includes marketing sync via `prebuild`)

### Domain setup

1. Add `theglobalcall.org` and `www.theglobalcall.org` to the Vercel project.
2. DNS A record `@` → `76.76.21.21`
3. Optional CNAME `www` → `cname.vercel-dns.com`

### Legacy domains (optional)

Point `youthframework.theglobalcall.org` and `insights.theglobalcall.org` to the same Vercel project — middleware redirects to `theglobalcall.org/insights`.

## Environment variables (production)

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | `https://theglobalcall.org` |
| `EMAIL_API_KEY` | Resend key |
| `SENDER_EMAIL` | Verified sender |
| `INTERNAL_NOTIFY_EMAILS` | `ops@example.com` |
| `AUTH_SECRET` | openssl rand -hex 32 |
| `DATABASE_URL` | Neon connection string |

## Deploy

```bash
npm run sync:marketing
npm run typecheck
vercel deploy --prod
```

## CI

GitHub Actions: `.github/workflows/ci.yml` — typecheck, lint, test on push/PR.

## Local preview

```bash
npm run dev
```

- `http://localhost:3000/` — marketing landing
- `http://localhost:3000/buildthefuture` — partner funnel
- `http://localhost:3000/insights` — framework
