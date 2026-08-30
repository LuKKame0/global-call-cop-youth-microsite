# DEVLOG — COP Youth Policy Platform

## 2026-05-18 — Phase 1: Foundation → Dashboard (8 steps)

### Decisions

**Database: Neon serverless Postgres + Drizzle ORM**
- Neon over Supabase: no bundled auth conflict, scale-to-zero billing, plain Postgres wire protocol
- Drizzle over Prisma: no codegen step, no cold-start binary, first-class Neon driver support
- Schema: 9 tables (organizations, users, accounts, verification_tokens, user_org_roles, submissions, rag_chunks, processing_queue, audit_log)

**Auth: Auth.js v5 with JWT strategy**
- JWT over database sessions: no session table query per request, edge middleware compatible
- Providers: Resend magic link (reuses existing EMAIL_API_KEY) + Google OAuth (optional)
- Roles embedded in JWT token via `jwt` callback querying `user_org_roles`

**Tenant isolation: query-layer, not RLS**
- `withTenant(orgId)` pattern appends `.where(eq(table.organizationId, orgId))`
- RLS deferred to Phase 2 as defense-in-depth layer
- Reason: simpler to debug and test at application level

**Charts: Recharts**
- Lightweight, React-native, no vendor lock-in
- 3 chart types: BarChart (region), PieChart (theme), AreaChart (timeline)

### Dead ends

- Eager Neon client initialization in `lib/db/index.ts` broke tests (no `DATABASE_URL` in test env). Fixed with lazy Proxy pattern.
- Auth.js Drizzle adapter requires exact snake_case column names (`refresh_token` not `refreshToken`) and `integer` not `bigint` for `expires_at`.

### Build state

**Tag: FUNCTIONAL**

All 8 steps completed, TypeScript clean, 18 tests passing. Platform is architecturally complete for Phase 1 but requires:
1. Neon database provisioning + `DATABASE_URL` env var
2. `npx drizzle-kit push` to create tables
3. `npx tsx lib/db/seed.ts` to create default org + admin user
4. `AUTH_SECRET` env var (generate with `openssl rand -hex 32`)
5. Optional: `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` for Google OAuth

### Files created

```
drizzle.config.ts
middleware.ts
lib/db/schema.ts, lib/db/index.ts, lib/db/seed.ts
lib/auth/config.ts, lib/auth/permissions.ts
lib/tenant/context.ts, lib/tenant/queries.ts
lib/submit-db.ts
lib/analytics/queries.ts
lib/reports/generator.ts
app/api/auth/[...nextauth]/route.ts
app/api/organizations/route.ts
app/api/organizations/[orgId]/invite/route.ts
app/api/reports/route.ts
app/(auth)/login/page.tsx, app/(auth)/verify/page.tsx
app/(dashboard)/layout.tsx, app/(dashboard)/dashboard/page.tsx
app/(dashboard)/org/[orgSlug]/{page,submissions,analytics,reports,users,settings}
app/(dashboard)/admin/{organizations,users}
components/dashboard/{shell,sidebar,topbar,stats-cards,submission-table,report-actions}.tsx
components/analytics/{region-chart,theme-chart,timeline-chart}.tsx
```

### Files modified

```
lib/submit-service.ts — added Postgres as primary store, Sheets as optional sync
lib/db/index.ts — lazy Proxy to avoid eager init without DATABASE_URL
.env.example — added DATABASE_URL, AUTH_SECRET, AUTH_GOOGLE_*, SYNC_TO_SHEETS
```

---

## 2026-05-18 — Phase 2: AI + Geospatial (6 steps)

### Decisions

**pgvector for embeddings (1024 dimensions)**
- Neon supports pgvector natively, no extra extension install needed
- 1024 dims matches NVIDIA NV-EmbedQA-E5-v5 default output
- Embeddings table linked to rag_chunks via FK, scoped by org

**NVIDIA NIM as inference provider**
- OpenAI-compatible API (embeddings + chat completions)
- Adapter pattern in `lib/ai/` allows swapping providers without changing business logic
- Models: `nvidia/nv-embedqa-e5-v5` (embed), `meta/llama-3.1-70b-instruct` (chat)
- All API keys lazy-loaded, no crash if NIM not configured

**Enrichments table for AI outputs**
- Generic schema: sourceType + sourceId + enrichmentType + result JSONB
- Supports classifications, summaries, and any future AI output
- Model and confidence tracked per enrichment

**SVG-based map (no Leaflet/Mapbox)**
- Zero external dependencies, lightweight, works in SSR
- Mercator projection via lat/lng → SVG coordinate mapping
- Country centroids from `world-countries` package (already a dependency)
- Colored by UN region, bubble size by submission count

**Processing queue for async AI jobs**
- Existing `processing_queue` table from Phase 1 now has handlers
- 3 job types: `embed`, `classify`, `regional_summary`
- Retry logic (max 3 attempts) with error tracking
- Jobs enqueued automatically on submission persist

### Dead ends

- Tried chaining `.where()` twice on Drizzle query builder — Drizzle consumes `.where()` and removes it from the type. Fixed by building condition with `and()` before passing to single `.where()`.

### Build state

**Tag: FUNCTIONAL**

Phase 2 complete. TypeScript clean, 18 tests passing. AI features require:
1. `NIM_API_KEY` env var set
2. pgvector extension enabled on Neon (free tier supports it)
3. Country geometries seeded: `npx tsx lib/db/seed-countries.ts`

### Files created (Phase 2)

```
lib/ai/types.ts           — InferenceProvider interface, EmbeddingResult, GenerationResult
lib/ai/index.ts            — Provider registry + getProvider()
lib/ai/nim.ts              — NVIDIA NIM client (embed + generate)
lib/ai/embed-pipeline.ts   — Batch embedding of RAG chunks
lib/ai/enrichment.ts       — classifySubmission(), generateRegionalSummary()
lib/ai/process-queue.ts    — Job processor with handlers + retry
lib/ai/semantic-search.ts  — pgvector cosine similarity search
lib/geo/queries.ts         — getSubmissionMapData(), getCountryCoverage()
lib/db/seed-countries.ts   — Seed 250 countries with centroids from world-countries

app/api/search/route.ts                          — Semantic search endpoint (POST, RBAC)
app/(dashboard)/org/[orgSlug]/search/page.tsx     — Search UI page

components/dashboard/semantic-search.tsx  — Search panel with results display
components/dashboard/submission-map.tsx   — SVG world map with submission bubbles
```

### Files modified (Phase 2)

```
lib/db/schema.ts    — added embeddings, enrichments, countryGeometries tables
lib/submit-db.ts    — enqueues embed + classify jobs after DB persist
.env.example        — added NIM_API_KEY, NIM_BASE_URL, NIM_*_MODEL, AI_PROVIDER
components/dashboard/sidebar.tsx — added Search nav item
app/(dashboard)/org/[orgSlug]/page.tsx — added SubmissionMap to overview
```

---

## 2026-05-18 — Phase 3: Institutional Reports + Export (5 steps)

### Decisions

**PDF generation: @react-pdf/renderer**
- Server-side rendering to Buffer → Uint8Array for NextResponse
- Component-based layout: cover page, executive summary, metrics grid, theme analysis, submissions register
- Brand colors (pink, green, blue, orange) per theme for visual consistency

**Report scoping: org / region / country**
- `generateReport()` accepts optional `region` and `countryCode` filters
- Builds condition with Drizzle `and()` — single `.where()` call (learned from Phase 2 dead end)

**Cross-country comparison as dedicated view**
- ComparisonRow type aggregates theme coverage (field count + avg length), AI classification (maturity, readiness, SDGs)
- Table with dot indicators for coverage, badge for maturity, progress bar for readiness

**CSV export over XLSX**
- Pure TypeScript CSV generation with proper escaping (quotes, commas, newlines)
- No xlsx library dependency — keeps bundle small for serverless
- All 12 theme fields as dynamic columns derived from THEME_DEFINITIONS

**AI executive summary in PDF**
- Optional flag `includeAiSummary` on PDF endpoint
- Uses NIM inference to generate 3-paragraph executive summary from report data
- Graceful fallback: if NIM fails, PDF generates without summary

### Dead ends

- `renderToBuffer()` returns `Buffer` which is not assignable to `BodyInit` in `NextResponse`. Fixed by wrapping in `new Uint8Array(pdfBuffer)`.

### Build state

**Tag: FUNCTIONAL**

Phase 3 complete. TypeScript clean, 18 tests passing.

### Files created (Phase 3)

```
lib/reports/pdf.tsx              — @react-pdf/renderer document (cover + summary + metrics + themes + register)
lib/reports/csv.ts               — CSV generation with dynamic theme columns
lib/analytics/comparison.ts      — getCrossCountryComparison() aggregation query

app/api/reports/pdf/route.ts     — PDF generation endpoint (POST, RBAC)
app/api/export/route.ts          — CSV export endpoint (POST, RBAC)
app/(dashboard)/org/[orgSlug]/compare/page.tsx — Cross-country comparison page

components/analytics/comparison-matrix.tsx — Coverage dots, maturity badges, readiness bars, SDG tags
```

### Files modified (Phase 3)

```
components/dashboard/report-actions.tsx — added PDF download, PDF+AI, CSV export buttons
components/dashboard/sidebar.tsx — added Compare nav item
```

---

## 2026-05-18 — Phase 4: Observability + Security (5 steps)

### Decisions

**Rate limiting: in-memory sliding window**
- Per-IP, per-endpoint sliding window counters with configurable limits
- No Redis dependency — acceptable for Vercel serverless (resets on cold start, defense-in-depth)
- Integrated into Next.js middleware alongside Auth.js
- Rate limit headers (X-RateLimit-*) on all API responses

**Security headers: next.config.ts**
- CSP with strict defaults, allow 'unsafe-inline' for Next.js hydration
- HSTS with 2-year max-age + preload
- Frame-ancestors 'none' (blocks all iframing)
- Permissions-Policy disables camera, microphone, geolocation, FLoC

**Postgres RLS: defense-in-depth**
- Standalone SQL migration (not Drizzle-managed — Drizzle doesn't support RLS)
- `set_config('app.current_org_id', orgId, true)` per transaction
- Policies on 6 tables: submissions, rag_chunks, embeddings, enrichments, processing_queue, audit_log
- FORCE ROW LEVEL SECURITY — applies even to table owner
- Audit log allows INSERT from any context, SELECT scoped by org

**Input sanitization: strip-and-persist**
- Strips `<script>`, HTML tags, event handlers, `javascript:` URIs before DB write
- Recursive sanitization for nested objects (themeResponses JSONB)
- Applied at persist layer (submit-db.ts), not at API boundary — defense-in-depth

### Dead ends

None.

### Build state

**Tag: FUNCTIONAL**

Phase 4 complete. TypeScript clean, 18 tests passing.

### Files created (Phase 4)

```
lib/security/rate-limit.ts     — Sliding window rate limiter with configurable per-endpoint limits
lib/security/sanitize.ts       — HTML/XSS sanitization (sanitizeText, sanitizeRecord)
lib/security/rls.ts            — setTenantContext() helper for RLS
lib/db/rls-policies.sql        — SQL migration for RLS on 6 tables
lib/analytics/audit.ts         — getAuditLog() query with user join

app/(dashboard)/org/[orgSlug]/audit/page.tsx — Audit log dashboard with action badges
```

### Files modified (Phase 4)

```
middleware.ts           — rewritten: auth wrapper + rate limiting + API matcher
next.config.ts          — security headers (CSP, HSTS, X-Frame-Options, etc.)
lib/submit-db.ts        — input sanitization on all text fields before persist
components/dashboard/sidebar.tsx — added Audit Log nav item
```
