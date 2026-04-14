import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@dk/ui': path.resolve(__dirname, '../../packages/ui/src')
    }
  },
  server: {
    port: 5174,
    proxy: {
      '/vendor': {
        target: 'http://localhost:5175',
        changeOrigin: true,
        ws: true,
      },
      '/admin': {
        target: 'http://localhost:5176',
        changeOrigin: true,
        ws: true,
      }
    }
  }
})
