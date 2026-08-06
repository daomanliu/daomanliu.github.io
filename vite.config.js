import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // daomanliu.github.io 是用户主页仓库，部署在根路径，用 '/' 即可；
  // 如果以后改部署到项目仓库（如 daomanliu.github.io/blog/），改成 '/blog/'
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
