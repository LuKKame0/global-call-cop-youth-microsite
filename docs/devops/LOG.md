# Bitácora de DevOps / Producción — COP Youth Policy Platform

Bitácora correlativa de iteraciones y hallazgos. Nomenclatura y variables definidas en `docs/devops/VARIABLES.md`; proceso completo en `docs/devops/PROCESS.md`. Interopera con `docs/qa/LOG.md`.

---

## DEVOPS-ITER-20260722-01

- **Fecha:** 2026-07-22
- **Rama:** `cop-youth-platform`
- **Commit de referencia:** `d42f09d`
- **Gate de QA:** `QA-ITER-20260722-01` → estado `no-apto` (hallazgos `critico`: `QA-20260722-001`, `QA-20260722-002`; `alto`: `QA-20260722-003`)
- **Alcance:** primera iteración formal del proceso de DevOps — validación de build de producción. **No se ejecuta deploy real a Vercel** en esta iteración porque el gate de QA está `no-apto`; esta iteración es de verificación local únicamente.
- **Resultado de chequeos:**
  - `npm run build` (local, `entorno: local`) → ✅ compiló exitosamente en 28.2s, 37 páginas estáticas/dinámicas generadas, sin errores de TypeScript.
  - Deploy a producción (`vercel deploy --prod`) → ⛔ **no ejecutado**, bloqueado por gate de QA.
- **Estado agregado de la iteración:** `deploy-bloqueado`

### Hallazgos

#### DEVOPS-20260722-001
| Campo | Valor |
|---|---|
| iteracion | DEVOPS-ITER-20260722-01 |
| fecha_deteccion | 2026-07-22 |
| severidad | medio |
| categoria | config |
| entorno | local |
| componente | `middleware.ts` |
| estado | abierto |
| id_relacionado | — |

**Resumen:** el build emite una advertencia de deprecación: la convención de archivo `middleware` está deprecada en esta versión de Next.js 16 a favor de `proxy`.

**Evidencia:**
```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
```
Coincide con el aviso de `AGENTS.md`: "This is NOT the Next.js you know — breaking changes... Heed deprecation notices."

**Recomendación:** migrar `middleware.ts` (208 líneas, maneja locale routing, redirects legacy, rewrite de marketing, rate limiting y `auth()`) a la convención `proxy` documentada en `node_modules/next/dist/docs/` antes de que la convención actual sea removida en una futura versión. No es bloqueante hoy (sigue funcionando), pero es deuda técnica con fecha de vencimiento implícita.

---

#### DEVOPS-20260722-002
| Campo | Valor |
|---|---|
| iteracion | DEVOPS-ITER-20260722-01 |
| fecha_deteccion | 2026-07-22 |
| severidad | **critico** |
| categoria | deploy |
| entorno | produccion |
| componente | proceso de release |
| estado | abierto |
| id_relacionado | QA-20260722-001, QA-20260722-002, QA-20260722-003 |

**Resumen:** el deploy a producción está bloqueado por el gate de QA (sección 2 de `docs/devops/PROCESS.md`) mientras `QA-ITER-20260722-01` permanezca `no-apto`.

**Evidencia:** ver `docs/qa/LOG.md`, sección "Resumen de iteración QA-ITER-20260722-01" — 2 hallazgos `critico` y 1 `alto` abiertos.

**Recomendación:** resolver `QA-20260722-001` (versionar `sites/` y `test-utils/`), `QA-20260722-002` (excluir/eliminar carpeta y zip de backup) y `QA-20260722-003` (arreglar tests de `SubmissionWizard`) antes de reintentar el deploy. Una vez resueltos, correr `QA-ITER-20260722-02` y, si da `apto-para-produccion` o `apto-con-observaciones`, abrir `DEVOPS-ITER-20260722-02` para ejecutar el deploy real.

---

#### DEVOPS-20260722-003
| Campo | Valor |
|---|---|
| iteracion | DEVOPS-ITER-20260722-01 |
| fecha_deteccion | 2026-07-22 |
| severidad | bajo |
| categoria | config |
| entorno | local |
| componente | `.env.production.local` |
| estado | abierto |
| id_relacionado | QA-20260722-010 |

**Resumen:** el build local usa `.env.production.local` (variables reales de producción pulled vía `vercel env pull`), lo cual es correcto para probar el build, pero confirma que ese archivo contiene credenciales reales sensibles en disco — mismo hallazgo que `QA-20260722-010`, registrado aquí desde la óptica operativa.

**Recomendación:** ninguna acción adicional más allá de lo ya recomendado en `QA-20260722-010`; se deja el vínculo para trazabilidad.

---

### Resumen de iteración DEVOPS-ITER-20260722-01

| Severidad | Abiertos |
|---|---|
| critico | 1 (`DEVOPS-20260722-002`) |
| alto | 0 |
| medio | 1 (`DEVOPS-20260722-001`) |
| bajo | 1 (`DEVOPS-20260722-003`) |

**Veredicto:** `deploy-bloqueado`. Build local verificado y funcional, pero el deploy a producción no debe ejecutarse hasta cerrar los hallazgos críticos de `QA-ITER-20260722-01`.

---

## DEVOPS-ITER-20260722-02

- **Fecha:** 2026-07-22
- **Rama:** `cop-youth-platform`
- **Gate de QA:** `QA-ITER-20260722-02` → estado `apto-con-observaciones` (0 hallazgos `critico`/`alto` abiertos)
- **Alcance:** re-validación tras el cierre de `QA-20260722-001/002/003`. Gate de QA ahora cumplido.
- **Resultado de chequeos:**
  - `npm run typecheck` → ✅ sin errores
  - `npm run lint` → ⚠️ 12 errores/9 warnings `medio`/`bajo` (no bloqueantes, catalogados en QA)
  - `npm run test` → ✅ 29/29 tests (10 archivos), sin duplicados
  - `npm run build` (local) → ✅ compiló exitosamente, 37 rutas generadas
  - Deploy real a Vercel (`vercel deploy --prod`) → ⏸ **no ejecutado**: acción que publica a producción y requiere confirmación explícita del usuario antes de dispararla (fuera del alcance de esta resolución automática de hallazgos).
- **Estado agregado de la iteración:** `deploy-con-observaciones` (build listo para producción; el disparo real del deploy queda pendiente de confirmación)

### Cambios aplicados

- `DEVOPS-20260722-002` → **resuelto**: el gate de QA que lo bloqueaba ya no aplica (`QA-ITER-20260722-02` es `apto-con-observaciones`).
- `DEVOPS-20260722-001` (deprecación de `middleware` → `proxy`) y `DEVOPS-20260722-003` (secretos reales en `.env.production.local`, vínculo con `QA-20260722-010`) permanecen `abierto` — no bloqueantes, deuda técnica y nota operativa respectivamente.

### Resumen de iteración DEVOPS-ITER-20260722-02

| Severidad | Abiertos | Resueltos en esta iteración |
|---|---|---|
| critico | 0 | 1 (`DEVOPS-20260722-002`) |
| alto | 0 | 0 |
| medio | 1 (`DEVOPS-20260722-001`) | 0 |
| bajo | 1 (`DEVOPS-20260722-003`) | 0 |

**Veredicto:** `deploy-con-observaciones`. El proyecto está técnicamente listo para desplegar a producción (build limpio, gate de QA satisfecho); **el deploy real (`vercel deploy --prod`) no se ejecutó** en esta sesión y debe confirmarse explícitamente antes de correrlo, por ser una acción que afecta el sitio en producción.
