import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiUrl = process.env.API_URL || 'http://localhost:3000'

export default defineConfig({
  plugins: [react()],
  define: {
    __API_URL__: JSON.stringify(apiUrl)
  }
})