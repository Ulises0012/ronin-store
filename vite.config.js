import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    proxy: {
      '/api': 'https://ronin-api-aj8j.onrender.com',
      '/uploads': 'http://localhost:3001',
    },
  },
})