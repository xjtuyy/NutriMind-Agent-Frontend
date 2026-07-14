import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver()] }),
  ],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@use "@/assets/styles/variables.scss" as *;` },
    },
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:9999',
        changeOrigin: true,
      },
    },
  },
})
