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
          paragraph: '#4A5568',   // elegant gray-blue – excellent for reading
          border: '#E3E7ED',      // refined light border tone
        },
        state: {
          success: {
            DEFAULT: '#2D5A2B',     // darker forest green – better contrast for readability
            light: '#E8F5E8', // lighter green – softer and more subtle
          },
          error: {
            DEFAULT: '#C53030',       // refined burgundy – sophisticated alert tone
            light: '#FEE4E2', // light red – clear, calm and professional
          },
          warning: {
            DEFAULT: '#B45309',       // darker amber – refined and sophisticated
            light: '#FEF7E0',         // lighter yellow – warm and noticeable
          },
          info: {
            DEFAULT: '#2C5282',       // sophisticated navy blue – refined and elegant
            light: '#E8F2F8',         // elegant light blue – sophisticated and professional
          },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}