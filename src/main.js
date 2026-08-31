import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './assets/markdown.css'
import App from './App.vue'
import router from './router'

// 清理旧版「Markdown 笔记本」遗留的 localStorage 数据
;(function clearLegacyNotes() {
  try {
    const legacy = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('markdown-note')) legacy.push(k)
    }
    legacy.forEach(k => localStorage.removeItem(k))
  } catch (e) {
    // 忽略隐私模式等无法访问 localStorage 的异常
  }
})()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Antd)


// 初始化登录状态
const auth = useAuthStore()
auth.init().then(() => {
  app.mount('#app')
})