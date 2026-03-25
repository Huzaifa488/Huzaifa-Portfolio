import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        surface: {
          light: '#ffffff',
          muted:  '#f8fafc',
          border: '#e2e8f0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        elevated:   '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        glow:       '0 0 30px rgba(59, 130, 246, 0.4)',
        'glow-lg':  '0 0 60px rgba(59, 130, 246, 0.3)',
      },
      animation: {
        /* existing */
        'fade-in':       'fadeIn 0.4s ease-in-out',
        'slide-up':      'slideUp 0.5s ease-out both',
        'slide-in-left': 'slideInLeft 0.5s ease-out both',
        'pulse-slow':    'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        /* new */
        'float':         'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 1.5s infinite',
        'float-slow':    'float 8s ease-in-out 0.75s infinite',
        'spin-slow':     'spin 10s linear infinite',
        'spin-reverse':  'spinReverse 16s linear infinite',
        'spin-very-slow':'spinReverse 24s linear infinite',
        'glow-pulse':    'glowPulse 2.5s ease-in-out infinite alternate',
        'gradient-x':    'gradientX 5s ease infinite',
        'blink':         'blink 0.8s step-end infinite',
        'scale-in':      'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
        'slide-up-fade': 'slideUpFade 0.6s ease-out both',
        'shimmer':       'shimmer 2.5s linear infinite',
        'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
        'wiggle':        'wiggle 1s ease-in-out infinite',
        'logo-glow':     'logoGlow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-14px)' },
        },
        spinReverse: {
          '0%':   { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        glowPulse: {
          '0%':   { boxShadow: '0 0 20px rgba(59,130,246,0.25), 0 0 40px rgba(124,58,237,0.10)' },
          '100%': { boxShadow: '0 0 40px rgba(59,130,246,0.55), 0 0 80px rgba(124,58,237,0.25)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUpFade: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%':      { transform: 'rotate(6deg)' },
        },
        logoGlow: {
          '0%':   { opacity: '0.3', transform: 'scale(0.95)' },
          '100%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
