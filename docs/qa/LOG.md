# Bitácora de QA — COP Youth Policy Platform

Bitácora correlativa de iteraciones y hallazgos. Nomenclatura y variables definidas en `docs/qa/VARIABLES.md`; proceso completo en `docs/qa/PROCESS.md`.

---

## QA-ITER-20260722-01

- **Fecha:** 2026-07-22
- **Rama:** `cop-youth-platform`
- **Commit de referencia:** `d42f09d` (feat: add Directory, Advocacy, and Team pages + nav)
- **Alcance:** primera iteración formal del proceso — migración del reporte de QA exploratorio previo (`QA_REPORT.md`, generado antes de establecer este proceso) a la nomenclatura correlativa.
- **Resultado de chequeos automatizados:**
  - `npm run typecheck` → ✅ sin errores
  - `npm run lint` → ❌ 24 errores, 18 warnings (ver hallazgos)
  - `npm run test` → ❌ 8 fallos / 58 tests corridos (4 reales + 4 duplicados por `QA-20260722-002`)
  - `npm run build` → ⏸ no ejecutado en esta iteración (pendiente, ver `QA-20260722-011`)
- **Estado agregado de la iteración:** `no-apto` (hay hallazgos `critico` y `alto` abiertos)

### Hallazgos

#### QA-20260722-001
| Campo | Valor |
|---|---|
| iteracion | QA-ITER-20260722-01 |
| fecha_deteccion | 2026-07-22 |
| severidad | **critico** |
| categoria | higiene-repo |
| componente | `sites/`, `test-utils/` |
| estado | **resuelto** (QA-ITER-20260722-02) |
| id_relacionado | — |

**Resumen:** `sites/` (fuente del sitio de marketing) y `test-utils/` (shim `server-only.ts` usado por Vitest) están `untracked` en git pese a ser requeridos por `predev`/`prebuild` y por `vitest.config.ts`.

**Evidencia:**
```
git status --short
?? sites/
?? test-utils/
```
`scripts/sync-marketing-to-public.mjs` hace `process.exit(1)` si `sites/marketing` no existe.

**Recomendación:** `git add sites/ test-utils/` y commitear antes de cualquier clon/onboarding nuevo. Bloqueante para cualquier entorno que no sea el disco local actual.

---

#### QA-20260722-002
| Campo | Valor |
|---|---|
| iteracion | QA-ITER-20260722-01 |
| fecha_deteccion | 2026-07-22 |
| severidad | **critico** |
| categoria | higiene-repo |
| componente | `Global-Call-COP-Youth-Microsite-backup/`, `Global-Call-COP-Youth-Microsite-backup.zip` |
| estado | **resuelto** (QA-ITER-20260722-02) |
| id_relacionado | — |

**Resumen:** copia casi completa del repo (14MB carpeta + 12MB zip) vive en la raíz, no está en `.gitignore`, y es procesada por `tsc`, `eslint` y `vitest`, duplicando/inflando resultados.

**Evidencia:**
```
npx vitest run
# ejecuta components/submission-wizard.test.tsx
# Y TAMBIÉN Global-Call-COP-Youth-Microsite-backup/components/submission-wizard.test.tsx
Test Files  2 failed | 18 passed (20)
Tests       8 failed | 50 passed (58)
```

**Recomendación:** mover el backup fuera del repo, o excluirlo en `tsconfig.json` (`exclude`), `eslint.config.mjs` (`globalIgnores`) y `vitest.config.ts` (`exclude`), y añadirlo a `.gitignore`.

---

#### QA-20260722-003
| Campo | Valor |
|---|---|
| iteracion | QA-ITER-20260722-01 |
| fecha_deteccion | 2026-07-22 |
| severidad | **alto** |
| categoria | test |
| componente | `components/submission-wizard.tsx`, `components/submission-wizard.test.tsx` |
| estado | **resuelto** (QA-ITER-20260722-02) |
| id_relacionado | — |

**Resumen:** 4 de 4 tests de `SubmissionWizard` fallan porque el componente ahora depende de `useLocale`/`LocaleProvider` (i18n) y el test no lo envuelve en el provider.

**Evidencia:**
```
Error: useLocale must be used within LocaleProvider
  at useLocale lib/i18n/context.tsx:101
  at useDictionary lib/i18n/context.tsx:107
  at useLocalizedSubmissionContent lib/i18n/localized-submission.ts:8
  at SubmissionWizard components/submission-wizard.tsx:139
```

**Recomendación:** envolver el render de test con `LocaleProvider` (o helper de test equivalente). Bloquea cobertura real de la feature de envío de propuestas.

---

#### QA-20260722-004
| Campo | Valor |
|---|---|
| iteracion | QA-ITER-20260722-01 |
| fecha_deteccion | 2026-07-22 |
| severidad | medio |
| categoria | lint |
| componente | `app/(dashboard)/layout.tsx`, `app/api/export/route.ts`, `app/api/organizations/[orgId]/invite/route.ts`, `app/api/reports/pdf/route.ts`, `app/api/reports/route.ts`, `app/api/search/route.ts`, `lib/auth/config.ts`, `lib/db/index.ts`, `lib/ai/nim.ts` |
| estado | abierto |
| id_relacionado | — |

**Resumen:** 9 usos de `any` explícito (`@typescript-eslint/no-explicit-any`) en rutas API y librerías core de auth/DB/IA.

**Recomendación:** tipar explícitamente, priorizando `lib/auth/config.ts` y `lib/db/index.ts` por ser puntos sensibles.

---

#### QA-20260722-005
| Campo | Valor |
|---|---|
| iteracion | QA-ITER-20260722-01 |
| fecha_deteccion | 2026-07-22 |
| severidad | medio |
| categoria | lint |
| componente | `lib/i18n/dictionary-loaders.ts:9` |
| estado | abierto |
| id_relacionado | — |

**Resumen:** asignación a la variable `module`, prohibido explícitamente por Next.js (`@next/next/no-assign-module-variable`), riesgo de bugs de bundling.

**Recomendación:** renombrar la variable local que colisiona con `module`.

---

#### QA-20260722-006
| Campo | Valor |
|---|---|
| iteracion | QA-ITER-20260722-01 |
| fecha_deteccion | 2026-07-22 |
| severidad | medio |
| categoria | lint |
| componente | `components/dashboard/record-detail-modal.tsx:34`, `components/theme-toggle.tsx:30` |
| estado | abierto |
| id_relacionado | — |

**Resumen:** `setState` síncrono dentro de `useEffect` (`react-hooks/set-state-in-effect`), puede causar renders en cascada.

**Recomendación:** refactorizar a patrón derivado (lazy `useState` init) o mover la lógica fuera del efecto según corresponda.

---

#### QA-20260722-007
| Campo | Valor |
|---|---|
| iteracion | QA-ITER-20260722-01 |
| fecha_deteccion | 2026-07-22 |
| severidad | medio |
| categoria | naming |
| componente | `lib/schema.ts`, `lib/db/schema.ts` |
| estado | abierto |
| id_relacionado | — |

**Resumen:** `lib/db/schema.ts` es el schema Drizzle/Postgres; `lib/schema.ts` es un schema de validación Zod para el submission wizard. Nombres casi idénticos, propósitos totalmente distintos.

**Recomendación:** renombrar `lib/schema.ts` a `lib/validation/submission-schema.ts` (o similar) y actualizar imports/`lib/schema.test.ts`.

---

#### QA-20260722-008
| Campo | Valor |
|---|---|
| iteracion | QA-ITER-20260722-01 |
| fecha_deteccion | 2026-07-22 |
| severidad | bajo |
| categoria | higiene-repo |
| componente | `app/framework/`, `index.html.html`, `Prototipe_concept (1).jpeg`, `Prototipe_concept (2).jpeg`, `globalcall.png`, `globalcall_icon.png` (copias sueltas en raíz) |
| estado | abierto |
| id_relacionado | — |

**Resumen:** carpeta de ruta vacía (`app/framework/`, ya no usada — el redirect va a `/insights`) y archivos residuales de diseño/export sueltos en la raíz, sin uso en el build. Las imágenes `globalcall*.png` de la raíz son redundantes con las copias reales en `public/`/`sites/marketing/assets/`.

**Recomendación:** eliminar `app/framework/` y mover o borrar los archivos residuales sueltos.

---

#### QA-20260722-009
| Campo | Valor |
|---|---|
| iteracion | QA-ITER-20260722-01 |
| fecha_deteccion | 2026-07-22 |
| severidad | bajo |
| categoria | dependencia |
| componente | `package.json` (`next-auth@5.0.0-beta.31`) |
| estado | abierto |
| id_relacionado | — |

**Resumen:** Auth.js v5 sigue en beta, sin release estable — riesgo de breaking changes en actualizaciones futuras.

**Recomendación:** monitorear el release estable de `next-auth` v5 y planificar upgrade cuando esté disponible.

---

#### QA-20260722-010
| Campo | Valor |
|---|---|
| iteracion | QA-ITER-20260722-01 |
| fecha_deteccion | 2026-07-22 |
| severidad | bajo |
| categoria | seguridad |
| componente | `.env.production.local`, `Global-Call-COP-Youth-Microsite-backup.zip` |
| estado | abierto |
| id_relacionado | QA-20260722-002 |

**Resumen:** no hay secretos comprometidos en git (`.gitignore` cubre `.env*` correctamente, solo `.env.example` trackeado), pero `.env.production.local` contiene credenciales reales de producción (Neon `DATABASE_URL`, `AUTH_SECRET`, tokens Vercel) en disco. No se verificó si el zip de backup incluye copias de estos archivos.

**Recomendación:** confirmar el contenido del zip antes de compartirlo/distribuirlo; nunca incluir `.env.production.local` en backups que salgan del entorno local.

---

#### QA-20260722-011
| Campo | Valor |
|---|---|
| iteracion | QA-ITER-20260722-01 |
| fecha_deteccion | 2026-07-22 |
| severidad | medio |
| categoria | build |
| componente | build completo (`npm run build`) |
| estado | abierto |
| id_relacionado | — |

**Resumen:** no se ejecutó `npm run build` completo en esta iteración por tiempo; `next.config.ts`, `middleware.ts` (208 líneas) y `lib/db/schema.ts` (340 líneas) no fueron auditados en profundidad.

**Recomendación:** correr `npm run build` en la próxima iteración antes de certificar `apto-para-produccion`.

---

### Resumen de iteración QA-ITER-20260722-01

| Severidad | Abiertos |
|---|---|
| critico | 2 (`QA-20260722-001`, `QA-20260722-002`) |
| alto | 1 (`QA-20260722-003`) |
| medio | 4 (`QA-20260722-004` a `007`, `011`) |
| bajo | 3 (`QA-20260722-008` a `010`) |

**Veredicto:** `no-apto` para producción hasta resolver `QA-20260722-001`, `QA-20260722-002` y `QA-20260722-003`.

---

## QA-ITER-20260722-02

- **Fecha:** 2026-07-22
- **Rama:** `cop-youth-platform`
- **Alcance:** resolución de los hallazgos bloqueantes (`critico`/`alto`) de `QA-ITER-20260722-01`.
- **Resultado de chequeos automatizados:**
  - `npm run typecheck` → ✅ sin errores
  - `npm run lint` → ⚠️ 12 errores, 9 warnings reales (bajó de 24/18 al eliminar el ruido del backup) — todos ya catalogados como `QA-20260722-004`/`005`/`006` (medio) y sin severidad crítica/alta
  - `npm run test` → ✅ 29/29 tests, 10 archivos, **sin duplicados** (antes 58 tests con 8 fallos por la ejecución duplicada del backup)
  - `npm run build` → ✅ compiló exitosamente, 37 rutas generadas
- **Estado agregado de la iteración:** `apto-con-observaciones`

### Cambios aplicados

- **`QA-20260722-001` → `resuelto`.** `git add sites/ test-utils/` — ambos directorios ahora versionados. Verificado que `predev`/`prebuild` (`scripts/sync-marketing-to-public.mjs`) y `vitest.config.ts` (alias `server-only`) siguen funcionando tras el `git add`.
- **`QA-20260722-002` → `resuelto`.** `Global-Call-COP-Youth-Microsite-backup/` y `.zip` movidos fuera del repo a `E:\_archivados-cop-youth\` (decisión del usuario). Adicionalmente, como defensa contra futuros backups sueltos en el working tree:
  - `tsconfig.json`: `exclude` ahora incluye `**/*-backup/**` y `**/*-backup.zip`.
  - `eslint.config.mjs`: `globalIgnores` ahora incluye `**/*-backup/**`.
  - `vitest.config.ts`: se agregó `exclude: ["**/node_modules/**", "**/*-backup/**"]`.
  - `.gitignore`: se agregó `*-backup/` y `*-backup.zip`.
- **`QA-20260722-003` → `resuelto`.** `components/submission-wizard.test.tsx` actualizado:
  - Se agregó `renderWizard()`, un helper que envuelve `<SubmissionWizard />` en `<LocaleProvider locale={DEFAULT_LOCALE} dictionary={...}>` (cargando el diccionario real vía `loadDictionary`).
  - Se mockeó `next/navigation`'s `usePathname` (retorna `"/en"`) porque `LocaleProvider` lo invoca en un efecto y jsdom no provee un router de Next real — sin el mock, `usePathname()` devuelve `null` y `localeFromPathname` explota (`Cannot read properties of null (reading 'split')`).
  - Los 4 `render(<SubmissionWizard />)` se reemplazaron por `await renderWizard()`.

### Hallazgos que permanecen abiertos (no bloqueantes)

`QA-20260722-004` a `QA-20260722-011` siguen `abierto`, todos `medio`/`bajo`. No se tocaron en esta iteración.

### Resumen de iteración QA-ITER-20260722-02

| Severidad | Abiertos | Resueltos en esta iteración |
|---|---|---|
| critico | 0 | 2 (`QA-20260722-001`, `QA-20260722-002`) |
| alto | 0 | 1 (`QA-20260722-003`) |
| medio | 4 | 0 |
| bajo | 3 | 0 |

**Veredicto:** `apto-con-observaciones` — habilita el gate de `docs/devops/PROCESS.md` sección 2 para una nueva iteración de DevOps.
