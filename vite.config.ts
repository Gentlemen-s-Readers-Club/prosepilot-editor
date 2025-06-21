import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    allowedHosts: ["intimate-katydid-equally.ngrok-free.app"],
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  define: {
    __ENABLE_USERCENTRICS__: JSON.stringify(mode === 'production'),
  },
}));
