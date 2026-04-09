/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        royal: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#4169e1',   // Royal Blue
          600: '#2752d8',
          700: '#1e3faf',
          800: '#1e3080',
          900: '#1a2563',
          950: '#0f1540',
        },
        navy: {
          50:  '#f0f4ff',
          100: '#dce6ff',
          200: '#b8ccff',
          300: '#82a9ff',
          400: '#4d80ff',
          500: '#1a56db',
          600: '#1245b8',
          700: '#0e3590',
          800: '#0b2868',
          900: '#071a47',
          950: '#040f2e',
        },
        slate: {
          lms: '#8fa3bf',       // Soft Blue-Grey
          light: '#c8d6e5',
          muted: '#b0c0d4',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d4a017',   // Rich Gold
          600: '#b8860b',
          700: '#9a7209',
          800: '#7c5c07',
          900: '#5e4606',
        },
        surface: {
          DEFAULT: '#f4f7fc',
          card:    '#ffffff',
          dark:    '#0f1540',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        royal: '0 4px 24px rgba(65, 105, 225, 0.18)',
        'royal-lg': '0 8px 40px rgba(65, 105, 225, 0.25)',
        gold:  '0 4px 20px rgba(212, 160, 23, 0.25)',
        card:  '0 2px 16px rgba(10, 30, 80, 0.08)',
        'card-hover': '0 8px 32px rgba(10, 30, 80, 0.14)',
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #1a2563 0%, #4169e1 100%)',
        'gold-gradient':  'linear-gradient(135deg, #d4a017 0%, #fbbf24 100%)',
        'hero-pattern':   'radial-gradient(ellipse at 70% 50%, rgba(65,105,225,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(212,160,23,0.08) 0%, transparent 50%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGold: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [],
}
