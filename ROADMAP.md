# Roadmap — COP Youth Policy Implementation Platform

> Evolución planificada de MVP a plataforma soberana de coordinación global.

---

## Visión

Construir la infraestructura digital soberana que permita a organizaciones de juventud de todo el mundo coordinar, estructurar y escalar la implementación de políticas COP — con inteligencia artificial integrada, sin dependencia de vendors, con costos operativos mínimos.

---

## Fases

### ✅ Phase 0 — MVP (completado)

Microsite público para recolección de marcos de implementación por país.

| Entregable | Estado |
|------------|--------|
| Landing page institucional | ✅ |
| Formulario multi-step (4 temas × 3 campos) | ✅ |
| Validación Zod + autosave localStorage | ✅ |
| Persistencia Google Sheets | ✅ |
| Email de confirmación (Resend) | ✅ |
| Generación de 12 RAG chunks por submission | ✅ |
| Deploy Vercel | ✅ |

---

### ✅ Phase 1 — Soberanía + Gobernanza (completado 18 mayo 2026)

Base de datos soberana, autenticación, multi-tenancy, dashboard, analytics, reportes.

| Entregable | Estado |
|------------|--------|
| PostgreSQL (Neon serverless) + Drizzle ORM | ✅ |
| Auth.js v5 (magic link + Google OAuth) | ✅ |
| RBAC 5 niveles (platform_admin → observer) | ✅ |
| Multi-tenancy con aislamiento por organización | ✅ |
| Dashboard adaptativo al rol | ✅ |
| Submission list + detail views | ✅ |
| User management + invite API | ✅ |
| Analytics (charts: región, tema, timeline) | ✅ |
| Report generation (JSON) | ✅ |
| Audit logging | ✅ |
| Backward-compatible con MVP | ✅ |

---

### ✅ Phase 2 — Inteligencia Artificial + Geoespacial (completado 18 mayo 2026)

| Entregable | Estado |
|------------|--------|
| pgvector: embeddings de RAG chunks (1024 dims) | ✅ |
| Pipeline de embeddings (NVIDIA NIM) | ✅ |
| Búsqueda semántica cross-country | ✅ |
| Mapa interactivo SVG de submissions por país | ✅ |
| Clasificación automática (SDGs, madurez, tags) | ✅ |
| Resúmenes automáticos por región | ✅ |
| Processing queue con retry logic | ✅ |
| Country geometries seed (~250 países) | ✅ |
| Generación multilingüe de reportes | ⏳ Phase 3 |

---

### ✅ Phase 3 — Reportes Institucionales + Exportación (completado 18 mayo 2026)

| Entregable | Estado |
|------------|--------|
| PDF export via @react-pdf/renderer (cover + exec summary + metrics + temas + registro) | ✅ |
| Templates de reporte por scope (org/región/país) | ✅ |
| Comparativa cross-country (cobertura temática, madurez, readiness, SDGs) | ✅ |
| Exportación CSV (12 campos temáticos + metadata) | ✅ |
| Reporte ejecutivo automático (IA) integrado en PDF | ✅ |
| Branding personalizable por organización | ⏳ Phase 4+ |

---

### ✅ Phase 4 — Observabilidad + Seguridad (completado 18 mayo 2026)

| Entregable | Estado |
|------------|--------|
| Rate limiting en API endpoints (sliding window in-memory) | ✅ |
| Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) | ✅ |
| Postgres RLS policies como defense-in-depth | ✅ |
| Audit log dashboard con filtros y badges | ✅ |
| Input sanitization (anti-XSS en submissions) | ✅ |
| PostHog self-hosted (product analytics) | ⏳ Phase 5+ |
| Grafana + Loki (logs y monitoring) | ⏳ Requiere decisión infra |
| Backup automático de DB | ⏳ Neon snapshots (config manual) |

---

### 🔲 Phase 5 — Federación + Coordinación entre Organizaciones

Capacidades multi-org avanzadas para coordinación entre instituciones.

| Entregable | Prioridad | Dependencia |
|------------|-----------|-------------|
| Cross-org data sharing (opt-in) | Media | Multi-tenancy |
| Unified policy intelligence dashboard | Media | Phase 2 embeddings |
| Inter-org messaging / coordination | Baja | — |
| API pública para integración con terceros | Baja | Auth + rate limiting |
| Webhook system para notificaciones externas | Baja | Processing queue |

---

### 🔲 Phase 6 — Comunicación Institucional Automatizada

Generación automatizada de comunicaciones para stakeholders.

| Entregable | Prioridad | Dependencia |
|------------|-----------|-------------|
| Templates de email institucional | Media | — |
| Newsletter automático por región | Baja | Phase 2 inference |
| Briefing automático pre-COP | Baja | Phase 2 + 3 |
| Social media content generation | Baja | Inference |

---

## Principios de Arquitectura (permanentes)

| Principio | Aplicación |
|-----------|-----------|
| Open source first | Todo el stack es OSS. Sin dependencias propietarias críticas. |
| Self-hostable | La plataforma puede correr en un VPS con Docker Compose. Vercel es conveniencia, no dependencia. |
| Modular monolith | Un repo, una DB, un deploy. Sin microservicios. |
| AI-native | Cada submission genera RAG chunks. La DB está preparada para pgvector. El processing queue acepta jobs de inference. |
| Soberanía | Los datos están en Postgres bajo control del operador. No en APIs de terceros. |
| Costo mínimo | Neon free tier + Vercel free tier = $0/mes en idle. Escala solo cuando hay tráfico. |
| Simplicidad elegante | Cada decisión técnica se evalúa por reducción de complejidad, no por hype. |

---

## Timeline Estimado

| Phase | Estimación | Prerequisitos |
|-------|-----------|---------------|
| Phase 0 | ✅ Completado | — |
| Phase 1 | ✅ Completado | — |
| Phase 2 | ✅ Completado | — |
| Phase 3 | ✅ Completado | — |
| Phase 4 | ✅ Completado | — |
| Phase 5 | 3-4 semanas | Phases 2-4 estables |
| Phase 6 | 2-3 semanas | Phase 2 inference pipeline |

---

*Última actualización: 18 mayo 2026 (Phase 4 completada)*
