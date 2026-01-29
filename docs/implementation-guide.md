# BlueVex Implementation Guide for Claude Code

## Immediate Implementation Plan

This guide provides a step-by-step implementation plan for Claude Code to build the complete BlueVex website using **Astro**.

## Phase 1: Project Foundation

### 1.1 Initialize Astro Project
```bash
# Create new Astro project in the current directory
npm create astro@latest . -- --template basics --typescript strict --install

# Alternative: Create in subdirectory
npm create astro@latest bluevex-website -- --template basics --typescript strict --install
cd bluevex-website
```

### 1.2 Add Required Integrations
```bash
# Add Tailwind CSS
npx astro add tailwind

# Add Vercel adapter for deployment
npx astro add vercel

# Install additional dependencies
npm install clsx tailwind-merge lucide-react @tailwindcss/forms
```

### 1.3 Configure Project

**astro.config.mjs**
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: false }
  }),
  integrations: [tailwind()],
  site: 'https://bluevex.com',
});
```

**tsconfig.json**
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "~/components/*": ["./src/components/*"],
      "~/layouts/*": ["./src/layouts/*"],
      "~/utils/*": ["./src/utils/*"]
    }
  }
}
```

### 1.4 Basic Project Structure
```bash
mkdir -p src/components/{ui,layout,sections}
mkdir -p src/layouts src/styles src/utils src/types
mkdir -p public/images public/icons
```

## Phase 2: Design System Setup

### 2.1 Tailwind Configuration

**tailwind.config.mjs**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bluevex: {
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
        },
        teal: {
          500: '#14b8a6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
```

### 2.2 Global Styles

**src/styles/global.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply antialiased text-slate-900;
  }
}
```

### 2.3 Create Base Utilities

**src/utils/cn.ts**
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Phase 3: Base UI Components

### 3.1 Button Component

**src/components/ui/Button.astro**
```astro
---
import { cn } from '~/utils/cn';

interface Props {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  class?: string;
}

const { variant = 'primary', size = 'md', href, class: className } = Astro.props;

const variants = {
  primary: 'bg-bluevex-500 text-white hover:bg-bluevex-600',
  secondary: 'bg-white text-bluevex-500 border-2 border-bluevex-500 hover:bg-bluevex-50',
  tertiary: 'bg-transparent text-bluevex-500 hover:bg-bluevex-50',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-bluevex-500 focus:ring-offset-2';

const Element = href ? 'a' : 'button';
---

<Element
  href={href}
  class={cn(baseClasses, variants[variant], sizes[size], className)}
>
  <slot />
</Element>
```

### 3.2 Card Component

**src/components/ui/Card.astro**
```astro
---
import { cn } from '~/utils/cn';

interface Props {
  class?: string;
  hover?: boolean;
}

const { class: className, hover = false } = Astro.props;
---

<div class={cn(
  'rounded-lg border border-slate-200 bg-white p-6 shadow-sm',
  hover && 'hover:shadow-lg transition-shadow',
  className
)}>
  <slot />
</div>
```

## Phase 4: Layout Components

### 4.1 Base Layout

**src/layouts/BaseLayout.astro**
```astro
---
import '../styles/global.css';
import Header from '~/components/layout/Header.astro';
import Footer from '~/components/layout/Footer.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Transform your business with innovative technology solutions' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>{title} | BlueVex</title>
  </head>
  <body class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### 4.2 Header Component

**src/components/layout/Header.astro**
```astro
---
import Button from '~/components/ui/Button.astro';

const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

const currentPath = Astro.url.pathname;
---

<header class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
  <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <a href="/" class="flex items-center space-x-2">
        <div class="h-8 w-8 rounded bg-bluevex-500"></div>
        <span class="text-xl font-bold text-slate-900">BlueVex</span>
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex md:items-center md:space-x-8">
        {navigation.map((item) => (
          <a
            href={item.href}
            class={`font-medium transition-colors ${
              currentPath === item.href
                ? 'text-bluevex-600'
                : 'text-slate-600 hover:text-bluevex-600'
            }`}
          >
            {item.name}
          </a>
        ))}
        <Button variant="primary" size="sm" href="/contact">
          Get Quote
        </Button>
      </div>

      <!-- Mobile menu button -->
      <button
        id="mobile-menu-button"
        class="md:hidden text-slate-600 hover:text-slate-900"
        aria-label="Toggle menu"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div id="mobile-menu" class="hidden md:hidden">
      <div class="space-y-1 pb-3 pt-2">
        {navigation.map((item) => (
          <a
            href={item.href}
            class="block px-3 py-2 text-base font-medium text-slate-600 hover:text-bluevex-600 hover:bg-bluevex-50 rounded-md"
          >
            {item.name}
          </a>
        ))}
        <div class="px-3 py-2">
          <Button variant="primary" size="sm" href="/contact" class="w-full">
            Get Quote
          </Button>
        </div>
      </div>
    </div>
  </nav>
</header>

<script>
  const button = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');

  button?.addEventListener('click', () => {
    menu?.classList.toggle('hidden');
  });
</script>
```

### 4.3 Footer Component

**src/components/layout/Footer.astro**
```astro
---
const footerLinks = [
  {
    title: 'Services',
    links: [
      { name: 'Web Development', href: '/services/web-development' },
      { name: 'Mobile Apps', href: '/services/mobile-apps' },
      { name: 'Cloud Solutions', href: '/services/cloud' },
      { name: 'Consulting', href: '/services/consulting' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Team', href: '/team' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Case Studies', href: '/portfolio' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Support', href: '/support' },
    ],
  },
];
---

<footer class="bg-slate-900 text-white">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Company Info -->
      <div class="col-span-1">
        <div class="flex items-center space-x-2 mb-4">
          <div class="h-8 w-8 rounded bg-bluevex-500"></div>
          <span class="text-xl font-bold">BlueVex</span>
        </div>
        <p class="text-slate-400 text-sm mb-4">
          Transform your business with innovative technology solutions that drive growth and efficiency.
        </p>
      </div>

      <!-- Footer Links -->
      {footerLinks.map((section) => (
        <div>
          <h3 class="font-semibold text-white mb-4">{section.title}</h3>
          <ul class="space-y-2">
            {section.links.map((link) => (
              <li>
                <a
                  href={link.href}
                  class="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <!-- Copyright -->
    <div class="border-t border-slate-800 mt-8 pt-8 text-center">
      <p class="text-slate-400 text-sm">
        © {new Date().getFullYear()} BlueVex. All rights reserved.
      </p>
    </div>
  </div>
</footer>
```

## Phase 5: Page Sections

### 5.1 Hero Section

**src/components/sections/Hero.astro**
```astro
---
import Button from '~/components/ui/Button.astro';
---

<section class="relative bg-gradient-to-br from-bluevex-50 to-white py-20 sm:py-32">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
        Transform Your Business with
        <span class="text-bluevex-600"> Innovative Technology</span>
      </h1>

      <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        Expert software development, cloud architecture, and digital transformation services that drive measurable business growth and competitive advantage.
      </p>

      <div class="mt-10 flex items-center justify-center gap-x-6">
        <Button variant="primary" size="lg" href="/contact">
          Get Your Free Consultation
          <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
        <Button variant="secondary" size="lg" href="/portfolio">
          View Our Work
        </Button>
      </div>
    </div>
  </div>

  <!-- Background Pattern -->
  <div class="absolute inset-0 -z-10 overflow-hidden">
    <div class="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-bluevex-200 opacity-20 blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-200 opacity-20 blur-3xl"></div>
  </div>
</section>
```

### 5.2 Services Section

**src/components/sections/Services.astro**
```astro
---
import Card from '~/components/ui/Card.astro';
import Button from '~/components/ui/Button.astro';

const services = [
  {
    icon: 'code',
    title: 'Web Development',
    description: 'Custom web applications built with modern frameworks and best practices.',
    features: ['React/Astro', 'Node.js', 'API Development', 'E-commerce'],
  },
  {
    icon: 'smartphone',
    title: 'Mobile Applications',
    description: 'Native and cross-platform mobile apps for iOS and Android.',
    features: ['iOS & Android', 'React Native', 'Flutter', 'App Store'],
  },
  {
    icon: 'cloud',
    title: 'Cloud Solutions',
    description: 'Cloud migration, architecture, and optimization services.',
    features: ['AWS/Azure/GCP', 'DevOps', 'Microservices', 'Serverless'],
  },
  {
    icon: 'lightbulb',
    title: 'Digital Transformation',
    description: 'Strategic consulting to modernize your business processes.',
    features: ['Automation', 'Analytics', 'AI Integration', 'Strategy'],
  },
];
---

<section class="py-20 bg-white">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl">
        Comprehensive Technology Services
      </h2>
      <p class="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
        From concept to deployment, we deliver end-to-end solutions that scale with your business
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.map((service) => (
        <Card hover>
          <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-bluevex-100 text-bluevex-600 mb-4">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>

          <h3 class="text-lg font-semibold text-slate-900 mb-2">
            {service.title}
          </h3>

          <p class="text-slate-600 text-sm mb-4">
            {service.description}
          </p>

          <ul class="text-sm text-slate-500 space-y-1 mb-6">
            {service.features.map((feature) => (
              <li class="flex items-center">
                <div class="w-1 h-1 rounded-full bg-bluevex-500 mr-2"></div>
                {feature}
              </li>
            ))}
          </ul>

          <Button variant="tertiary" size="sm" href={`/services/${service.title.toLowerCase().replace(' ', '-')}`} class="w-full">
            Learn More
            <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </Card>
      ))}
    </div>
  </div>
</section>
```

## Phase 6: Pages

### 6.1 Homepage

**src/pages/index.astro**
```astro
---
import BaseLayout from '~/layouts/BaseLayout.astro';
import Hero from '~/components/sections/Hero.astro';
import Services from '~/components/sections/Services.astro';
---

<BaseLayout title="Expert Technology Consulting & Software Development">
  <Hero />
  <Services />
</BaseLayout>
```

### 6.2 About Page

**src/pages/about.astro**
```astro
---
import BaseLayout from '~/layouts/BaseLayout.astro';
import Card from '~/components/ui/Card.astro';

const stats = [
  { value: '10+', label: 'Years Experience' },
  { value: '200+', label: 'Projects Delivered' },
  { value: '50+', label: 'Expert Developers' },
  { value: '98%', label: 'Client Satisfaction' },
];
---

<BaseLayout title="About Us" description="Learn about BlueVex's mission, values, and team.">
  <section class="py-20 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-slate-900 text-center mb-8">
        About BlueVex
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl font-semibold text-slate-900 mb-4">
            Our Mission
          </h2>
          <p class="text-lg text-slate-600 mb-6">
            To empower businesses with innovative technology solutions that drive growth, enhance efficiency, and create lasting competitive advantages in the digital age.
          </p>

          <h2 class="text-3xl font-semibold text-slate-900 mb-4">
            Our Values
          </h2>
          <ul class="space-y-3 text-slate-600">
            <li>• Innovation Excellence</li>
            <li>• Client-Centric Approach</li>
            <li>• Technical Mastery</li>
            <li>• Integrity & Transparency</li>
            <li>• Collaborative Spirit</li>
          </ul>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((stat) => (
            <Card class="text-center">
              <div class="text-3xl font-bold text-bluevex-600 mb-2">{stat.value}</div>
              <div class="text-slate-600">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </section>
</BaseLayout>
```

### 6.3 Contact Page

**src/pages/contact.astro**
```astro
---
import BaseLayout from '~/layouts/BaseLayout.astro';
import Card from '~/components/ui/Card.astro';
import Button from '~/components/ui/Button.astro';
---

<BaseLayout title="Contact Us" description="Get in touch with BlueVex for your technology needs.">
  <section class="py-20 bg-slate-50">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-slate-900 mb-4">
          Get In Touch
        </h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          Ready to transform your business? Let's discuss your project.
        </p>
      </div>

      <div class="max-w-2xl mx-auto">
        <Card>
          <form action="https://tinyform.com/submit/bluevex-form" method="POST" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-slate-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-bluevex-500 focus:border-bluevex-500 outline-none"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-bluevex-500 focus:border-bluevex-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label for="company" class="block text-sm font-medium text-slate-700 mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-bluevex-500 focus:border-bluevex-500 outline-none"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-slate-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows="6"
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-bluevex-500 focus:border-bluevex-500 outline-none resize-none"
              ></textarea>
            </div>

            <Button variant="primary" size="lg" class="w-full">
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  </section>
</BaseLayout>
```

## Phase 7: Interactive Components (React Islands)

For components that need client-side interactivity, use React with Astro's island architecture.

### 7.1 Add React Integration
```bash
npx astro add react
```

### 7.2 Interactive Contact Form (React)

**src/components/features/ContactForm.tsx**
```tsx
import { useState } from 'react';
import { cn } from '../../utils/cn';

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to your form handler
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-green-600 text-xl font-semibold mb-4">
          Thank you for your message!
        </div>
        <p className="text-slate-600">We'll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields here */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full px-8 py-4 text-lg bg-bluevex-500 text-white rounded-lg font-medium',
          'hover:bg-bluevex-600 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-bluevex-500 focus:ring-offset-2',
          isSubmitting && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

### 7.3 Using React Component in Astro

**src/pages/contact-interactive.astro**
```astro
---
import BaseLayout from '~/layouts/BaseLayout.astro';
import { ContactForm } from '~/components/features/ContactForm';
---

<BaseLayout title="Contact Us">
  <section class="py-20">
    <div class="max-w-2xl mx-auto px-4">
      <!-- Hydrate when component becomes visible -->
      <ContactForm client:visible />
    </div>
  </section>
</BaseLayout>
```

## Phase 8: SEO and Performance

### 8.1 SEO Component

**src/components/SEO.astro**
```astro
---
interface Props {
  title: string;
  description: string;
  image?: string;
  canonicalURL?: string;
}

const { title, description, image = '/og-image.jpg', canonicalURL } = Astro.props;
const siteURL = Astro.site || 'https://bluevex.com';
const fullURL = canonicalURL || Astro.url.href;
---

<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={fullURL} />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content={fullURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image, siteURL)} />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={new URL(image, siteURL)} />
```

## Implementation Checklist

### Week 1: Foundation
- [ ] Project setup with Astro
- [ ] Tailwind configuration with brand colors
- [ ] Base UI components (Button, Card, Input)
- [ ] Layout components (Header, Footer)

### Week 2: Content & Pages
- [ ] Page sections (Hero, Services, About)
- [ ] All main pages (Home, About, Services, Contact)
- [ ] Responsive design testing
- [ ] Contact form integration

### Week 3: Optimization & Launch
- [ ] SEO implementation
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Production deployment to Vercel

## Essential Documentation References

During implementation, reference:
- [Brand Guidelines](./brand/README.md) - Colors, typography, design principles
- [Component Architecture](./architecture/README.md) - Component patterns
- [Setup Guide](./setup/README.md) - Development environment setup
