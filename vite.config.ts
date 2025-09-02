import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": "/src",
      "@/api": "/src/api",
      "@/app": "/src/app",
      "@/shared": "/src/shared",
      "@/shared/utils": "/src/shared/utils",
      "@/shared/hooks": "/src/shared/hooks",
      "@/shared/services": "/src/shared/services",
      "@/shared/providers": "/src/shared/providers",
      "@/shared/components": "/src/shared/components",
    },
  },
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Node modules - keep the detailed chunking here since they're stable
          if (id.includes("node_modules")) {
            // Core React - keep small and separate
            if (
              id.includes("react/") &&
              !id.includes("react-dom") &&
              !id.includes("react-router")
            ) {
              return "react-core";
            }

            // React DOM - largest React dependency
            if (id.includes("react-dom")) {
              return "react-dom";
            }

            // React Router - routing logic
            if (id.includes("react-router")) {
              return "react-router";
            }

            if (
              id.includes("@tanstack/react-query") ||
              id.includes("zustand")
            ) {
              return "state-management";
            }
            if (id.includes("@radix-ui")) {
              return "radix-ui";
            }
            if (
              id.includes("react-hook-form") ||
              id.includes("zod") ||
              id.includes("@hookform")
            ) {
              return "forms";
            }
            if (
              id.includes("framer-motion") ||
              id.includes("class-variance-authority") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge")
            ) {
              return "ui-utils";
            }
            if (id.includes("lucide-react") || id.includes("crypto-js")) {
              return "icons-crypto";
            }
            if (id.includes("axios")) {
              return "http-client";
            }
            return "vendor";
          }

          // Application code - high level chunking only
          if (id.includes("src/")) {
            // API layer - changes less frequently
            if (id.includes("src/api/")) {
              return "api";
            }

            // Routes configuration - small and stable
            if (id.includes("src/routes/")) {
              return "routes";
            }

            // Shared utilities and components - changes less frequently
            if (id.includes("src/shared/")) {
              return "shared";
            }

            // Application pages split by portal - users only access one portal
            if (id.includes("src/app/")) {
              // Authentication pages - shared by all portals
              if (id.includes("src/app/auth/")) {
                return "app-auth";
              }

              // Portal-specific chunks
              if (id.includes("src/app/clinic/")) {
                return "app-clinic";
              }

              if (id.includes("src/app/internal/")) {
                return "app-internal";
              }

              if (id.includes("src/app/patient/")) {
                return "app-patient";
              }

              if (id.includes("src/app/sedationist/")) {
                return "app-sedationist";
              }

              // Fallback for any other app code
              return "app";
            }
          }
        },
      },
    },
  },
}));
