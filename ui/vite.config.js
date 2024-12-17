import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  optimizeDeps: {
    include: ['@emotion/styled']
  },
  build: {
    rollupOptions: {
        input: '/src/index.jsx',
    },
},
})