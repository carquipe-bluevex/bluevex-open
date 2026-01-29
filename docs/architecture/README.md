# BlueVex Component Architecture

## Component Hierarchy & Structure

### Directory Structure
```
components/
├── ui/                    # Basic UI primitives
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Badge/
│   ├── Modal/
│   ├── Dropdown/
│   └── index.ts
├── layout/               # Layout components
│   ├── Header/
│   ├── Footer/
│   ├── Navigation/
│   ├── Sidebar/
│   └── index.ts
├── sections/             # Page-specific sections
│   ├── Hero/
│   ├── Services/
│   ├── About/
│   ├── Testimonials/
│   ├── Contact/
│   └── index.ts
├── features/             # Complex feature components
│   ├── ContactForm/
│   ├── ServiceCards/
│   ├── BlogPosts/
│   └── index.ts
└── common/               # Shared components
    ├── BackgroundPattern/
    ├── GradientText/
    ├── ScrollReveal/
    └── index.ts
```

## Component Naming Conventions

### File Naming
- **PascalCase** for component files: `Button.tsx`
- **kebab-case** for directories when needed: `contact-form/`
- **index.ts** files for clean imports

### Component Naming
- **Components**: PascalCase (`Button`, `ServiceCard`)
- **Props Interfaces**: `ComponentNameProps` (`ButtonProps`)
- **Utilities**: camelCase (`formatDate`, `isValidEmail`)

## Base UI Components

### Button Component
```typescript
// components/ui/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  as?: 'button' | 'a' | React.ElementType;
}

const variants = {
  primary: 'bg-bluevex-500 text-white hover:bg-bluevex-600',
  secondary: 'bg-white text-bluevex-500 border-2 border-bluevex-500 hover:bg-bluevex-50',
  tertiary: 'bg-transparent text-bluevex-500 hover:bg-bluevex-50',
  ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
};
```

### Card Component
```typescript
// components/ui/Card/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  border?: boolean;
}

const paddingVariants = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

const baseClasses = 'bg-white rounded-lg shadow-sm border border-slate-200';
const hoverClasses = 'hover:shadow-md hover:scale-[1.02] transition-all duration-200';
```

### Input Component
```typescript
// components/ui/Input/Input.tsx
interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  error?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const baseClasses = 'w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-bluevex-500 focus:border-bluevex-500 outline-none transition-colors';
const errorClasses = 'border-error-500 focus:ring-error-500';
```

## Layout Components

### Header Component
```typescript
// components/layout/Header/Header.tsx
interface HeaderProps {
  transparent?: boolean;
  sticky?: boolean;
  showContact?: boolean;
}

interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
  children?: NavigationItem[];
}

interface HeaderProps {
  navigation: NavigationItem[];
  cta?: {
    text: string;
    href: string;
  };
}
```

### Footer Component
```typescript
// components/layout/Footer/Footer.tsx
interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  sections: FooterSection[];
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  copyright?: string;
}
```

## Page Section Components

### Hero Section
```typescript
// components/sections/Hero/Hero.tsx
interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  background?: 'gradient' | 'pattern' | 'image';
  image?: string;
  variant?: 'centered' | 'left' | 'right';
}
```

### Services Section
```typescript
// components/sections/Services/Services.tsx
interface Service {
  icon: string; // Lucide icon name
  title: string;
  description: string;
  features: string[];
  link?: string;
}

interface ServicesProps {
  title: string;
  subtitle?: string;
  services: Service[];
  variant?: 'grid' | 'list' | 'carousel';
}
```

### Testimonials Section
```typescript
// components/sections/Testimonials/Testimonials.tsx
interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
  rating?: number; // 1-5
}

interface TestimonialsProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
  showRating?: boolean;
}
```

## Feature Components

### Contact Form Component
```typescript
// components/features/ContactForm/ContactForm.tsx
interface ContactFormProps {
  title?: string;
  subtitle?: string;
  fields: {
    name: {
      label: string;
      required: boolean;
      type: 'text';
    };
    email: {
      label: string;
      required: boolean;
      type: 'email';
    };
    company?: {
      label: string;
      required: boolean;
      type: 'text';
    };
    message: {
      label: string;
      required: boolean;
      type: 'textarea';
    };
  };
  submitText?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}
```

### Service Cards Component
```typescript
// components/features/ServiceCards/ServiceCards.tsx
interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  pricing?: {
    type: 'contact' | 'starting-at';
    value?: string;
  };
  cta?: {
    text: string;
    href: string;
  };
}

interface ServiceCardsProps {
  services: ServiceCard[];
  layout: 'grid' | 'carousel';
  showPricing?: boolean;
}
```

## Utility Functions

### cn() - Class Name Utility
```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Animation Utilities
```typescript
// lib/animations.ts
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

### Form Validation
```typescript
// lib/validation.ts
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean | string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export const validateField = (value: string, rules: ValidationRule): string | null => {
  if (rules.required && !value.trim()) {
    return 'This field is required';
  }
  
  if (rules.minLength && value.length < rules.minLength) {
    return `Minimum ${rules.minLength} characters required`;
  }
  
  if (rules.maxLength && value.length > rules.maxLength) {
    return `Maximum ${rules.maxLength} characters allowed`;
  }
  
  if (rules.pattern && !rules.pattern.test(value)) {
    return 'Invalid format';
  }
  
  if (rules.custom) {
    const result = rules.custom(value);
    if (typeof result === 'string') return result;
    if (!result) return 'Invalid value';
  }
  
  return null;
};
```

## State Management Approach

### React Context for Global State
```typescript
// context/AppContext.tsx
interface AppState {
  theme: 'light' | 'dark';
  navigation: {
    isOpen: boolean;
    activeSection: string;
  };
  contact: {
    isSubmitting: boolean;
    message: string | null;
  };
}

interface AppContextType {
  state: AppState;
  actions: {
    setTheme: (theme: 'light' | 'dark') => void;
    toggleNavigation: () => void;
    setActiveSection: (section: string) => void;
    setContactSubmitting: (isSubmitting: boolean) => void;
    setContactMessage: (message: string | null) => void;
  };
}
```

### Local State with useState/useReducer
```typescript
// For component-specific state
const [formData, setFormData] = useState<FormData>({});
const [errors, setErrors] = useState<ValidationErrors>({});

// For complex state logic
const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SUBMIT':
      return { ...state, isSubmitting: true };
    default:
      return state;
  }
};
```

## Props Interfaces Summary

### Common Interface Patterns
```typescript
// Base component props
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'aria-label'?: string;
}

// Interactive elements
interface InteractiveProps extends BaseComponentProps {
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
  loading?: boolean;
}

// Form elements
interface FormFieldProps extends BaseComponentProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
}

// Content sections
interface SectionProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  description?: string;
}
```

## Component Best Practices

### 1. Composition over Inheritance
- Build small, focused components
- Combine components for complex UIs
- Use children prop for flexible content

### 2. Props Design
- Keep props minimal and focused
- Use proper TypeScript types
- Provide sensible defaults

### 3. Styling Approach
- Use Tailwind for styling
- Create variant systems
- Maintain consistency with design tokens

### 4. Accessibility
- Include proper ARIA attributes
- Support keyboard navigation
- Ensure color contrast compliance

### 5. Performance
- Use React.memo for expensive components
- Implement proper key props for lists
- Lazy load heavy components when needed

## Implementation Order

1. **Base UI Components** (Button, Input, Card, Badge)
2. **Layout Components** (Header, Footer, Navigation)
3. **Utility Functions** (cn, validation, animations)
4. **Page Section Components** (Hero, Services, About)
5. **Feature Components** (ContactForm, ServiceCards)
6. **State Management Setup** (Context, reducers)
7. **Page Assembly** (Combine all components)

This architecture ensures maintainable, scalable, and consistent component development for the BlueVex website.