import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import netlifyPlugin from '@netlify/vite-plugin-react-router'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), netlifyPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
