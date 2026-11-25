import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 这个子站最终部署在 https://daomanliu.github.io/resume/
// base 必须是 '/resume/'，否则构建出来的 js/css 会指向站点根目录而 404。
export default defineConfig({
  base: '/resume/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
