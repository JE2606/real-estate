/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: {
          100: '#c21d03',
          200: '#fd5732',
          300: '#ffb787',
        },
      }
    },
  },
  plugins: [],
}