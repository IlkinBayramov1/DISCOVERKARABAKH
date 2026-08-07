import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      '@dk/ui': path.resolve(__dirname, '../../packages/ui/src')
    }
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-icons': ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:4004',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:4004',
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
