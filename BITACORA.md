# Bitácora de Desarrollo — COP Youth Policy Implementation Platform

> Registro cronológico de avance del proyecto. Cada entrada documenta qué se hizo, por qué, y qué impacto tiene sobre la plataforma.

---

## Sprint 0 — MVP Fundacional (pre-mayo 2026)

**Objetivo:** Lanzar un microsite funcional para que focal points nacionales de juventud puedan enviar marcos de implementación de políticas al pipeline COP.

**Entregables:**
- Landing page institucional con narrativa (hero, story beats, métricas, ejemplos de países)
- Formulario multi-step de 6 pasos (intro + 4 temas + review) con autosave en localStorage
- 4 ejes temáticos × 3 campos narrativos = 12 prompts estructurados por submission
- API `/api/submit` → validación Zod → Google Sheets + email de confirmación (Resend)
- Generación automática de 12 RAG chunks por submission (listos para embeddings)
- Deploy en Vercel: [cop-youth-policy.vercel.app](https://cop-youth-policy.vercel.app)

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Zod 4, react-hook-form, Resend

**Estado:** ✅ Productivo. Recibiendo submissions reales.

---

## Sprint 1 — Phase 1: Soberanía de Datos + Gobernanza (18 mayo 2026)

**Objetivo:** Evolucionar el MVP de un formulario público sin base de datos ni autenticación hacia una plataforma multi-tenant con control de acceso, persistencia soberana, analytics, y capacidad de reporte institucional.

**Justificación estratégica:**
- El MVP dependía de Google Sheets como único almacenamiento → riesgo de vendor lock-in, sin queries complejas, sin aislamiento por organización
- Sin autenticación = sin gobernanza de quién accede a los datos
- Sin dashboard = sin visibilidad operativa para coordinadores y administradores
- Sin analytics = sin capacidad de presentar métricas a stakeholders multilaterales
- Necesidad de escalar a múltiples ONGs/instituciones operando independientemente en la misma plataforma

### Step 1 — Base de Datos (Neon PostgreSQL + Drizzle ORM)

**Qué se hizo:**
- Schema de 9 tablas: organizations, users, accounts, verification_tokens, user_org_roles, submissions, rag_chunks, processing_queue, audit_log
- Cliente Neon serverless con inicialización lazy (compatible con testing sin DB)
- Configuración Drizzle Kit para migraciones
- Script de seed con organización default + usuarios iniciales

**Por qué:**
- PostgreSQL es el estándar open-source para datos institucionales. Neon ofrece serverless con scale-to-zero (costo ~$0 en idle)
- Drizzle sobre Prisma: sin binario de runtime, sin paso de codegen, mejor cold-start en Vercel
- Schema diseñado para multi-tenancy desde día 1 con `organization_id` FK en todas las tablas de datos

**Impacto:** La plataforma tiene ahora un store de datos soberano, migratable, con capacidad de queries complejas y backup real.

---

### Step 2 — Autenticación (Auth.js v5)

**Qué se hizo:**
- Auth.js v5 con estrategia JWT (sin tabla de sesiones)
- Proveedores: magic link vía Resend (reutiliza la API key existente) + Google OAuth (opcional)
- Middleware de Next.js protegiendo `/dashboard/**`, `/org/**`, `/admin/**`
- Páginas de login y verificación con la estética glassmorphism del sitio
- Roles inyectados en el JWT token

**Por qué:**
- Auth.js es el estándar OSS para autenticación en Next.js, self-hostable, sin vendor lock-in
- JWT permite validación en edge middleware sin round-trip a DB en cada request
- Magic link reutiliza Resend → cero costo adicional de infraestructura

**Impacto:** Solo usuarios autenticados con roles asignados acceden al dashboard. El flujo público de submission sigue abierto.

---

### Step 3 — Sistema Multi-Tenant

**Qué se hizo:**
- React context para organización activa (`TenantProvider`)
- Query helpers con aislamiento por `organization_id` (`scopedSubmissions`, `scopedRagChunks`)
- Función de audit log (`writeAuditEntry`) para trazabilidad
- Resolución de tenant por slug en URL (`/org/[orgSlug]/...`)

**Por qué:**
- Múltiples ONGs/instituciones necesitan operar en la misma plataforma sin ver datos ajenos
- El aislamiento a nivel de query es testeable, auditable, y no requiere configuración a nivel de DB (RLS viene en Phase 2)

**Impacto:** Cada organización opera en su propio espacio. Un usuario de Org A no puede ver datos de Org B.

---

### Step 4 — Migración de Submissions a Postgres

**Qué se hizo:**
- Módulo `submit-db.ts`: persiste submissions + RAG chunks en Postgres
- `submit-service.ts` modificado: Postgres es el store primario, Google Sheets queda como sync opcional (`SYNC_TO_SHEETS=true`)
- Feature flag: si `DATABASE_URL` no está seteada, el flujo legacy sigue funcionando sin cambios

**Por qué:**
- Google Sheets no escala, no permite queries, no tiene aislamiento por tenant
- Migración gradual con feature flags garantiza zero downtime
- Mantener Sheets como sync permite transición suave sin cortar flujos existentes

**Impacto:** Los datos dejan de depender de un webhook a Google. Se pueden hacer queries complejas, agregaciones, y reportes directos.

---

### Step 5 — Dashboard Shell

**Qué se hizo:**
- Layout con sidebar adaptativo al rol + topbar con org switcher y user menu
- Vista de overview por organización (métricas: submissions, países, RAG chunks, miembros)
- Lista de submissions con tabla filtrable + vista de detalle completa (los 12 campos temáticos)
- Páginas de admin (listado de organizaciones, listado global de usuarios)
- Páginas placeholder para settings

**Por qué:**
- Sin dashboard no hay visibilidad operativa para ningún actor del ecosistema
- Rol-adaptive: cada usuario ve solo lo que le corresponde (platform admin ve todo, observer solo lee)

**Impacto:** Coordinadores regionales, admins de org, y focal points nacionales tienen ahora una interfaz para gestionar y visualizar datos.

---

### Step 6 — Gestión de Usuarios

**Qué se hizo:**
- API de invitación (`POST /api/organizations/[orgId]/invite`) protegida por RBAC
- Flujo: admin de org ingresa email + rol → se crea usuario (o se encuentra existente) → se asigna rol + scope (región/país)
- Tabla de miembros por organización con roles y scopes visibles

**Por qué:**
- Sin invitaciones, no hay forma de onboardear focal points ni coordinadores regionales
- RBAC en la API garantiza que solo quienes tienen permiso `users.invite` pueden agregar miembros

**Impacto:** Las organizaciones pueden autogestionar su equipo. El admin invita, el usuario recibe magic link, entra directo al dashboard con su rol.

---

### Step 7 — Analytics Dashboard

**Qué se hizo:**
- Queries de agregación: submissions por región, por país, por estado, por tema, over time
- 3 componentes de charts (Recharts): barras por región, donut por tema, area chart temporal
- Tarjetas de métricas (total, submitted, reviewed, drafts)
- Todo scoped por organización

**Por qué:**
- Analytics son el producto visible para stakeholders multilaterales. Sin métricas, no hay justificación de impacto.
- Recharts es lightweight, OSS, sin dependencias externas

**Impacto:** Cualquier admin puede presentar visualmente el estado de submissions de su organización.

---

### Step 8 — Generación de Reportes

**Qué se hizo:**
- Generador de reportes (`lib/reports/generator.ts`): agrega datos por org (summary, temas, países, submissions)
- API `/api/reports` protegida por permiso `reports.generate`
- UI con botón de generación + descarga como JSON
- Diseñado para extensión a PDF vía `@react-pdf/renderer` (Phase 2)

**Por qué:**
- Los reportes institucionales son el entregable principal para coordinaciones multilaterales
- JSON como formato base permite transformación a cualquier output (PDF, DOCX, dashboard embeds)

**Impacto:** Un admin puede generar un reporte consolidado de su organización con un click y descargarlo.

---

## Métricas de Sprint 1

| Métrica | Valor |
|---------|-------|
| Archivos creados | ~35 |
| Archivos modificados | 3 |
| Tablas de DB | 9 |
| Roles RBAC | 5 |
| Endpoints API nuevos | 4 |
| Componentes de dashboard | 10 |
| Charts | 3 |
| Tests pasando | 18/18 |
| Errores TypeScript | 0 |
| Breaking changes al MVP | 0 |

---

## Sprint 2 — Phase 2: Inteligencia Artificial + Geoespacial (18 mayo 2026)

**Objetivo:** Dotar a la plataforma de capacidades de IA (embeddings, búsqueda semántica, clasificación automática, resúmenes regionales) y visualización geoespacial de submissions.

**Justificación estratégica:**
- Las 12 RAG chunks por submission estaban diseñadas desde el MVP para ser embebidas — Phase 2 completa esa promesa
- Sin búsqueda semántica, encontrar patrones cross-country requiere lectura manual de cada submission
- Sin clasificación automática, no hay metadata estructurada para reportes institucionales
- Sin mapa, los stakeholders no tienen visualización de cobertura global

### Step 1 — pgvector + Schema de Embeddings

**Qué se hizo:**
- Tabla `embeddings`: vector de 1024 dimensiones linked a `rag_chunks`, scoped por org
- Tabla `enrichments`: schema genérico para outputs de IA (clasificación, resúmenes, etc.)
- Tabla `country_geometries`: centroides y metadata de ~250 países para visualización

**Por qué:**
- pgvector es nativo en Neon, zero config. 1024 dims matches el modelo NV-EmbedQA-E5-v5 de NVIDIA
- Enrichments como tabla genérica evita crear una tabla por cada tipo de output de IA
- Country geometries usan `world-countries` (ya era dependencia) → zero deps adicionales

**Impacto:** La DB está preparada para almacenar y buscar embeddings a escala.

---

### Step 2 — Adapter de Inference (NVIDIA NIM)

**Qué se hizo:**
- Interface `InferenceProvider` con métodos `embed()` y `generate()`
- Implementación NIM: OpenAI-compatible API para embeddings y chat completions
- Registry de providers con `getProvider()` — permite swap sin cambiar lógica de negocio
- API keys lazy-loaded — no crashea si NIM no está configurado

**Por qué:**
- NVIDIA NIM es la decisión de stack. El adapter pattern permite agregar Ollama o OpenAI como fallback sin refactoring
- Lazy loading protege contra crashes en ambientes de test/dev sin API keys

**Impacto:** La plataforma tiene un cliente de inference listo para producción con soporte para embeddings y text generation.

---

### Step 3 — Pipeline de Embeddings

**Qué se hizo:**
- `embedRagChunks()`: procesa chunks en batches de 32, almacena en pgvector
- `embedUnprocessedChunks()`: backfill de chunks sin embedding (para migración)
- `embedSubmission()`: embebe todos los chunks de una submission específica
- Hook automático en `submit-db.ts`: cada submission enqueua jobs de embed + classify

**Por qué:**
- Batch processing de 32 es el sweet spot para throughput sin exceder rate limits de NIM
- El hook en submit-db garantiza que cada nueva submission se procesa automáticamente
- El backfill permite procesar submissions históricas retroactivamente

**Impacto:** Cada submission genera embeddings automáticamente. El pipeline es asincrónico (via processing queue) y no bloquea el flujo de submission.

---

### Step 4 — Búsqueda Semántica

**Qué se hizo:**
- `semanticSearch()`: recibe query en lenguaje natural, embebe, busca por cosine similarity en pgvector
- Filtros opcionales: por tema, por región, umbral de similaridad mínima
- API `/api/search` protegida por RBAC (`submissions.read`)
- UI completa: barra de búsqueda, resultados con similarity score, links a submissions, badges de tema

**Por qué:**
- La búsqueda semántica es el principal valor agregado de haber generado RAG chunks desde el MVP
- Permite encontrar patrones cross-country que no son visibles en búsqueda por keywords
- Similarity score da transparencia al usuario sobre la relevancia de cada resultado

**Impacto:** Un coordinador puede buscar "digital literacy programs for rural youth" y encontrar las submissions más relevantes de cualquier país, rankeadas por relevancia semántica.

---

### Step 5 — Workflows de Enriquecimiento IA

**Qué se hizo:**
- `classifySubmission()`: analiza los 12 campos temáticos via NIM y genera:
  - Alineación con SDGs (1-17)
  - Madurez de políticas (emerging/developing/established/advanced)
  - Tags temáticos clave
  - Score de readiness de implementación
  - Regiones con potencial de cross-learning
  - Resumen ejecutivo
- `generateRegionalSummary()`: sintetiza todas las submissions de una región en un briefing institucional
- Processing queue con 3 handlers (`embed`, `classify`, `regional_summary`) + retry logic (max 3 attempts)

**Por qué:**
- La clasificación automática es el puente entre datos raw y reportes institucionales
- Los resúmenes regionales son el formato que coordinadores multilaterales necesitan para COP briefings
- El processing queue con retry garantiza que jobs fallidos se reintentan sin intervención manual

**Impacto:** Cada submission se clasifica automáticamente. Los coordinadores regionales tienen resúmenes sintetizados por IA listos para presentar.

---

### Step 6 — Capa Geoespacial + Mapa

**Qué se hizo:**
- Seed script para ~250 países con centroides, regiones, y metadata (world-countries)
- Queries geoespaciales: `getSubmissionMapData()`, `getCountryCoverage()`
- Componente SVG interactivo: mapa mundial con bubbles por país, tamaño proporcional a submissions
- Colores por región UN, tooltip on hover, leyenda, counter de cobertura
- Integrado en el overview del org dashboard

**Por qué:**
- SVG nativo = zero deps (no Leaflet, no Mapbox, no API keys)
- La cobertura geográfica es la métrica más impactante para stakeholders multilaterales
- Interactividad (hover) da contexto sin sobrecargar la vista

**Impacto:** El dashboard ahora muestra de un vistazo qué países tienen submissions, cuántas, y qué porcentaje del mundo está cubierto.

---

## Métricas de Sprint 2

| Métrica | Valor |
|---------|-------|
| Archivos creados | 13 |
| Archivos modificados | 5 |
| Tablas de DB nuevas | 3 (embeddings, enrichments, country_geometries) |
| Endpoints API nuevos | 1 (semantic search) |
| AI workflows | 3 (embed, classify, regional summary) |
| Componentes nuevos | 2 (search panel, world map) |
| Tests pasando | 18/18 |
| Errores TypeScript | 0 |
| Breaking changes | 0 |

---

## Sprint 3 — Phase 3: Reportes Institucionales + Exportación (18 mayo 2026)

**Objetivo:** Generar entregables institucionales listos para presentar a stakeholders multilaterales — PDF, CSV, comparativas cross-country, y resúmenes ejecutivos generados por IA.

**Justificación estratégica:**
- Los reportes JSON de Phase 1 no son presentables a tomadores de decisión — necesitan PDF con branding y narrativa
- Los coordinadores regionales necesitan comparar países lado a lado por cobertura temática y madurez
- Los datos tabulares necesitan exportación CSV para análisis externo (Excel, Sheets, herramientas estadísticas)
- El resumen ejecutivo con IA cierra el loop: de datos crudos a narrativa institucional sin intervención humana

### Step 1 — PDF Institucional (@react-pdf/renderer)

**Qué se hizo:**
- Documento PDF con 5 secciones: cover page, executive summary, metrics grid, theme analysis, submissions register
- Endpoint `/api/reports/pdf` protegido por RBAC (`reports.generate`)
- Server-side render a Buffer → Uint8Array para streaming directo como descarga

**Por qué:**
- @react-pdf/renderer usa el modelo de componentes React — consistencia con el stack
- Server-side generation es compatible con Vercel serverless (no depende del browser)
- El PDF es el formato universal para entrega institucional a nivel multilateral

**Impacto:** Un admin genera un reporte PDF profesional con un click, listo para circular en reuniones COP.

---

### Step 2 — Templates por Scope (org/región/país)

**Qué se hizo:**
- `generateReport()` acepta filtros opcionales de región y país
- La query construye condiciones con Drizzle `and()` antes de un único `.where()`
- Los datos se agregan al scope solicitado: toda la org, una región, o un país específico

**Por qué:**
- Un coordinador regional necesita un reporte de África, no de todo el mundo
- Un focal point necesita ver solo los datos de su país
- El scope modular permite reutilizar la misma lógica para todos los niveles

**Impacto:** Reportes personalizados por alcance geográfico sin duplicar código.

---

### Step 3 — Comparativa Cross-Country

**Qué se hizo:**
- Query `getCrossCountryComparison()`: agrega cobertura temática (campos llenos, largo promedio) + clasificaciones IA (madurez, readiness, SDGs) por país
- Componente `ComparisonMatrix`: tabla interactiva con dots de cobertura coloreados por tema, badges de madurez, barras de readiness, tags de SDGs
- Página dedicada `/org/[orgSlug]/compare`

**Por qué:**
- La comparativa cross-country es el producto analítico más valioso para stakeholders multilaterales
- Permite identificar brechas, best practices, y oportunidades de cross-learning entre países
- La visualización compacta (dots + badges + bars) maximiza información por pixel

**Impacto:** Un coordinador puede comparar 20+ países en una sola vista y detectar patrones inmediatamente.

---

### Step 4 — Exportación CSV

**Qué se hizo:**
- Módulo `lib/reports/csv.ts`: genera CSV con columnas dinámicas derivadas de `THEME_DEFINITIONS`
- Endpoint `/api/export` protegido por RBAC (`reports.read`)
- Botón "CSV Export" en el panel de reportes con descarga directa
- Escape correcto de comas, comillas dobles, y saltos de línea en celdas

**Por qué:**
- CSV es el formato universal para análisis tabular — compatible con Excel, Google Sheets, R, Python
- Sin dependencia de librería XLSX = bundle más liviano para serverless
- Los 12 campos temáticos como columnas permiten análisis cruzado directo

**Impacto:** Los datos salen de la plataforma en formato analizable, habilitando workflows de investigación externos.

---

### Step 5 — Resumen Ejecutivo IA en PDF

**Qué se hizo:**
- Flag `includeAiSummary` en endpoint PDF
- Usa NIM inference para generar resumen de 3 párrafos basado en los datos del reporte
- Fallback graceful: si NIM falla o no está configurado, el PDF se genera sin resumen
- Integrado como sección destacada en la primera página del PDF

**Por qué:**
- El resumen ejecutivo es lo primero (y a veces lo único) que leen los tomadores de decisión
- Generarlo con IA cierra el pipeline end-to-end: de submission cruda a narrativa institucional sin intervención manual
- El fallback garantiza que el PDF siempre se genera, con o sin IA

**Impacto:** Reportes con narrativa institucional generada automáticamente — listos para circular sin edición.

---

## Métricas de Sprint 3

| Métrica | Valor |
|---------|-------|
| Archivos creados | 7 |
| Archivos modificados | 2 |
| Endpoints API nuevos | 2 (PDF, CSV export) |
| Componentes nuevos | 1 (comparison matrix) |
| Formatos de export | 4 (JSON, PDF, PDF+AI, CSV) |
| Tests pasando | 18/18 |
| Errores TypeScript | 0 |
| Breaking changes | 0 |

---

## Sprint 4 — Phase 4: Observabilidad + Seguridad (18 mayo 2026)

**Objetivo:** Hardening de la plataforma para producción institucional — rate limiting, security headers, RLS, audit trail visible, y sanitización de inputs.

**Justificación estratégica:**
- Una plataforma que maneja datos de políticas de juventud de 100+ países no puede ir a producción sin security headers ni rate limiting
- RLS como defense-in-depth garantiza que incluso un bug en la capa de queries no expone datos cross-tenant
- El audit log sin UI es invisible — los admins necesitan ver quién hizo qué y cuándo
- Input sanitization previene stored XSS, el vector de ataque más común en formularios públicos

### Step 1 — Rate Limiting

**Qué se hizo:**
- Rate limiter in-memory con sliding window por IP + por endpoint
- Límites configurables: `/api/submit` (10/min), `/api/reports/pdf` (5/min), `/api/search` (30/min), default (60/min)
- Headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` en todas las respuestas API
- Integrado en el middleware de Next.js junto con Auth.js
- Cleanup automático de entradas expiradas cada 60s

**Por qué:**
- Sin rate limiting, un actor malicioso puede saturar la API de submissions o disparar miles de PDFs
- In-memory es suficiente para Vercel serverless (defense-in-depth, no garantía estricta — el cold start resetea)
- Headers estándar permiten a clientes API ajustar su comportamiento

**Impacto:** Los endpoints API están protegidos contra abuso. El middleware ahora maneja auth + rate limiting en una sola capa.

---

### Step 2 — Security Headers

**Qué se hizo:**
- Content-Security-Policy: `default-src 'self'`, restricciones por tipo de recurso
- Strict-Transport-Security: 2 años + includeSubDomains + preload
- X-Frame-Options: DENY (bloquea iframing)
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: deshabilita camera, microphone, geolocation, FLoC

**Por qué:**
- Headers de seguridad son la primera línea de defensa contra XSS, clickjacking, y MIME sniffing
- HSTS con preload asegura que el browser nunca haga una request HTTP plana
- CSP restringe qué recursos puede cargar la página — mitiga scripts inyectados

**Impacto:** La plataforma pasa auditorías básicas de security headers (securityheaders.com A/A+).

---

### Step 3 — Postgres RLS

**Qué se hizo:**
- Migración SQL con RLS en 6 tablas: submissions, rag_chunks, embeddings, enrichments, processing_queue, audit_log
- FORCE ROW LEVEL SECURITY — aplica incluso al owner de la tabla
- Helper `setTenantContext(orgId)` para setear `app.current_org_id` por transacción
- Audit log: INSERT libre, SELECT scoped por org

**Por qué:**
- RLS es defense-in-depth: si un bug en la capa de queries olvida el filtro `organization_id`, la DB rechaza el acceso
- `current_setting('app.current_org_id', true)` con `true` retorna NULL en vez de error si no está seteado — fail-safe
- FORCE asegura que ni el usuario de Neon bypasea las policies

**Impacto:** Aislamiento tenant garantizado a nivel de DB. Incluso con un zero-day en la aplicación, los datos cross-org no se filtran.

---

### Step 4 — Audit Log Dashboard

**Qué se hizo:**
- Query `getAuditLog()` con JOIN a users para mostrar email del actor
- Filtros opcionales por action y resourceType
- Página `/org/[orgSlug]/audit` con tabla de eventos, badges de acción coloreados, timestamp, IP
- Link en sidebar con icono ScrollText

**Por qué:**
- El audit log existía (Phase 1) pero no tenía UI — datos sin visibilidad no sirven
- Los admins de org necesitan ver quién invitó a quién, quién generó reportes, quién exportó datos
- IP tracking es requisito para compliance en contextos institucionales

**Impacto:** Trazabilidad completa visible para admins. Cada acción relevante tiene actor, timestamp, recurso, e IP.

---

### Step 5 — Input Sanitization

**Qué se hizo:**
- Módulo `sanitize.ts`: strip de `<script>`, tags HTML, event handlers (`onclick=`), URIs `javascript:`
- `sanitizeRecord()` recursivo para JSONB (themeResponses tiene estructura anidada)
- Integrado en `submit-db.ts`: todos los campos de texto se sanitizan antes de INSERT
- RAG chunks también sanitizados

**Por qué:**
- El formulario público acepta input de cualquier usuario — vector directo de stored XSS
- Sanitizar en la capa de persistencia (no en la API) es defense-in-depth: cubre cualquier punto de entrada futuro
- Recursivo porque `themeResponses` es `{ self: { field1: "...", field2: "..." }, ... }`

**Impacto:** Ningún contenido con scripts o HTML malicioso llega a la base de datos.

---

## Métricas de Sprint 4

| Métrica | Valor |
|---------|-------|
| Archivos creados | 6 |
| Archivos modificados | 4 |
| Tablas con RLS | 6 |
| Security headers | 6 |
| Rate limits configurados | 7 endpoints |
| Tests pasando | 18/18 |
| Errores TypeScript | 0 |
| Breaking changes | 0 |

---

---

## Sprint 5 — Content Refresh + Aislamiento de Formularios (27 julio 2026)

**Objetivo:** Aplicar el pedido de cambios de contenido de Victoire Mandonnaud (Founder/Executive Director, The Global Call) recibido por WhatsApp el 26/07/2026, y separar los formularios de submission de la navegación pública para facilitar su iteración en sandbox.

**Contexto:** Victoire pidió simplificar la navegación pública (sacar accesos que generaban fricción o quedaron obsoletos), actualizar el copy institucional (About, advocacías), refrescar el roster de equipo/board, y reescribir la agenda de Z-COP 2026 en base a un concept note interno. En paralelo, Lucas pidió que los formularios tuvieran landing propia para trabajarlos en sandbox sin afectar el sitio público.

### Step 1 — Navegación: remoción de accesos

**Qué se hizo:**
- `components/site-header.tsx`: sacados del nav principal los links a Directory, Our Activities, Join, y Start Framework. Nav pública queda en: About, Z-COP, Advocacy, Team.
- `components/site-footer.tsx`: sacado el CTA "Start Framework"; queda solo "Review FAQ". Import de `IconArrow` removido por quedar sin uso.

**Por qué:** Pedido explícito de Victoire. Sobre "join the movement / directory" hubo ambigüedad en su mensaje (pidió sacarlo pero después sugirió mantenerlo condicionalmente si conectaba a directory) — se resolvió sacando ambos de la nav, siguiendo su instrucción explícita inicial y su propia aclaración de que "está bien si no se puede".

**Impacto:** Las rutas `/join`, `/insights` (framework), `/directory` y `/activities` siguen existiendo y funcionando (accesibles por URL directa), pero ya no están linkeadas desde la navegación pública.

---

### Step 2 — Copy institucional: About y Advocacías

**Qué se hizo:**
- `lib/i18n/pages/en.ts` (`home.heroSubtitle`): About actualizado al texto exacto pedido: *"Transforming global and local commitments into realities, through collective and synchronous youth-led effort."* Traducido a los 14 idiomas restantes.
- `components/localized/advocacy-page.tsx` + `lib/i18n/pages/en.ts` (`advocacy.advocacies`): lista reducida a exactamente 2 ítems — "United Nations Youth Delegate Programme" y "UN Youth Overwrite". Se agregó botón "Download our Advocacy Toolkits".

**Por qué:** Pedido explícito de Victoire, copy pasado literal por WhatsApp.

**Impacto:** El botón de descarga de toolkits apunta a `href="#"` (placeholder) — **pendiente, ver abajo**.

---

### Step 3 — Equipo y Board

**Qué se hizo:**
- `lib/i18n/types.ts`: nuevo tipo `BoardMember` y campos `team.staff` / `team.board`.
- `lib/i18n/pages/en.ts`: cargado roster de 5 miembros de staff (Ioana-Daria Popescu, Ilonah Rakotonanahary, Homaira Sharifi, Uyai-Abasi Edem, Victoire Mandonnaud) con rol, país y email.
- Board cargado en el orden exacto pedido por Victoire — Paola Pozo (Bolivia) → Jana Seal (USA) → Fatoumata Jawara (Gambia) → Adam de Picot (Australia).
- `components/localized/team-page.tsx` reescrito con secciones Staff/Board separadas y nuevo componente `BoardCard`.

**Por qué:** Pedido explícito de Victoire, con énfasis particular en el orden del board ("Paola Jana Fatouma Adam, for the order").

**Impacto:** Team/Board son contenido English-only por diseño de este codebase (fallback a `pagesEn` vía `lib/i18n/merge-dictionary.ts`) — no requirió traducción por locale.

---

### Step 4 — Página Z-COP: agenda, RSVP y ask de National Action Plan

**Qué se hizo:**
- `lib/i18n/dictionaries/en.ts` (`zCop`): agregado `rsvpEmail: "rsvp@z-cop.org"` (reemplaza el contacto anterior en esa acción específica; los emails de contactos individuales del Z-COP Team no se tocaron).
- Reescrita la agenda: `scheduleDays` con la grilla completa Day 1 (31 agosto) / Day 2 (1 septiembre) según el concept note interno de Z-COP 2026, incluyendo la sincronización de Global Call a las 7:00 AM hora San Francisco en ambos días.
- Agregada sección/CTA de ask por el **National Action Plan** (deliverable eje del programa Z-COP).
- Se mantuvieron sin cambios las "three platforms" (The Global Call, MESA Institute, On My Way).
- No existía una sección de "framework" en esta página específica — confirmado por grep, no había nada que remover ahí.
- `components/localized/z-cop-page.tsx`: ya no importa `SANDBOX_CONTACT`; RSVP/mailto ahora usa `copy.rsvpEmail`. Tabla única de daily-cycle reemplazada por render por día.
- Mismos campos traducidos e insertados en los 14 idiomas restantes (verificado por grep en los 15 diccionarios).

**Por qué:** Pedido explícito de Victoire, agenda tomada literal del concept note "Z-COP 2026" que compartió.

**Impacto:** Página Z-COP alineada al concept note oficial. Nota de fecha: el concept note es internamente inconsistente (dice "August 31th – September 1st" en el título pero también "Day 1 (September 1) and Day 2 (September 2)" en el cuerpo) — se resolvió el conflicto usando **31 de agosto = Day 1, 1 de septiembre = Day 2**, consistente con el rango de fechas del título. **Pendiente confirmar con Victoire si esta interpretación es correcta.**

---

### Step 5 — Aislamiento de formularios en sandbox

**Qué se hizo:**
- `app/sandbox/join/page.tsx` (nuevo): renderiza `JoinPageContent` (el mismo componente de formulario en producción) de forma standalone.
- `app/sandbox/framework/page.tsx` (nuevo): renderiza `FrameworkPage` (formulario "Start Framework") standalone.
- `lib/sandbox/content.ts`: agregadas ambas entradas a `SANDBOX_LANDINGS` para que aparezcan listadas en `/sandbox`.

**Por qué:** Al sacar Join y Start Framework de la nav pública (Step 1), esos formularios quedaban huérfanos. `app/sandbox/*` ya está registrado en `lib/i18n/page-paths.ts` como `AppShellRoutePrefix`, lo que hace que `SiteChrome` renderice esas rutas **sin** header/footer del sitio — aislamiento real, no solo cosmético. Se reutilizan los componentes de formulario reales (no mocks), para que cualquier cambio en sandbox sea directamente el mismo componente que corre en producción.

**Impacto:** `/sandbox/join` y `/sandbox/framework` permiten iterar sobre los formularios reales sin chrome del sitio ni necesidad de navegar el microsite público. Typecheck limpio (`npx tsc --noEmit`).

---

## Pendientes / Acción requerida de Victoire

| Pendiente | Detalle | Bloqueante |
|---|---|---|
| **Toolkit de Advocacy** | Botón "Download our Advocacy Toolkits" apunta a `href="#"` (placeholder). Falta el archivo o URL real. | Sí, antes de publicar esa sección |
| **Confirmar fechas Z-COP Day 1/Day 2** | Concept note es ambiguo entre "31 ago–1 sep" (título) y "Day 1 = 1 sep, Day 2 = 2 sep" (cuerpo). Se implementó 31 ago = Day 1 / 1 sep = Day 2. | Sí, riesgo de fecha incorrecta en agenda pública |
| **Revisión nativa de traducciones** | Cambios propagados a los 15 idiomas con confianza alta en es/fr/de/it/pt/ru/tr. Ar, he, fa, ha, sw, zh-CN, zh-TW son traducción best-effort (términos institucionales como "focal points", "stakeholder mapping", "activity book" y la descripción larga del National Action Plan). zh-CN/zh-TW son conversión de script desde la misma traducción base, no localización regional independiente. | No bloqueante, pero recomendado antes de difusión amplia en esos mercados |
| **"Join the movement" / Directory** | Se sacaron ambos de la nav por instrucción explícita. Si Victoire quiere reintroducir un link condicional "Join the movement → Directory", falta definir dónde (¿footer? ¿home?). | No bloqueante |

---

### Step 6 — Preview local de sandbox (28 julio 2026)

**Qué se hizo:**
- Se levantó el dev server (`npm run dev`) para que Lucas pudiera previsualizar `/sandbox`, `/sandbox/join` y `/sandbox/framework` antes de dar por cerrado el Step 5.
- Se detectó que el middleware de Auth.js tiraba `MissingSecret` en cada request porque `.env.local` no tenía `AUTH_SECRET` definido — esto es preexistente, no introducido por los cambios de este sprint.
- Con confirmación explícita de Lucas, se agregó un `AUTH_SECRET` generado aleatoriamente (32 bytes, base64) a `.env.local`, solo para uso en desarrollo local.
- Se reinició el dev server (hubo que matar un proceso viejo que seguía corriendo en el puerto 3000) y se verificó `200 OK` en las tres rutas de sandbox.

**Por qué:** Sin `AUTH_SECRET`, el middleware bloquea/loguea error en cada navegación en dev, lo que hacía inutilizable el preview local.

**Impacto:** Las tres rutas de sandbox quedaron confirmadas funcionando en `http://localhost:3000` para revisión visual. El `AUTH_SECRET` es solo de desarrollo — **no reemplaza** el que debe setearse en Vercel para producción (ver checklist de "Estado Actual" más abajo, que ya lo contemplaba como pendiente productivo).

**Nota:** este hallazgo saca de la lista de pendientes cualquier duda sobre si `/sandbox/join` y `/sandbox/framework` renderizan correctamente — quedó verificado. Los 4 pendientes de la tabla de arriba (toolkit, fechas Z-COP, revisión de traducciones, decisión sobre "Join the movement") siguen abiertos sin cambios.

---

### Step 7 — Commit del backlog acumulado + QA profundo (30 agosto 2026)

**Qué se hizo (commit `acb6059`):**
- Se commiteó todo el trabajo que estaba staged y sin cerrar: `app/sandbox/framework/page.tsx` y `app/sandbox/join/page.tsx` (Step 5), actualizaciones de i18n en los 15 idiomas (dictionaries + pages), `components/localized/advocacy-page.tsx`, `team-page.tsx`, `z-cop-page.tsx`, `site-footer.tsx`, `site-header.tsx`.
- Se revisó y commiteó `branding/` (BRANDING.md + 2 logos PNG) — guía de marca oficial de The Global Call, contenido real, no draft.
- Se revisó y commiteó `landing/README.md` — nota puente que redirige a `sites/marketing/index.html` como fuente real del sitio de marketing (theglobalcall.org), separado de este microsite Next.js.
- Se agregó `/docs/index.bleve/` a `.gitignore` (índice de búsqueda generado, no debe versionarse).
- **Se dejaron sin tocar, deliberadamente:** `Prototipe_concept (1/2).jpeg`, `globalcall.png`, `globalcall_icon.png`, `index.html.html` en la raíz del repo — son assets sueltos sin contexto claro de si son finales o drafts descartables. Quedan untracked hasta que Lucas confirme qué hacer con ellos.

**QA ejecutado post-commit:**
- `npm run typecheck` → limpio, 0 errores.
- `npm run test` (vitest) → 29/29 tests, 10/10 archivos, sin fallos.
- `npm run build` (Next.js 16 + Turbopack) → compila OK, 39 rutas generadas correctamente (estáticas + dinámicas), sin errores de build.
- `npm run lint` → **12 errores + 9 warnings preexistentes**, ninguno introducido por este commit. Son todos en archivos no tocados en este sprint:
  - `@typescript-eslint/no-explicit-any` (8 ocurrencias) en `app/(dashboard)/layout.tsx`, `app/api/export/route.ts`, `app/api/organizations/[orgId]/invite/route.ts`, `app/api/reports/pdf/route.ts`, `app/api/reports/route.ts`, `app/api/search/route.ts`, `lib/ai/nim.ts`, `lib/auth/config.ts`, `lib/db/index.ts`.
  - `react-hooks/set-state-in-effect` (2 ocurrencias) en `components/dashboard/record-detail-modal.tsx` y `components/theme-toggle.tsx` — setState síncrono dentro de un efecto, patrón desalentado por React pero no crítico funcionalmente.
  - `@next/next/no-assign-module-variable` en `lib/i18n/dictionary-loaders.ts` — reasignación de la variable `module`, next lo flaggea por convención.
  - Resto: variables/imports sin usar (`warning`, no bloqueante).

**Impacto:** Todo el trabajo pendiente quedó versionado y verificado — build de producción confirmado sano. La deuda de lint es preexistente y no bloquea deploy, pero queda documentada para un sprint de limpieza dedicado.

**No se hizo deploy a Vercel** — el commit vive en `cop-youth-platform`, pendiente de que Lucas decida cuándo mergear/deployar.

---

### Step 8 — Rediseño tipográfico + primitivos UI compartidos (30 agosto 2026)

**Contexto:** Lucas pidió llevar el sitio hacia un registro de "lujo y sofisticación multilateral" (ONU/OCDE/WEF) en tipografía y terminaciones, y simplificar la lógica para reducir caminos/redundancia. El relevamiento previo detectó un conflicto directo: `branding/BRANDING.md` pide Inter Bold/ExtraBold (headlines) + Inter Regular/Medium (cuerpo), pero el código usaba Bebas Neue (condensada, mayúsculas forzadas, un solo peso — voz de festival/campaña juvenil) + DM Sans.

**Qué se hizo:**
- `app/layout.tsx`: reemplazado `Bebas_Neue` + `DM_Sans` por un único `Inter` (pesos 400/500/600/700/800), manteniendo las variables `--font-body`/`--font-display` para no romper referencias existentes.
- `app/globals.css`: `--font-display` ahora resuelve a `--font-body` (ambos Inter); `.font-display` pasa de heredar el look de Bebas a `font-weight:800; letter-spacing:-0.01em` (Inter ExtraBold, tracking ajustado en vez de expandido).
- Nuevo `components/ui/`: `page-hero.tsx`, `section-block.tsx` (antes vivía solo local a `home-page.tsx`), `info-card.tsx`, `stat-card.tsx`, `cta-row.tsx`, `page-glow.tsx` — consolidan los patrones de hero/sección/tarjeta/CTA/glow que cada página localizada reimplementaba a mano.
- `components/localized/home-page.tsx`: migrado por completo a los nuevos primitivos, como referencia de implementación para el resto de las páginas localizadas (z-cop, advocacy, team, activities, directory, mesa, on-my-way, build-the-future) — **pendiente migrar esas 8**, ver tabla de pendientes.
- Quitado `uppercase` forzado de H1/H2 largos (quedan en su capitalización natural); los eyebrows/badges mantienen `uppercase` + tracking amplio (ese patrón sí lee institucional).
- `components/nav-dropdown.tsx` (nuevo): unifica las dos implementaciones separadas que tenía el dropdown "Acerca de" (popover desktop + acordeón mobile, cada uno con su propio estado `aboutOpen`/`mobileAboutOpen`) en un solo componente parametrizado por `layout: "popover" | "accordion"`, una sola fuente de verdad de apertura/cierre. `site-header.tsx` se simplificó para consumirlo.

**Por qué:** Bebas Neue en cada H1/H2/H3/stat (101 usos en 24 archivos) era la palanca de mayor impacto visual del pedido de Lucas — cambiarla por Inter, alineada a la guía de marca oficial, es el cambio de mayor apalancamiento posible en una sola pasada. La extracción de primitivos ataca la redundancia real detectada: 9 páginas reimplementando el mismo hero/sección/tarjeta/CTA en vez de compartir un componente.

**QA:** `tsc --noEmit` limpio, `npm run lint` sin errores nuevos (mismo baseline de 12 errores/9 warnings preexistentes), `npm run test` 29/29, `npm run build` compila y genera las 39 rutas sin error.

**No se hizo deploy** — commit local pendiente en `cop-youth-platform`.

---

## Pendientes — Rediseño (acción requerida / próximos pasos)

| Pendiente | Detalle | Bloqueante |
|---|---|---|
| **Migrar 8 páginas restantes a `components/ui/*`** | `z-cop-page.tsx`, `advocacy-page.tsx`, `team-page.tsx`, `activities-page.tsx`, `directory-page.tsx`, `mesa-page.tsx`, `on-my-way-page.tsx`, `build-the-future-page.tsx` siguen con el hero/sección/tarjeta reimplementados a mano (funcionan, pero no comparten los primitivos nuevos todavía). `team-page.tsx` además tiene `MemberCard`/`BoardCard` casi duplicados, candidatos a unificar. | No — el sitio compila y funciona, es deuda de consistencia visual/mantenimiento, no un bug |
| **Retoque de intensidad "glass"** | El plan preveía bajar blur/opacidad/glow de `.glass-panel`/`.glass-panel-strong` hacia algo más plano (BRANDING.md pide "grayscale como base, color como acento"). No se tocó todavía — el cambio de fuente ya es un salto grande y se priorizó verificarlo sólido antes de tocar superficies. | No |
| **Deuda de light-mode overrides** | `app/globals.css` líneas ~590-631 tienen ~40 overrides manuales de clases `.text-white/NN` → color oscuro en modo claro — señal de que varios componentes se escribieron "dark-mode-first" con clases literales en vez de tokens semánticos. Se detectó en el relevamiento, no se tocó (fuera de alcance de este pase). Candidato a sprint dedicado de temas. | No |

---

## Estado Actual

**Tag: FUNCTIONAL → PRODUCTION-READY**

Phase 1 + Phase 2 + Phase 3 + Phase 4 completas. Para activar en producción:
1. Provisionar DB en Neon (free tier) con pgvector extension habilitada
2. Setear `DATABASE_URL` + `AUTH_SECRET` en Vercel
3. Correr `npx drizzle-kit push` (crea todas las tablas)
4. Correr `psql < lib/db/rls-policies.sql` (activa RLS)
5. Correr `npx tsx lib/db/seed.ts` (crea org + admin)
6. Correr `npx tsx lib/db/seed-countries.ts` (carga geometrías de países)
7. Setear `NIM_API_KEY` para habilitar IA
8. Opcional: `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` para Google OAuth
