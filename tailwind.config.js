/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          50: '#eef4fb',
          100: '#d9e7f5',
          200: '#b3cfea',
          300: '#85b0db',
          400: '#5289c8',
          500: '#2d67ad',
          600: '#1e4f8f',
          700: '#1e3a5f',
          800: '#183050',
          900: '#132642',
          950: '#0d1a2c',
        },
        accent: {
          50: '#fff3ee',
          100: '#ffe4d6',
          200: '#ffc5ad',
          300: '#ff9f7a',
          400: '#ff6b35',
          500: '#f8530f',
          600: '#e93a06',
          700: '#c22808',
          800: '#9a2210',
          900: '#7c1f11',
          950: '#430c06',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
        'nav': '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
};
