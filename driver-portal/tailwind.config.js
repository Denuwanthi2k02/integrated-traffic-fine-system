/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We add the Sri Lanka Police brand colors here
        'police-blue': '#003366',
        'police-yellow': '#FFCC00',
      },
    },
  },
  plugins: [],
}