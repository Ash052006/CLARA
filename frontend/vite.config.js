import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backend = process.env.VITE_BACKEND_URL || "http://127.0.0.1:8001";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    strictPort: true,
    proxy: {
      "/chat": backend,
      "/voice": backend,
      "/health": backend,
    },
  },
});
