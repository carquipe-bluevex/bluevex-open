# BlueVex Brand Guidelines

## Overview
BlueVex is a premium technology consultancy specializing in innovative software solutions, digital transformation, and strategic technology consulting.

## Color Scheme

### Primary Colors
```css
/* Primary Blue - Tech & Trust */
--bluevex-50: #eff6ff;
--bluevex-100: #dbeafe;
--bluevex-200: #bfdbfe;
--bluevex-300: #93c5fd;
--bluevex-400: #60a5fa;
--bluevex-500: #3b82f6;  /* Primary Brand Color */
--bluevex-600: #2563eb;
--bluevex-700: #1d4ed8;
--bluevex-800: #1e40af;
--bluevex-900: #1e3a8a;
```

### Secondary Colors
```css
/* Accent Teal - Innovation */
--teal-50: #f0fdfa;
--teal-100: #ccfbf1;
--teal-200: #99f6e4;
--teal-300: #5eead4;
--teal-400: #2dd4bf;
--teal-500: #14b8a6;  /* Secondary Accent */
--teal-600: #0d9488;
--teal-700: #0f766e;
--teal-800: #115e59;
--teal-900: #134e4a;

/* Neutral Grays - Professional */
--slate-50: #f8fafc;
--slate-100: #f1f5f9;
--slate-200: #e2e8f0;
--slate-300: #cbd5e1;
--slate-400: #94a3b8;
--slate-500: #64748b;
--slate-600: #475569;
--slate-700: #334155;
--slate-800: #1e293b;
--slate-900: #0f172a;
```

### Semantic Colors
```css
/* Success */
--success-500: #10b981;
--success-600: #059669;

/* Warning */
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error */
--error-500: #ef4444;
--error-600: #dc2626;

/* Info */
--info-500: #06b6d4;
--info-600: #0891b2;
```

## Typography

### Font Families
```css
/* Primary - Modern & Clean */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Secondary - Tech & Code */
--font-secondary: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

/* Accent - Premium */
--font-accent: 'Space Grotesk', 'Inter', sans-serif;
```

### Typography Scale
```css
/* Headings */
--text-4xl: 2.25rem;    /* 36px - Hero Title */
--text-3xl: 1.875rem;  /* 30px - Section Title */
--text-2xl: 1.5rem;    /* 24px - Subsection Title */
--text-xl: 1.25rem;    /* 20px - Card Title */
--text-lg: 1.125rem;   /* 18px - Large Body */

/* Body Text */
--text-base: 1rem;     /* 16px - Normal Body */
--text-sm: 0.875rem;   /* 14px - Small Body */
--text-xs: 0.75rem;    /* 12px - Caption */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Typography Usage
- **H1**: `font-bold text-4xl text-slate-900` - Main page titles
- **H2**: `font-semibold text-3xl text-slate-800` - Section headers
- **H3**: `font-semibold text-2xl text-slate-700` - Subsection headers
- **H4**: `font-medium text-xl text-slate-700` - Card titles
- **Body**: `font-normal text-base text-slate-600` - Regular content
- **Caption**: `font-normal text-sm text-slate-500` - Meta information

## Logo Usage Guidelines

### Logo Variations
1. **Primary Logo**: Full color (BlueVex text + icon)
2. **Monochrome**: Single color for limited color applications
3. **Icon-only**: Symbol version for small spaces
4. **Wordmark**: Text-only version

### Clear Space Requirements
- Minimum clear space = height of the "X" in BlueVex
- No other elements should intrude into this space

### Minimum Size
- Digital: 120px width minimum
- Print: 0.5" width minimum

### Logo Colors
- Primary: BlueVex-500 (#3b82f6) for text
- Accent: Teal-500 (#14b8a6) for icon elements
- Monochrome: Slate-800 (#1e293b) or white for dark backgrounds

### Logo Misuse (Do Not)
- Stretch or distort proportions
- Change colors (except approved variations)
- Add drop shadows or effects
- Place on busy backgrounds
- Rotate or angle the logo
- Use low-resolution versions

## Design Principles for Tech Consultancy

### 1. Professional Excellence
- Clean, minimalist aesthetic
- Consistent spacing and alignment
- High-quality imagery and graphics
- Attention to detail in all elements

### 2. Technical Precision
- Clear information hierarchy
- Logical content organization
- Consistent component patterns
- Semantic HTML structure

### 3. Innovation Forward
- Modern, cutting-edge design
- Subtle animations and interactions
- Progressive enhancement
- Future-proof technology choices

### 4. Trust & Reliability
- Stable, consistent visual language
- Clear, accessible typography
- Predictable user interactions
- Professional color palette

## Visual Elements

### Iconography
- Style: Outline, minimalist
- Size: 16px, 20px, 24px, 32px standard
- Color: Slate-600 (#475569) default, BlueVex-500 for active states

### Imagery Guidelines
- **Style**: Professional tech imagery, abstract patterns
- **Content**: Technology concepts, team collaboration, clean interfaces
- **Treatment**: Subtle gradients, soft shadows, professional lighting
- **Tone**: Modern, innovative, trustworthy

### Data Visualization
- **Charts**: Clean, minimal design with brand colors
- **Graphs**: BlueVex primary with Teal accents
- **Infographics**: Consistent icon style and color usage

## Layout Principles

### Grid System
- **Base Grid**: 12-column responsive grid
- **Container Max Width**: 1200px
- **Gutters**: 24px (mobile), 32px (tablet), 48px (desktop)

### Spacing Scale
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

## Component Guidelines

### Buttons
- **Primary**: BlueVex-500 background, white text
- **Secondary**: White background, BlueVex-500 border and text
- **Tertiary**: Transparent background, BlueVex-500 text
- **Size**: Small (32px), Medium (40px), Large (48px) height

### Cards
- **Background**: White with subtle shadow
- **Border**: 1px solid Slate-200
- **Border Radius**: 8px
- **Padding**: 24px

### Forms
- **Input Fields**: White background, Slate-300 border, Slate-700 text
- **Labels**: Slate-700, font-medium, text-sm
- **Focus State**: BlueVex-500 border, subtle shadow

## Animation & Micro-interactions

### Timing
- **Fast**: 150ms (hover states)
- **Normal**: 250ms (transitions)
- **Slow**: 350ms (page transitions)

### Easing
- **Ease-out**: Most transitions
- **Ease-in-out**: Complex animations
- **Custom**: Cubic-bezier for brand-specific movements

### Motion Principles
- Purposeful and meaningful
- Subtle, not distracting
- Consistent timing throughout
- Respect user preferences (reduced motion)

## Implementation Notes

### CSS Custom Properties
All brand values should be defined as CSS custom properties for consistency and easy maintenance.

### Component Library
Create a Storybook or similar component library to ensure consistent implementation across the project.

### Design Tokens
Use design tokens for all values to maintain consistency and enable easy theme switching.

### Accessibility
- WCAG AA compliance minimum
- 4.5:1 contrast ratio for normal text
- Focus states clearly visible
- Semantic HTML structure