import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      // Flask API
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },

      // React login -> Flask login
      "/backend-login": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/backend-login/, "/login"),
      },

      // Flask logout
      "/logout": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
});