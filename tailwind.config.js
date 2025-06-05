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
        accent: '#0093D1',
        action: '#FF4D4D',
        topbar: '#F2FBFE',
        bookinfo: '#379EC4',
        textblue: '#2F616D',
        textsecondary: '#5D9CAB',
        highlight: '#FFD45C',
        card: '#FFFFFF',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#2F616D',
            h1: {
              color: '#2F616D',
            },
            h2: {
              color: '#2F616D',
            },
            h3: {
              color: '#2F616D',
            },
            h4: {
              color: '#2F616D',
            },
            h5: {
              color: '#2F616D',
            },
            h6: {
              color: '#2F616D',
            },
            strong: {
              color: '#2F616D',
            },
            blockquote: {
              color: '#2F616D',
              borderLeftColor: '#0093D1',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}