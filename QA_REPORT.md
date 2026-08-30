# Reporte de QA — COP Youth Policy Platform (histórico)
Fecha: 2026-07-22 · Branch: `cop-youth-platform`

> **Nota:** este documento es el reporte exploratorio original. Fue migrado a la bitácora formal `docs/qa/LOG.md` como `QA-ITER-20260722-01` (hallazgos `QA-20260722-001` a `QA-20260722-011`), siguiendo el proceso definido en `docs/qa/PROCESS.md`. A partir de ahora usar esa bitácora y la de `docs/devops/LOG.md` como fuente de verdad; este archivo se conserva como referencia histórica y no se actualiza más.

## 1. Resumen ejecutivo

El proyecto es una app Next.js 16 (App Router) con Neon Postgres + Drizzle ORM y Auth.js v5, que sirve tanto el sitio de marketing estático (`sites/marketing` → sincronizado a `public/marketing` en cada build) como la plataforma autenticada (dashboard, submissions, directory, advocacy, team, etc.) con soporte multi-idioma vía `app/[locale]`.

**Estado general: funcional pero con deuda técnica y "basura" de repositorio que debe limpiarse antes de continuar.** Typecheck pasa limpio; lint tiene 24 errores/18 warnings reales; la suite de tests está corriendo duplicada por una carpeta de backup no excluida, y 4 tests fallan por un provider de contexto faltante.

## 2. Hallazgo crítico: carpeta de backup contaminando el repo y las herramientas

- `Global-Call-COP-Youth-Microsite-backup/` (14 MB) y `Global-Call-COP-Youth-Microsite-backup.zip` (12 MB) están en la raíz del proyecto, **no cubiertos por `.gitignore`**, y aparecen como `??` en `git status`.
- **Vitest los incluye en la ejecución de tests** (`vitest.config.ts` usa `include: ["**/*.test.ts", "**/*.test.tsx"]` sin excluir esa carpeta), por lo que la suite corre `components/submission-wizard.test.tsx` **dos veces** (una vez desde el proyecto real, otra desde el backup), duplicando fallos y tiempo de CI.
- **ESLint también lint-ea el contenido del backup**, generando errores falsos-positivos que no reflejan el estado real del código (ej. `Global-Call-COP-Youth-Microsite-backup/lib/auth/config.ts`, `.../lib/db/index.ts`, `.../lib/i18n/dictionary-loaders.ts`).
- **Acción recomendada:** mover el backup fuera del repo (a otro disco/ubicación) o, como mínimo, añadir `/Global-Call-COP-Youth-Microsite-backup/` y `/Global-Call-COP-Youth-Microsite-backup.zip` al `.gitignore` y a `eslint.config.mjs`/`vitest.config.ts` (`exclude`). Confirmar con el usuario si el backup ya cumplió su propósito antes de borrarlo.

## 3. Archivos sueltos en la raíz — triage

| Archivo/carpeta | Estado | Comentario |
|---|---|---|
| `Global-Call-COP-Youth-Microsite-backup/`, `.zip` | 🔴 Basura/riesgo | Ver sección 2. |
| `index.html.html` | 🟡 Residual | Doble extensión, 171 KB, no referenciado por el build. Candidato a borrar. |
| `Prototipe_concept (1).jpeg`, `(2).jpeg` | 🟡 Residual | Mockups de diseño temprano, sin uso en build. Mover a `docs/` o borrar. |
| `globalcall.png`, `globalcall_icon.png` | 🟡 Revisar | Confirmar si se usan en `public/` o son duplicados sueltos. |
| `landing/` | 🟢 Legítimo pero confuso | Solo contiene un `README.md` "Moved" que apunta a `sites/marketing`. Es un stub de documentación, no código. Podría fusionarse con `docs/` para evitar confusión de que sea una app. |
| `sites/marketing/` | 🟢 Legítimo | Fuente real del sitio de marketing estático; el script `scripts/sync-marketing-to-public.mjs` lo copia a `public/marketing` en `predev`/`prebuild`. |
| `branding/` | 🟢 Legítimo | Assets de marca + `BRANDING.md`. |
| `test-utils/` | 🟢 Legítimo | Contiene el shim `server-only.ts` usado como alias en `vitest.config.ts` para poder testear código server-only en jsdom. |
| `docs/` | 🟢 Legítimo | `ARCHITECTURE.md`, `DEPLOYMENT.md`, `STANDARDS.md` + un `index.bleve` (índice de búsqueda binario — confirmar si debe versionarse). |

## 4. Estructura de la app (App Router)

- **Grupos de rutas:**
  - `app/(auth)/` — login, verify, auth callback.
  - `app/(dashboard)/` — `admin/`, `dashboard/`, `org/[orgSlug]` (área autenticada).
  - `app/[locale]/` — sitio público multi-idioma: `activities`, `advocacy`, `build-the-future`, `directory`, `faq`, `insights`, `join`, `mesa`, `on-my-way`, `team`, `z-cop`.
  - `app/api/` — endpoints REST: `admin`, `apply`, `auth`, `coordination`, `directory`, `export`, `focal-point`, `org`, `organizations`, `partner`, `reports`, `search`, `submit`.
- **Rutas sin locale duplicadas:** `app/faq`, `app/insights`, `app/preview` existen fuera de `[locale]` y renderizan componentes propios (`FaqPage`, `FrameworkPage`) — no son código muerto, parecen ser fallbacks para URLs canónicas (`theglobalcall.org/insights`), pero **`app/framework/` es una carpeta completamente vacía** (sin `page.tsx`), residual de una ruta que fue movida a `/insights`. Se puede eliminar con seguridad.
- **Dashboard:** `admin/leads`, `admin/organizations`, `admin/users`, `dashboard`, `org/[orgSlug]` — CRUD de organizaciones, usuarios, leads.
- Falta confirmar con detalle: componentes de negocio y el Auth.js config completo (cubierto por el agente de exploración en curso).

## 5. Calidad de código — resultados objetivos

### `npm run typecheck` → ✅ **Sin errores**

### `npm run lint` → ❌ **24 errores, 18 warnings**
Errores reales (excluyendo el ruido del backup, ver sección 2):
- `app/(dashboard)/layout.tsx:15` — `any` explícito.
- `app/api/export/route.ts:19`, `app/api/organizations/[orgId]/invite/route.ts:28`, `app/api/reports/pdf/route.ts:20`, `app/api/reports/route.ts:19`, `app/api/search/route.ts:29` — todos `@typescript-eslint/no-explicit-any` en rutas API.
- `lib/auth/config.ts:153`, `lib/db/index.ts:19`, `lib/ai/nim.ts:47` — más `any` explícitos.
- `lib/i18n/dictionary-loaders.ts:9` — **asigna a la variable `module`**, error específico de Next.js (`@next/next/no-assign-module-variable`) que puede causar bugs de bundling.
- `components/dashboard/record-detail-modal.tsx:34` y `components/theme-toggle.tsx:30` — **`setState` síncrono dentro de un `useEffect`**, señalado por `react-hooks/set-state-in-effect`; puede causar renders en cascada.

Warnings (variables/imports sin usar) — bajo impacto pero fácil de limpiar: `app/preview/page.tsx`, `app/api/organizations/[orgId]/invite/route.ts`, `lib/ai/semantic-search.ts`, `lib/analytics/comparison.ts`, `components/sandbox/data-art/zcop-data-art.tsx`.

### `npm run test` (vitest) → ❌ **8 fallos de 58+8 tests** (4 reales + 4 duplicados del backup)
- Archivo real: `components/submission-wizard.test.tsx` — **4 de 4 tests fallan** con:
  ```
  Error: useLocale must be used within LocaleProvider
    at useLocale lib/i18n/context.tsx:101
    at useDictionary lib/i18n/context.tsx:107
    at useLocalizedSubmissionContent lib/i18n/localized-submission.ts:8
    at SubmissionWizard components/submission-wizard.tsx:139
  ```
  El componente `SubmissionWizard` ahora depende de `LocaleProvider` (i18n), pero el test no envuelve el render con ese provider — probable regresión introducida al añadir soporte multi-idioma sin actualizar el test. **Bloqueante de cobertura real**, no solo cosmético.
- Los otros 4 fallos son la ejecución duplicada del mismo test dentro de `Global-Call-COP-Youth-Microsite-backup/` (ver sección 2).

## 6. Configuración y secretos

- `.gitignore` cubre `.env*` correctamente. Verificado con `git ls-files`: **solo `.env.example` está trackeado**, ningún secreto de `.env.local` / `.env.production.local` / `.env.vercel.production` fue commiteado.
- `.env.production.local` contiene credenciales reales de producción (`AUTH_SECRET`, `DATABASE_URL`, credenciales Postgres/Neon) — correctamente ignorado, pero al estar en el working directory conviene recordar no incluirlo nunca en zips/backups que se compartan (revisar si el zip de la sección 2 lo contiene).
- `.env.example` está bien documentado (Auth, email vía SMTP/Mailgun/Resend, Google Sheets webhook, IA vía NVIDIA NIM) y no contiene valores reales.

## 7. Hallazgo crítico adicional: archivos funcionales NO versionados en git

`git status` muestra `sites/` y `test-utils/` como **untracked**, pero ambos son **requeridos para que el proyecto funcione**:
- `sites/marketing/` es la fuente que `scripts/sync-marketing-to-public.mjs` copia a `public/marketing` en `predev`/`prebuild`. Sin ella, `npm run dev`/`build` **fallan** (`console.error("[sync-marketing] Missing source directory")` seguido de `process.exit(1)`).
- `test-utils/server-only.ts` es el shim que `vitest.config.ts` usa como alias del paquete `server-only`. Sin él, cualquier test que importe código server-only rompe.

**Consecuencia:** alguien que clone `origin/cop-youth-platform` desde cero, sin estos dos directorios ya presentes en el disco local del usuario, tendría el build y los tests rotos de inmediato. Esto es más urgente que la limpieza cosmética — hay que **hacer `git add sites/ test-utils/` y commitear** cuanto antes (branding/ y docs/index.bleve pueden evaluarse aparte).

## 8. Naming confuso: dos archivos "schema"

- `lib/db/schema.ts` (340 líneas) — el schema real de Drizzle/Postgres (tablas, enums, pgvector).
- `lib/schema.ts` (63 líneas) — **no es de base de datos**, es un schema de validación **Zod** (`submissionPayloadSchema`) para el wizard de submission, con su propio `lib/schema.test.ts`.

Ambos coexisten con nombres casi idénticos, lo cual puede llevar a confusión al navegar el código o hacer imports cruzados por error. Considerar renombrar `lib/schema.ts` a algo como `lib/validation/submission-schema.ts`.

## 9. Recomendaciones priorizadas

1. **Crítico:** versionar `sites/` y `test-utils/` (`git add` + commit) — sin esto, un clon limpio del repo no builda ni testea.
2. **Alta prioridad:** excluir/eliminar `Global-Call-COP-Youth-Microsite-backup/` y el `.zip` del repo y de la config de tsconfig/vitest/eslint — esto está inflando falsos errores y duplicando fallos de test.
3. **Alta prioridad:** arreglar el test de `SubmissionWizard` envolviéndolo con `LocaleProvider` (o el helper de test correspondiente) — actualmente la feature de envío de propuestas no tiene cobertura verde.
4. **Media prioridad:** eliminar los 8 usos de `any` explícito en rutas API y libs core (`lib/auth/config.ts`, `lib/db/index.ts`, `lib/ai/nim.ts`) — son puntos sensibles (auth, DB, IA) donde perder tipado es más riesgoso.
5. **Media prioridad:** corregir el patrón `setState` síncrono en efectos en `theme-toggle.tsx` y `record-detail-modal.tsx`.
6. **Media prioridad:** renombrar `lib/schema.ts` para evitar confusión con `lib/db/schema.ts`.
7. **Baja prioridad:** limpiar `app/framework/` (carpeta vacía), `index.html.html`, las imágenes `Prototipe_concept (*).jpeg` y `globalcall*.png` sueltas en la raíz (ya existen en `public/`/`sites/marketing/assets/`), y confirmar si `docs/index.bleve` debe estar versionado.
8. **Riesgo a monitorear:** `next-auth@5.0.0-beta.31` sigue en beta, sin release estable — vigilar cambios breaking en futuras actualizaciones.
9. **Verificar antes de la próxima release:** correr `npm run build` completo para confirmar que el build de producción compila sin errores (no ejecutado en esta pasada).

## 10. Nota de seguridad
No hay secretos comprometidos en git (`.gitignore` cubre `.env*` correctamente; solo `.env.example` está trackeado). Sin embargo, `.env.production.local` contiene credenciales reales de producción (Neon `DATABASE_URL`, `AUTH_SECRET`, tokens de Vercel) presentes en disco — asegurarse de que nunca se incluyan al compartir el repo como carpeta o zip (no se verificó el contenido exacto de `Global-Call-COP-Youth-Microsite-backup.zip`, se recomienda confirmarlo antes de distribuirlo).
