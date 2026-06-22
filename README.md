# The Global Call — COP Youth Platform

Unified platform on **theglobalcall.org**:

| URL | Surface |
|-----|---------|
| `/` | Marketing landing (`sites/marketing/index.html`) |
| `/buildthefuture` | Partner funnel (Build the Future) |
| `/insights` | COP Youth Policy Implementation wizard |
| `/faq` | FAQ |

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Local URLs: `/`, `/buildthefuture`, `/insights`, `/faq`

## Deploy (Vercel)

```bash
vercel deploy --prod
```

Domain: `theglobalcall.org` (+ `www`). Legacy hosts (`youthframework.*`, `insights.*`) redirect to `/insights`.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Deployment & DevOps](docs/DEPLOYMENT.md)
- [Engineering standards](docs/STANDARDS.md)
