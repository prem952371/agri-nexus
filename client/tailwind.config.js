/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        forest: {
          50: '#f0f7f0',
          100: '#dceede',
          200: '#bcdec0',
          300: '#8ec597',
          400: '#5da86b',
          500: '#3d8c4d',
          600: '#2d6f3c',
          700: '#265832',
          800: '#1e4428',  // Deep Forest Green
          900: '#183520',
          950: '#0c1d12',
        },
        agri: {
          green: '#1e7e34',
          light: '#f6fdf7',
          muted: '#6b8c72',
          border: '#d1e8d5',
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
