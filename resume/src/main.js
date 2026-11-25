import { createApp } from 'vue'

import App from './App.vue'
import { initTheme } from './composables/useTheme'
import { reveal } from './directives/reveal'
import './style.css'

// 先定主题再挂载，避免首屏闪一下白/黑
initTheme()

createApp(App).directive('reveal', reveal).mount('#app')
