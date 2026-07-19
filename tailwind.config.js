/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        '_1710_': '1710px',
        '_1440_': '1445px',
      }
    },
  },
  plugins: [],
}
