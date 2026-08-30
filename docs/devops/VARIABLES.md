# Glosario y Variables — Proceso de DevOps

Referencia rápida de nomenclatura usada en `docs/devops/LOG.md`. Ver `docs/devops/PROCESS.md` para el proceso completo. Comparte la escala de `severidad` con `docs/qa/VARIABLES.md` por diseño (interoperabilidad).

## IDs

| Patrón | Uso | Ejemplo |
|---|---|---|
| `DEVOPS-ITER-YYYYMMDD-NN` | Identifica una iteración completa del proceso de DevOps | `DEVOPS-ITER-20260722-01` |
| `DEVOPS-YYYYMMDD-NNN` | Identifica un hallazgo/evento individual, correlativo global | `DEVOPS-20260722-001` |

## Enums

### `severidad` (idéntico a QA)
- `critico`
- `alto`
- `medio`
- `bajo`

### `categoria`
- `deploy` — el acto de desplegar, build de producción.
- `config` — variables de entorno, `vercel.json`, `next.config.ts`.
- `secrets` — manejo de credenciales/tokens.
- `dominio-dns` — dominios, redirects, certificados.
- `ci-cd` — GitHub Actions / pipeline.
- `incidente` — falla detectada en producción ya desplegada.
- `rollback` — reversión de un deploy.

### `entorno`
- `local`
- `preview`
- `produccion`

### `estado`
- `abierto`
- `en-progreso`
- `resuelto`
- `wontfix`
- `promovido-a-qa`

### `estado_iteracion` (cabecera de iteración en LOG.md)
- `deploy-exitoso`
- `deploy-con-observaciones`
- `deploy-bloqueado` (gate de QA no cumplido, o hallazgo `critico`/`alto` abierto)
- `rollback-ejecutado`

## Convenciones de commit vinculado

`fix(devops): resolve DEVOPS-20260722-002 — ...`
