# Proceso de DevOps / Producción — COP Youth Policy Platform

Define cómo se ejecuta, documenta y da seguimiento a una iteración de despliegue/operación de este repositorio. Interopera con el proceso de QA (`docs/qa/PROCESS.md`) a través de campos y estados compartidos — ver sección 6. Los detalles operativos concretos (dominios, variables de Vercel, comandos de deploy) viven en `docs/DEPLOYMENT.md`; este documento define el **proceso**, no la infraestructura en sí.

## 1. Cuándo correr una iteración de DevOps

- Antes de cada despliegue a producción (`vercel deploy --prod` o vía CI/CD en push a `main`).
- Después de cualquier cambio a variables de entorno, dominios, o configuración de Vercel/CI.
- Cuando se detecta un incidente en producción.
- Periódicamente (recomendado: antes de cada release planificada).

## 2. Precondición: gate de QA

Una iteración de DevOps de producción **no debe iniciar** si la iteración de QA más reciente (`docs/qa/LOG.md`) tiene `estado_iteracion = no-apto`. Si hay hallazgos `critico`/`alto` abiertos en QA, deben resolverse o pasar explícitamente a `promovido-a-devops` con justificación antes de desplegar.

## 3. Pasos de una iteración

1. **Preparación**: confirmar rama, commit, y que la iteración de QA de referencia esté en `apto-para-produccion` o `apto-con-observaciones`.
2. **Validación de build de producción**: `npm run build` limpio, sin errores.
3. **Validación de configuración**: variables de entorno de producción presentes en Vercel (ver tabla en `docs/DEPLOYMENT.md`), dominios y DNS correctos.
4. **Despliegue**: `vercel deploy --prod` (o vía pipeline de CI si está configurado).
5. **Verificación post-deploy**: smoke test de rutas críticas (`/`, `/insights`, `/buildthefuture`, `/faq`, login) contra la URL de producción.
6. **Registro**: cada evento/hallazgo se documenta en `docs/devops/LOG.md` con la nomenclatura de la sección 4.

## 4. Identificador de iteración

Formato: `DEVOPS-ITER-YYYYMMDD-NN`

Ejemplo: `DEVOPS-ITER-20260722-01`.

## 5. Identificador de hallazgo/evento

Formato: `DEVOPS-YYYYMMDD-NNN`

- `NNN`: correlativo de tres dígitos, global y creciente, independiente del correlativo de QA.

Ejemplo: `DEVOPS-20260722-001`.

## 6. Variables / campos obligatorios por hallazgo

| Variable | Descripción | Valores permitidos |
|---|---|---|
| `id` | Identificador único | `DEVOPS-YYYYMMDD-NNN` |
| `iteracion` | Iteración en que se detectó | `DEVOPS-ITER-YYYYMMDD-NN` |
| `fecha_deteccion` | Fecha ISO | fecha válida |
| `severidad` | Igual escala que QA | `critico` \| `alto` \| `medio` \| `bajo` |
| `categoria` | Tipo de evento/hallazgo | `deploy` \| `config` \| `secrets` \| `dominio-dns` \| `ci-cd` \| `incidente` \| `rollback` |
| `entorno` | Dónde ocurre | `local` \| `preview` \| `produccion` |
| `componente` | Ruta/servicio afectado | ruta o nombre de servicio (ej. `vercel.json`, Neon DB) |
| `estado` | Estado de ciclo de vida | `abierto` \| `en-progreso` \| `resuelto` \| `wontfix` \| `promovido-a-qa` |
| `resumen` | Una línea describiendo el hallazgo | texto libre |
| `evidencia` | Comando/log/URL que lo confirma | texto/bloque de código |
| `recomendacion` | Acción sugerida | texto libre |
| `id_relacionado` | `QA-*` o `DEVOPS-*` vinculado | ID o vacío |

Escala de `severidad` — mismo criterio que en QA (ver `docs/qa/VARIABLES.md`), aplicado al impacto operativo:
- `critico`: producción caída, secretos expuestos, pérdida de datos.
- `alto`: feature de producción rota o degradada, deploy fallido.
- `medio`: configuración subóptima, riesgo operativo no inmediato.
- `bajo`: mejora de proceso, documentación desactualizada.

## 7. Interoperabilidad con QA

- Mismos valores de `severidad`.
- `estado` incluye el puente `promovido-a-qa` (hallazgo operativo cuya causa raíz es código, no infraestructura) simétrico a `promovido-a-devops` en el proceso de QA.
- `id_relacionado` conecta ambas bitácoras (`docs/qa/LOG.md` ↔ `docs/devops/LOG.md`) para trazabilidad end-to-end de un mismo problema.
- Toda iteración de DevOps de producción debe citar el `QA-ITER-*` que la habilitó como gate (sección 2).
