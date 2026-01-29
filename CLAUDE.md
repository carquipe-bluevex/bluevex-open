# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BlueVex is a technology consultancy website built with Astro, Tailwind CSS, and TypeScript. The project is currently in the documentation/planning phase with templates and specifications ready for implementation.

## Development Commands

```bash
# Create new Astro project (if starting fresh)
npm create astro@latest . -- --template basics --typescript strict --install

# Add integrations
npx astro add tailwind
npx astro add vercel

# Install dependencies
npm install

# Start development server (runs on localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Format code
npm run format
```

## Project Structure

```
bluevex-website/
├── public/                 # Static assets (images, icons, favicon)
├── src/
│   ├── components/
│   │   ├── ui/             # Base UI primitives (Button, Input, Card)
│   │   ├── layout/         # Header, Footer, Navigation
│   │   └── sections/       # Page sections (Hero, Services, About)
│   ├── layouts/            # Astro layouts (BaseLayout.astro)
│   ├── pages/              # Astro pages (file-based routing)
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── services/
│   │   └── contact.astro
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript definitions
│   └── config.ts           # Site configuration
├── docs/                   # Project documentation
├── templates/              # Component templates
├── astro.config.mjs        # Astro configuration
├── tailwind.config.mjs     # Tailwind configuration
└── tsconfig.json
```

## Architecture

### Astro Components vs React Components

- **`.astro` files**: Use for static content and layouts. No client-side JS by default.
- **`.tsx` files**: Use for interactive components that need client-side state.

Add `client:` directives to hydrate interactive components:
```astro
<!-- Only hydrate when visible -->
<ContactForm client:visible />

<!-- Hydrate on page load -->
<MobileMenu client:load />

<!-- Hydrate on idle -->
<Newsletter client:idle />
```

### Component Organization

- **ui/**: Reusable primitives with variant systems (Button, Card, Input)
- **layout/**: Site-wide structural components (Header, Footer)
- **sections/**: Full-width page sections (Hero, Services, About)

### Key Patterns

Use the `cn()` utility for merging Tailwind classes:
```typescript
import { cn } from '@/utils';
cn('base-classes', conditional && 'conditional-class', className)
```

### Path Aliases (tsconfig.json)

- `@/*` maps to `./src/*`
- `~/components/*` maps to `./src/components/*`
- `~/layouts/*` maps to `./src/layouts/*`
- `~/utils/*` maps to `./src/utils/*`

## Design System

### Brand Colors (defined in tailwind.config.mjs)

- **Primary (BlueVex Blue)**: `bluevex-500: #3b82f6`
- **Secondary (Teal)**: `teal-500: #14b8a6`
- **Neutrals**: Slate scale (`slate-50` through `slate-900`)

### Typography

- **Primary font**: Inter
- **Code font**: JetBrains Mono
- **Accent font**: Space Grotesk

### Spacing

Based on 4px grid system. Use Tailwind spacing utilities consistently.

## Technology Stack

- **Framework**: Astro (static site generation)
- **Styling**: Tailwind CSS with custom brand colors
- **Icons**: Lucide (or Astro Icon)
- **Forms**: TinyForm or native form handling
- **Deployment**: Vercel (using @astrojs/vercel adapter)

## Key Implementation Notes

- Astro outputs zero JS by default - only add `client:*` directives when interactivity is required
- Use `.astro` components for static content, React/Preact for interactive islands
- Follow mobile-first responsive design with breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Target WCAG 2.1 AA accessibility compliance (4.5:1 contrast ratio, keyboard navigation, ARIA labels)
- Core Web Vitals targets: LCP <2.5s, FID <100ms, CLS <0.1
- Development server runs on port 4321 by default
