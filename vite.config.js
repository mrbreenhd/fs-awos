import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 7777,
    open: true,
    proxy: {
      '/api/airport': {
        target: 'https://apps.estassinos.com',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/airport/, '/api/fs-core-data-api/airports.php?key=soulis'),
      },
    },
  },
  base: '/fs-awos/',
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
