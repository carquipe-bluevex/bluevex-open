# BlueVex Website - Project Setup Guide

## Overview
This guide provides step-by-step instructions for setting up the BlueVex website development environment using **Astro** framework.

## Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git
- Modern IDE (VS Code recommended)

## Installation Commands

### 1. Create New Astro Project
```bash
# Create new Astro project in the current directory
npm create astro@latest . -- --template basics --typescript strict --install

# Alternative: Create in subdirectory
npm create astro@latest bluevex-website -- --template basics --typescript strict --install
cd bluevex-website
```

### 2. Add Required Integrations
```bash
# Add Tailwind CSS
npx astro add tailwind

# Add Vercel adapter for deployment
npx astro add vercel

# Install additional dependencies
npm install @tailwindcss/forms @astrojs/ts-config
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

## Configuration File Templates

### .env.example
```env
# Site Configuration
SITE_URL=https://bluevex.com
SITE_NAME=BlueVex
SITE_DESCRIPTION=Technology consultancy services including IT maintenance, software development, and license selling

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VERCEL_ANALYTICS_ID=your-vercel-analytics-id

# Contact Form
TINYFORM_URL=https://tinyform.com/submit/bluevex-form
EMAIL_CONTACT=contact@bluevex.com

# Sanity CMS (Future use)
SANITY_PROJECT_ID=your-sanity-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
```

### astro.config.mjs Template
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel({
    experimentalStaticHeaders: true,
    webAnalytics: {
      enabled: false
    }
  }),
  integrations: [tailwind()],
  site: import.meta.env.SITE_URL || 'https://bluevex.com',
  vite: {
    optimizeDeps: {
      exclude: ['playwright']
    }
  }
});
```

### tsconfig.json Template
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "~/components/*": ["./src/components/*"],
      "~/layouts/*": ["./src/layouts/*"],
      "~/utils/*": ["./src/utils/*"],
      "~/types/*": ["./src/types/*"]
    },
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

### tailwind.config.mjs Template
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bluevex: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

## Development Environment Setup

### 1. VS Code Extensions Recommended
```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### 2. VS Code Settings (.vscode/settings.json)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.astro": "astro"
  },
  "emmet.includeLanguages": {
    "astro": "html"
  }
}
```

### 3. Prettier Configuration (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-astro"]
}
```

### 4. Package.json Scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write ."
  }
}
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run type checking
npm run type-check

# Format code
npm run format
```

## Project Structure Best Practices

```
bluevex-website/
├── public/                 # Static assets
│   ├── favicon.svg
│   ├── images/
│   │   ├── logo.svg
│   │   └── hero-bg.jpg
│   └── icons/
├── src/
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   ├── layout/        # Layout components
│   │   └── sections/      # Page sections
│   ├── layouts/           # Astro layouts
│   ├── pages/             # Astro pages
│   ├── styles/            # Global styles
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript definitions
│   └── config.ts          # Site configuration
├── docs/                  # Project documentation
├── astro.config.mjs       # Astro configuration
├── package.json
├── tsconfig.json
├── tailwind.config.mjs
└── postcss.config.mjs
```

## Getting Started Checklist

- [ ] Install Node.js 18+
- [ ] Create Astro project with `npm create astro@latest`
- [ ] Add Tailwind CSS with `npx astro add tailwind`
- [ ] Add Vercel adapter with `npx astro add vercel`
- [ ] Install additional dependencies
- [ ] Set up environment variables
- [ ] Configure VS Code with extensions
- [ ] Run development server with `npm run dev`
- [ ] Verify all pages load correctly
- [ ] Test build process with `npm run build`

## Troubleshooting

### Common Issues
1. **Port 4321 already in use**: Kill process or change port
   ```bash
   lsof -ti:4321 | xargs kill -9
   npm run dev -- --port 3001
   ```

2. **Tailwind classes not working**: Ensure proper configuration
   ```bash
   # Check tailwind.config.mjs and postcss.config.mjs
   # Verify @tailwind directives in CSS
   ```

3. **TypeScript errors**: Run type check
   ```bash
   npm run type-check
   ```

4. **Build fails**: Check for missing imports or syntax errors
   ```bash
   npm run build --verbose
   ```

## Next Steps
- Review [Brand Guidelines](../brand/README.md)
- Check [Component Architecture](../architecture/README.md)
- Follow [Content Strategy](../content/README.md)