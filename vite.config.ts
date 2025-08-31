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
      "@/shared/components": "/src/shared/components",
      "@/shared/utils": "/src/shared/utils",
      "@/shared/providers": "/src/shared/providers",
      "@/shared/hooks": "/src/shared/hooks",
      "@/shared/services": "/src/shared/services",
    },
  },
}));
