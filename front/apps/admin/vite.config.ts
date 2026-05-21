import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/admin/',
  plugins: [react()],
  resolve: {
    alias: {
      '@dk/ui': path.resolve(__dirname, '../../packages/ui/src')
    }
  },
  server: {
    port: 5176,
    strictPort: true
  }
})
