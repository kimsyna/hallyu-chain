import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    globals: true,
  },
  plugins: [react()],
  base: '/frontend/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/locales/')) {
            const locale = path.basename(id, '.json')
            return `locale-${locale}`
          }
        },
      },
    },
  },
})
