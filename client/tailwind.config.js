/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#070A0F',
        surface: {
          DEFAULT: '#0D131F',
          light: '#131B2C',
          glass: 'rgba(13, 19, 31, 0.75)',
        },
        primary: {
          DEFAULT: '#00F5D4',
          hover: '#00D8BC',
          glow: 'rgba(0, 245, 212, 0.45)',
        },
        secondary: {
          DEFAULT: '#A855F7',
          hover: '#9333EA',
          glow: 'rgba(168, 85, 247, 0.45)',
        },
        accent: {
          cyan: '#00C2FF',
          purple: '#7928CA',
          pink: '#FF0080',
          blue: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 245, 212, 0.5)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.5)',
        'glow-card': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'glass-hover': '0 10px 40px -10px rgba(0, 245, 212, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        },
      }
    },
  },
  plugins: [],
}
