/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#F0EFFF',
          100: '#E0DDFF',
          200: '#C7C0FF',
          300: '#A399FF',
          400: '#8B85C1',
          500: '#5B4FCF',
          600: '#4A3FB5',
          700: '#3A2F9B',
          800: '#2B2081',
          900: '#1E1567',
        },
        accent: {
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFC9C9',
          300: '#FFA8A8',
          400: '#FF8787',
          500: '#FF6B6B',
          600: '#FF5252',
          700: '#F44336',
          800: '#E53E3E',
          900: '#C53030',
        },
        surface: '#FFFFFF',
        background: '#F7F9FC',
      },
    },
  },
  plugins: [],
}