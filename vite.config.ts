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
      "@/shared/ui": "/src/shared/ui",
      "@/shared/utils": "/src/shared/utils",
      "@/shared/provider": "/src/shared/provider",
    },
  },
}));
