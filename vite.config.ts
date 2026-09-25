import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // host: true rend l'appli accessible depuis l'iPhone sur le même Wi-Fi
  server: { host: true },
})
