/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#EBFAFD',
        primary: '#2D5F6E',
        secondary: '#4E4E4E',
        accent: '#4F9EBC',
        card: '#FFFFFF',
        border: '#E0E0E0',
        danger: '#DC2626',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}