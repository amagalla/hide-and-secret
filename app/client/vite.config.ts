import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    include: "**/*.tsx",
  })],
  server: {
    port: 8080,
    watch: {
      usePolling: true,
    },
    host: '0.0.0.0'
  }
})
