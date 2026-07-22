# Proceso de QA — COP Youth Policy Platform

Define cómo se ejecuta, documenta y da seguimiento a una iteración de control de calidad sobre este repositorio. Interopera con el proceso de DevOps (ver `docs/devops/PROCESS.md`) a través de campos y estados compartidos — ver sección 6.

## 1. Cuándo correr una iteración de QA

- Antes de cualquier merge a `main`.
- Antes de pasar código a producción (dispara la iteración de DevOps correspondiente, ver `docs/devops/PROCESS.md`).
- Cuando se detecta una regresión reportada por el usuario o por CI.
- Periódicamente (recomendado: semanal) mientras haya desarrollo activo.

## 2. Pasos de una iteración

1. **Preparación**: confirmar rama y commit de referencia (`git status`, `git log -1`).
2. **Chequeos automatizados** (en este orden, todos deben correr aunque alguno falle):
   - `npm run typecheck`
   - `npm run lint`
   - `npm run test`
   - `npm run build` (al menos una vez por iteración completa; opcional en iteraciones rápidas de un solo hallazgo)
3. **Revisión manual de higiene de repo**: archivos untracked inesperados, secretos en disco, carpetas residuales, `.gitignore` desactualizado.
4. **Registro de hallazgos**: cada problema encontrado se documenta como una entrada individual en `docs/qa/LOG.md` usando la nomenclatura de la sección 4.
5. **Cierre de iteración**: se agrega un resumen de iteración (cabecera) en `LOG.md` con el estado agregado.

## 3. Identificador de iteración

Formato: `QA-ITER-YYYYMMDD-NN`

- `YYYYMMDD`: fecha de ejecución.
- `NN`: correlativo de dos dígitos dentro del día (01, 02, ...), por si se corre más de una iteración el mismo día.

Ejemplo: `QA-ITER-20260722-01`.

## 4. Identificador de hallazgo

Formato: `QA-YYYYMMDD-NNN`

- `YYYYMMDD`: fecha en que se detectó (no necesariamente la de la iteración, si el hallazgo persiste de una iteración anterior se mantiene su ID original).
- `NNN`: correlativo de tres dígitos, **global y creciente**, nunca se reutiliza aunque un hallazgo se cierre.

Ejemplo: `QA-20260722-001`.

## 5. Variables / campos obligatorios por hallazgo

Todo hallazgo en `docs/qa/LOG.md` se documenta con esta tabla de variables:

| Variable | Descripción | Valores permitidos |
|---|---|---|
| `id` | Identificador único del hallazgo | `QA-YYYYMMDD-NNN` |
| `iteracion` | Iteración en que se detectó | `QA-ITER-YYYYMMDD-NN` |
| `fecha_deteccion` | Fecha ISO (`YYYY-MM-DD`) | fecha válida |
| `severidad` | Impacto del hallazgo | `critico` \| `alto` \| `medio` \| `bajo` |
| `categoria` | Tipo de hallazgo | `higiene-repo` \| `build` \| `lint` \| `test` \| `seguridad` \| `arquitectura` \| `naming` \| `dependencia` |
| `componente` | Ruta o subsistema afectado | ruta relativa (ej. `lib/db/schema.ts`) |
| `estado` | Estado de ciclo de vida | `abierto` \| `en-progreso` \| `resuelto` \| `wontfix` \| `promovido-a-devops` |
| `resumen` | Una línea describiendo el defecto | texto libre |
| `evidencia` | Comando/salida que lo confirma | texto/bloque de código |
| `recomendacion` | Acción sugerida | texto libre |
| `id_relacionado` | Otro `QA-*` o `DEVOPS-*` vinculado | ID o vacío |

### Valores de `severidad` — criterio

- `critico`: bloquea build/tests para cualquier desarrollador, o expone secretos/datos.
- `alto`: rompe una feature o deja código sin cobertura de tests real.
- `medio`: deuda técnica con riesgo concreto pero no bloqueante.
- `bajo`: cosmético, limpieza, no afecta funcionalidad ni seguridad.

### Valores de `estado` — ciclo de vida

`abierto` → `en-progreso` → `resuelto` (o `wontfix`). Un hallazgo de QA que requiere una acción operativa/infraestructura (ej. rotar un secreto, cambiar una config de deploy) pasa a `promovido-a-devops` y se referencia con un `id_relacionado` `DEVOPS-*` creado en el proceso hermano.

## 6. Interoperabilidad con DevOps

- Mismo esquema de `severidad` (`critico|alto|medio|bajo`) y de `estado` (con `promovido-a-devops` / `promovido-a-qa` como puentes en ambos procesos).
- El campo `id_relacionado` permite trazabilidad cruzada bidireccional entre `docs/qa/LOG.md` y `docs/devops/LOG.md`.
- Antes de una iteración de DevOps de producción, la iteración de QA correspondiente debe estar en estado agregado `apto-para-produccion` o `apto-con-observaciones` (ver cabecera de iteración en `LOG.md`).
