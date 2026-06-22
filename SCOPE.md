# COP Youth Policy Implementation Platform — SCOPE

## What is being built

Evolution of the COP Youth Policy Implementation MVP (public submission microsite) into a sovereign-grade, multi-tenant global coordination platform with authentication, role-based access control, analytics, and institutional reporting.

## For whom

- **Global Call COP** — primary organization operating the youth policy framework
- **Partner NGOs/institutions** — each operates as an independent tenant (organization)
- **National focal points** — submit and manage their country's policy implementation data
- **Regional coordinators** — oversee submissions within their UN regional group
- **Platform administrators** — manage the overall platform across all organizations

## Constraints

- Must stay deployable on Vercel (serverless)
- Open source first, self-hostable
- No vendor lock-in (no Supabase Auth, no proprietary services)
- No Kubernetes, no microservices
- Existing public submission flow must continue working without auth
- Zero downtime migration from Google Sheets to Postgres

## Done criteria

### Phase 1 (current)
- [x] PostgreSQL schema (Neon serverless) with multi-tenant isolation
- [x] Auth.js v5 (magic link + Google OAuth, JWT strategy)
- [x] RBAC with 5 role levels
- [x] Dashboard shell with role-adaptive navigation
- [x] Submission list and detail views
- [x] User/member management with invite API
- [x] Analytics dashboard (region, theme, timeline charts)
- [x] Report generation (JSON export)
- [x] Backward-compatible: public form unchanged, Sheets sync optional
- [x] All existing tests passing
- [x] TypeScript clean

### Phase 2 (completed 18 mayo 2026)
- [x] pgvector embeddings (1024 dims, NVIDIA NV-EmbedQA-E5-v5)
- [x] AI enrichment pipeline (NVIDIA NIM: classify, summarize)
- [x] Semantic search API + UI
- [x] Geospatial: country geometries + SVG world map
- [x] Processing queue with retry logic
- [x] Enrichments table (generic AI output storage)

### Phase 3 (completed 18 mayo 2026)
- [x] PDF report export (@react-pdf/renderer) with cover page, executive summary, metrics, theme analysis, submissions register
- [x] Scoped report templates (org / region / country)
- [x] Cross-country comparison matrix (theme coverage, policy maturity, readiness, SDGs)
- [x] CSV export of submissions (all 12 theme fields)
- [x] AI-generated executive summary integrated into PDF reports
- [x] TypeScript clean, 18 tests passing

### Phase 4 (completed 18 mayo 2026)
- [x] Rate limiting (sliding window per IP per endpoint)
- [x] Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- [x] Postgres RLS policies on all tenant-scoped tables
- [x] RLS context helper (set_config per transaction)
- [x] Audit log dashboard with action badges and IP tracking
- [x] Input sanitization (strip scripts, HTML tags, event handlers, javascript: URIs)

### Phase 5 (planned)
- [ ] PostHog self-hosted analytics
- [ ] Multilingual report generation
- [ ] Cross-org data sharing (opt-in)
- [ ] API pública para integración con terceros
