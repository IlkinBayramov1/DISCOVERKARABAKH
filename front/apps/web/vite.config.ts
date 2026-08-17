import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ...(process.env.ANALYZE ? [
      visualizer({
        filename: 'stats.html',
        emitFile: true,
        gzipSize: true,
        brotliSize: true,
      })
    ] : [])
  ],
  resolve: {
    alias: {
      '@dk/ui': path.resolve(__dirname, '../../packages/ui/src')
    }
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  build: {
    target: 'esnext',
    modulePreload: {
      polyfill: true
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
          }
        }
      }
    }
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/vendor': {
        target: 'http://localhost:5175',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:5176',
        changeOrigin: true,
      }
    }
  }
});
