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
        subText: '#F4A261',
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
      },
    },
  },
  plugins: [],
}
