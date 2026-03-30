/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly TURNSTILE_SECRET_KEY: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
  readonly TURNSTILE_ALLOWED_HOSTNAMES: string;
  readonly ALLOWED_FORM_ORIGINS: string;
  readonly RESEND_API_KEY: string;
  readonly RESEND_FROM: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
