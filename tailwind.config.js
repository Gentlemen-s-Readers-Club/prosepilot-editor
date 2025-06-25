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
          primary: '#3E4C59',
          secondary: '#DCE2E9',
          accent: '#B08F6A',
          neutral: '#B0B8C5',
        },
        base: {
          background: '#F8F9FA',
          heading: '#3E4C59',
          paragraph: '#616161',
          border: '#E3E7ED',
        },
        state: {
          success: {
            DEFAULT: '#2D5A2B',
            light: '#E8F5E8',
          },
          error: {
            DEFAULT: '#C53030',
            light: '#FEF2F2',
          },
          warning: {
            DEFAULT: '#B45309',
            light: '#FEF7E0',
          },
          info: {
            DEFAULT: '#2C5282',
            light: '#E8F2F8',
          },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}