/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
      },
      colors: {
        darkBg: '#0C0C0C',
        textLight: '#D7E2EA',
        zomatoRed: '#E23744',
        zomatoDarkRed: '#900C1D',
      },
    },
  },
  plugins: [],
}
