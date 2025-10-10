// Build configuration for Frappe integration
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: '/assets/azab_shop_revive/dist/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'azab_shop_revive/public/dist',
    assetsDir: '',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'index.js',
        assetFileNames: 'index.css'
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
  }
});
