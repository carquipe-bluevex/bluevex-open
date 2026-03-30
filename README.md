# BlueVex Web

Sitio web corporativo de BlueVex construido con Astro.

## Stack

- Astro 6
- TypeScript
- Playwright (E2E)
- Deploy en Vercel

## Servicios externos

- **Umami Analytics** (`https://cloud.umami.is/script.js`) para analitica web.
- **Cloudflare Turnstile** (`https://challenges.cloudflare.com/turnstile/`) para captcha anti-bot en formularios.
- **Resend** (`https://api.resend.com/emails`) para envio de emails de contacto y talento.

## Requisitos

- Node.js 20+
- npm 10+

## Instalacion

1. Instala dependencias:

```bash
npm install
```

2. Crea variables de entorno desde plantilla:

```bash
cp .env.template .env.local
```

Para local con Turnstile de prueba, puedes usar:

```bash
cp .env.local.example .env.local
```

3. Rellena los valores en `.env.local`.

## Variables de entorno

Definidas en `src/env.d.ts`:

- `RESEND_API_KEY`
- `RESEND_FROM`
- `TURNSTILE_SECRET_KEY`
- `PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_ALLOWED_HOSTNAMES`
- `ALLOWED_FORM_ORIGINS`

Referencia de ejemplo en `.env.template`.

Para desarrollo local con Turnstile, hay un ejemplo listo en `.env.local.example` con claves de test oficiales de Cloudflare.

## Scripts

- `npm run dev` - Inicia desarrollo local
- `npm run build` - Genera build de produccion
- `npm run preview` - Sirve el build local
- `npm run typecheck` - Ejecuta `astro check`
- `npm run lint` - Typecheck + Prettier check
- `npm run format` - Formatea el repo con Prettier
- `npm run test:e2e` - Ejecuta tests E2E (Playwright)

## Estructura del proyecto

```text
src/
  components/        # UI compartida
  features/          # Modulos feature-first
    forms/
      client/        # Logica cliente de formularios
      server/        # Validadores, handlers y servicio de email
  layouts/           # Layouts globales
  pages/             # Rutas Astro
    api/             # Endpoints (contacto, talento)
  security/          # Guardas de origen, rate limit y Turnstile
  styles/            # Tokens y estilos globales
tests/               # E2E tests (Playwright)
docs/                # Documentacion de mantenimiento
```

## Formularios y seguridad

Los endpoints de `contacto` y `talento` aplican:

- validacion de content-type y tamano de payload
- validacion de origen (`ALLOWED_FORM_ORIGINS`)
- rate limiting por IP
- honeypot anti-bot
- verificacion Cloudflare Turnstile (si hay clave)
- envio de email via Resend

## Deployment

- Configurado para Vercel en `astro.config.mjs` y `vercel.json`.
- Se aplican cabeceras de seguridad (CSP, HSTS y politicas adicionales).

## Notas

- Para cambios grandes de arquitectura, revisa `docs/maintainability-plan.md`.
