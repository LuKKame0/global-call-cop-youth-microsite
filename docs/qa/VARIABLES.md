# Glosario y Variables — Proceso de QA

Referencia rápida de nomenclatura usada en `docs/qa/LOG.md`. Ver `docs/qa/PROCESS.md` para el proceso completo.

## IDs

| Patrón | Uso | Ejemplo |
|---|---|---|
| `QA-ITER-YYYYMMDD-NN` | Identifica una iteración completa del proceso de QA | `QA-ITER-20260722-01` |
| `QA-YYYYMMDD-NNN` | Identifica un hallazgo individual, correlativo global | `QA-20260722-001` |

## Enums

### `severidad`
- `critico`
- `alto`
- `medio`
- `bajo`

### `categoria`
- `higiene-repo` — archivos residuales, untracked inesperados, estructura de carpetas.
- `build` — falla de compilación/build.
- `lint` — hallazgos de ESLint/Prettier.
- `test` — tests rotos, sin cobertura, falsos positivos/negativos.
- `seguridad` — secretos, exposición de datos, permisos.
- `arquitectura` — decisiones estructurales, duplicación de rutas/lógica.
- `naming` — nomenclatura ambigua o inconsistente.
- `dependencia` — versiones beta, paquetes desactualizados o riesgosos.

### `estado`
- `abierto`
- `en-progreso`
- `resuelto`
- `wontfix`
- `promovido-a-devops`

### `estado_iteracion` (cabecera de iteración en LOG.md)
- `apto-para-produccion` — sin hallazgos `critico`/`alto` abiertos.
- `apto-con-observaciones` — hallazgos `medio`/`bajo` abiertos, ninguno bloqueante.
- `no-apto` — hay al menos un hallazgo `critico` o `alto` abierto.

## Convenciones de commit vinculado

Al resolver un hallazgo, referenciar su ID en el commit: `fix(qa): resolve QA-20260722-002 — ...`
