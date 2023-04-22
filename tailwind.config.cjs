/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts}', './index.html'],
  theme: {
    extend: {
      fontFamily: {
        humane: ['Humane', 'arial', 'sans-serif'],
        flaviotte: ['Flaviotte', 'sans-serif'],
        fahkwang: ['Fahkwang', 'sans-serif'],
        neueMetanaNext: ['NeueMetanaNext', 'sans-serif'],
      },
      colors: {
        primary: '#F4A261',
        background: '#1C1C1C',
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'spin-3': 'spin 3s linear infinite',
        'spin-10': 'spin 10s linear infinite',
        'spin-20': 'spin 20s linear infinite',
      },
      gradientColorStopPositions: {
        '1%': '1%',
      },
    },
  },
  plugins: [],
}
