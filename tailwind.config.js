/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3E4C59',     // deep slate blue – refined and serious
          secondary: '#DCE2E9',   // cool pale gray – soft and elegant
          accent: '#B08F6A',      // darker muted gold – classic elegance for highlights
          neutral: '#B0B8C5',     // gentle steel – subtle UI tone
        },
        base: {
          background: '#F8F9FA',  // very soft off-white – sophisticated canvas
          heading: '#3E4C59',     // near-black – clear and classic
          paragraph: '#5F6C7B',   // elegant gray-blue – excellent for reading
          border: '#E3E7ED',      // refined light border tone
        },
        state: {
          success: '#6B9A6F',     // deeper forest green – calm and professional
          error: '#C53030',       // refined burgundy – sophisticated alert tone
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}