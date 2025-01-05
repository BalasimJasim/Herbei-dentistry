import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
    postcss: "./postcss.config.js",
  },
  define: {
    "process.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
  },
  build: {
    sourcemap: true,
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  publicDir: "public",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    historyApiFallback: {
      rewrites: [
        { from: /^\/en\/.*$/, to: "/index.html" },
        { from: /^\/uk\/.*$/, to: "/index.html" },
        { from: /./, to: "/index.html" },
      ],
    },
  },
});
