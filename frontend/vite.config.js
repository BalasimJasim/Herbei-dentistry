import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// List of CSS modules that must be included
const requiredCssModules = [
  "./src/pages/PatientPortal.module.css",
  "./src/pages/Appointments.module.css",
  "./src/pages/Contact.module.css",
  "./src/pages/Dashboard.module.css",
  "./src/pages/PortalDashboard.module.css",
  "./src/components/portal/AppointmentManagement.module.css",
  "./src/components/portal/AppointmentViewModal.module.css",
  "./src/components/portal/EditAppointmentModal.module.css",
  "./src/components/AppointmentForm.module.css",
];

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    {
      name: 'css-modules-check',
      enforce: 'pre',
      configResolved(config) {
        // Ensure CSS modules are properly configured
        if (!config.css?.modules) {
          throw new Error('CSS modules configuration is missing');
        }
      },
      transform(code, id) {
        // Add debug logs in development
        if (mode === 'development' && id.endsWith('.module.css')) {
          console.log(`[CSS Module] Loading: ${id}`);
        }
      }
    }
  ],
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: mode === "production" 
        ? "[hash:base64:8]" 
        : "[name]__[local]__[hash:base64:5]",
    },
    preprocessorOptions: {
      css: {
        charset: false
      }
    },
    devSourcemap: true,
  },
  build: {
    cssCodeSplit: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "portal-styles": requiredCssModules.filter(path => path.includes("/pages/")),
          "appointment-styles": requiredCssModules.filter(path => path.includes("/components/")),
        },
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split(".").at(1);
          if (extType === "css") {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: true,
      },
    },
    // Add warning for missing CSS modules
    rollupWarningHandler: (warning, defaultHandler) => {
      if (warning.code === 'EMPTY_BUNDLE' && warning.message.includes('.module.css')) {
        throw new Error(`Missing CSS module: ${warning.message}`);
      }
      defaultHandler(warning);
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
}));
