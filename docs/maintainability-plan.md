# Plan de mejora de mantenibilidad (Astro)

Este documento recoge los pasos acordados para mejorar mantenibilidad del proyecto BlueVex.

## Prioridad 1 - Higiene del repositorio

1. Dejar de versionar artefactos generados y dependencias:
   - `node_modules/`
   - `dist/`
   - `.vercel/`
   - `.astro/`
2. Actualizar `.gitignore` para cubrir lo anterior.
3. Limpiar el índice de git para que solo quede código fuente y archivos de configuración necesarios.

## Prioridad 2 - Base de calidad y DX

1. Añadir scripts en `package.json`:
   - `typecheck`
   - `lint`
   - `format`
   - `test:e2e`
2. Tipar variables de entorno en `src/env.d.ts`:
   - `TURNSTILE_SECRET_KEY`
   - `PUBLIC_TURNSTILE_SITE_KEY`
   - `ALLOWED_FORM_ORIGINS`
   - `RESEND_API_KEY`
   - `RESEND_FROM`
3. Eliminar dependencias sin uso (por ejemplo, revisar `busboy`).

## Prioridad 3 - Refactor de formularios (feature-first)

1. Crear módulo de dominio en `src/features/forms/`:
   - `server/validators.ts`
   - `server/mail-service.ts`
   - `server/responses.ts`
   - handlers específicos por formulario
2. Reducir duplicación entre `src/pages/api/contacto.ts` y `src/pages/api/talent.ts`.
3. Extraer lógica cliente compartida de envío de formularios para evitar scripts inline duplicados.

## Prioridad 4 - Descomposición de páginas grandes

1. Dividir páginas monolíticas en secciones reutilizables:
   - `src/pages/index.astro`
   - `src/pages/contacto.astro`
   - `src/pages/servicios/index.astro`
2. Mover bloques a `src/features/<dominio>/components/`.
3. Mantener `src/components/ui/` para componentes verdaderamente reutilizables.

## Prioridad 5 - Limpieza de estilos y consistencia

1. Reducir `style="..."` inline en páginas.
2. Mover estilos a clases semánticas o utilidades compartidas.
3. Revisar duplicados y drift entre componentes (`Modal` vs `SuccessModal`).
4. Centralizar constantes de marca/contacto en `src/config/site.ts`:
   - URL del sitio
   - email de contacto
   - enlaces sociales

## Prioridad 6 - Robustez con navegación de Astro

1. Revisar scripts de componentes/páginas para evitar listeners duplicados con `ClientRouter`.
2. Añadir guardas de inicialización o lifecycle hooks cuando aplique.
3. Alinear tests E2E con selectores estables (`data-testid`) en vez de texto frágil.

## Ejecución recomendada en PRs

1. **PR 1:** Higiene de repo + scripts de calidad + tipado env.
2. **PR 2:** Refactor de formularios (API + cliente compartido).
3. **PR 3:** Descomposición de páginas y limpieza de estilos inline.
