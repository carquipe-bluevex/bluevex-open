# BlueVex Technical Implementation Guide

## Build and Deployment Processes

### Development Workflow
```bash
# 1. Environment Setup
npm install
cp .env.example .env

# 2. Development Server
npm run dev          # Start development server on localhost:4321
npm run build        # Production build
npm run preview      # Preview production build locally
npm run type-check   # TypeScript/Astro checking
npm run lint         # Run ESLint
```

### Git Workflow Strategy
```bash
# Feature Branch Workflow
git checkout -b feature/new-component
git add .
git commit -m "feat: add new service card component"
git push origin feature/new-component
# Create pull request
# Code review
# Merge to main

# Branch Naming Conventions
feature/feature-name
bugfix/bug-description
hotfix/urgent-fix
release/version-number
```

### Deployment Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Environment Configuration
```bash
# .env.example
# Site Configuration
SITE_URL=https://bluevex.com
SITE_NAME=BlueVex

# Analytics (Optional)
PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Contact Form
PUBLIC_TINYFORM_URL=https://tinyform.com/submit/bluevex-form
```

## Astro Configuration

### astro.config.mjs
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  integrations: [tailwind()],
  site: 'https://bluevex.com',
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      cssMinify: true
    }
  }
});
```

### Adding React for Interactive Components
```bash
npx astro add react
```

```javascript
// astro.config.mjs with React
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [tailwind(), react()],
  site: 'https://bluevex.com',
});
```

## Testing Strategies

### E2E Testing with Playwright
```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Example
```typescript
// e2e/contact.spec.ts
import { test, expect } from '@playwright/test';

test('contact form submission', async ({ page }) => {
  await page.goto('/contact');

  await page.fill('[name="name"]', 'John Doe');
  await page.fill('[name="email"]', 'john@example.com');
  await page.fill('[name="message"]', 'Test message');

  await page.click('button[type="submit"]');

  // For forms that redirect or show success message
  await expect(page.locator('.success-message')).toBeVisible();
});

test('navigation between pages', async ({ page }) => {
  await page.goto('/');

  await page.click('a[href="/services"]');
  await expect(page).toHaveURL('/services');

  await page.click('a[href="/about"]');
  await expect(page).toHaveURL('/about');
});

test('responsive navigation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  // Mobile menu should be hidden by default
  await expect(page.locator('#mobile-menu')).toBeHidden();

  // Click mobile menu button
  await page.click('#mobile-menu-button');
  await expect(page.locator('#mobile-menu')).toBeVisible();
});
```

## Performance Optimization Techniques

### Astro's Zero-JS by Default
Astro ships zero JavaScript by default. Only add client directives when needed:

```astro
<!-- Static - no JS shipped -->
<Header />

<!-- Hydrates immediately on page load -->
<MobileMenu client:load />

<!-- Hydrates when visible in viewport -->
<ContactForm client:visible />

<!-- Hydrates when browser is idle -->
<Newsletter client:idle />

<!-- Only hydrates on specific media query -->
<Sidebar client:media="(min-width: 768px)" />
```

### Image Optimization
```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image
  src={heroImage}
  alt="Hero image"
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="eager"
  format="webp"
/>
```

### Font Optimization
```astro
---
// In BaseLayout.astro head
---
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>

<style is:global>
  @font-face {
    font-family: 'Inter';
    font-display: swap;
  }
</style>
```

### Build Optimization
```javascript
// astro.config.mjs
export default defineConfig({
  build: {
    inlineStylesheets: 'auto', // Inline small stylesheets
  },
  compressHTML: true,
  vite: {
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor code if needed
          }
        }
      }
    }
  }
});
```

## Security Considerations

### Environment Security
```typescript
// src/utils/env.ts
const requiredEnvVars = ['SITE_URL'] as const;

export function validateEnv() {
  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

// Public env vars (prefixed with PUBLIC_)
export const config = {
  siteUrl: import.meta.env.SITE_URL || 'https://bluevex.com',
  gaId: import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID,
};
```

### Form Validation
```typescript
// src/utils/validation.ts
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export function validateContactForm(data: unknown): ContactFormData {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid form data');
  }

  const { name, email, company, message } = data as Record<string, unknown>;

  if (typeof name !== 'string' || name.trim().length < 2) {
    throw new Error('Name must be at least 2 characters');
  }

  if (typeof email !== 'string' || !isValidEmail(email)) {
    throw new Error('Invalid email address');
  }

  if (typeof message !== 'string' || message.trim().length < 10) {
    throw new Error('Message must be at least 10 characters');
  }

  return {
    name: sanitize(name.trim()),
    email: email.trim().toLowerCase(),
    company: typeof company === 'string' ? sanitize(company.trim()) : undefined,
    message: sanitize(message.trim()),
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

### Security Headers (via Vercel)
```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com"
        }
      ]
    }
  ]
}
```

## Monitoring and Analytics

### Google Analytics Integration
```astro
---
// src/components/Analytics.astro
const gaId = import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID;
---

{gaId && (
  <>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
    <script define:vars={{ gaId }}>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', gaId);
    </script>
  </>
)}
```

### Web Vitals Tracking
```astro
---
// Add to BaseLayout.astro
---
<script>
  import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

  function sendToAnalytics(metric) {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/vitals', body);
    }
  }

  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
</script>
```

### Error Tracking (Optional Sentry)
```bash
npx astro add @sentry/astro
```

```javascript
// astro.config.mjs
import sentry from '@sentry/astro';

export default defineConfig({
  integrations: [
    sentry({
      dsn: import.meta.env.SENTRY_DSN,
      sourceMapsUploadOptions: {
        project: 'bluevex-website',
        authToken: import.meta.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
});
```

## SEO Implementation

### SEO Component
```astro
---
// src/components/SEO.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
}

const {
  title,
  description,
  image = '/og-default.jpg',
  type = 'website',
  publishedTime
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const imageURL = new URL(image, Astro.site);
---

<!-- Primary Meta Tags -->
<title>{title} | BlueVex</title>
<meta name="title" content={`${title} | BlueVex`} />
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content={type} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={imageURL} />
<meta property="og:site_name" content="BlueVex" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content={canonicalURL} />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={imageURL} />

{publishedTime && (
  <meta property="article:published_time" content={publishedTime} />
)}
```

### Sitemap Generation
```bash
npx astro add sitemap
```

```javascript
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bluevex.com',
  integrations: [sitemap()],
});
```

### Robots.txt
```text
// public/robots.txt
User-agent: *
Allow: /

Sitemap: https://bluevex.com/sitemap-index.xml
```

This technical implementation guide provides a comprehensive foundation for building, deploying, and maintaining a high-performance, secure BlueVex website using Astro.
