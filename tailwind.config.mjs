/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brand colors according to business_context.md
        primary: {
          DEFAULT: '#16264C',
          50: '#E8EBF1',
          100: '#D1D7E3',
          200: '#A3AFC7',
          300: '#7587AB',
          400: '#475F8F',
          500: '#16264C',
          600: '#121F3D',
          700: '#0E182E',
          800: '#0A111F',
          900: '#060A10',
        },
        secondary: {
          DEFAULT: '#2FA4D9',
          50: '#E6F5FB',
          100: '#CCEBF7',
          200: '#99D7EF',
          300: '#66C3E7',
          400: '#33AFDF',
          500: '#2FA4D9',
          600: '#2683AE',
          700: '#1C6282',
          800: '#134157',
          900: '#09212B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-delay-1': 'fadeIn 0.8s ease-out 0.2s forwards',
        'fade-in-delay-2': 'fadeIn 0.8s ease-out 0.4s forwards',
        'fade-in-delay-3': 'fadeIn 0.8s ease-out 0.6s forwards',
        'fade-in-delay-4': 'fadeIn 0.8s ease-out 0.8s forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-up-delay-1': 'slideUp 0.8s ease-out 0.2s forwards',
        'slide-up-delay-2': 'slideUp 0.8s ease-out 0.4s forwards',
        'slide-up-delay-3': 'slideUp 0.8s ease-out 0.6s forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'line-grow': 'lineGrow 1.5s ease-out forwards',
        'line-grow-delay': 'lineGrow 1.5s ease-out 0.5s forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        lineGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
}
