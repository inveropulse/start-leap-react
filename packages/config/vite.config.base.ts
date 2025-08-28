import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export const createViteConfig = (options: { root?: string } = {}) => {
  return defineConfig({
    plugins: [
      react({
        jsxRuntime: 'automatic',
        fastRefresh: true
      })
    ],
    server: {
      hmr: { overlay: false },
      host: true,
      port: 3000,
    },
    resolve: {
      alias: {
        '@': resolve(options.root || '.', 'src')
      }
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom']
    }
  })
}