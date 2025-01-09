import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Helper to generate CSS module paths
const getCssModules = () => {
  return [
    // Pages
    "./src/pages/PatientPortal.module.css",
    "./src/pages/Appointments.module.css",
    "./src/pages/PortalDashboard.module.css",
    "./src/pages/Home.module.css",
    "./src/pages/About.module.css",
    "./src/pages/Services.module.css",

    // Components
    "./src/components/portal/AppointmentManagement.module.css",
    "./src/components/portal/AppointmentViewModal.module.css",
    "./src/components/portal/EditAppointmentModal.module.css",
    "./src/components/Navbar.module.css",
    "./src/components/Footer.module.css",
    "./src/components/ServiceModal.module.css",

    // Education pages
    "./src/pages/education/Education.module.css",
  ];
};

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName:
        process.env.NODE_ENV === "production"
          ? "[hash:base64:8]"
          : "[name]__[local]__[hash:base64:5]",
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    cssCodeSplit: false, // This ensures all CSS is bundled into one file
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          styles: getCssModules(),
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".css")) {
            return "assets/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
});
