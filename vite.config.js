import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@use "@/assets/styles/variables.scss" as *;` },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:9999',
        changeOrigin: true,
      },
    },
  },
})
