import { ref } from 'vue'

// 明暗主题：跟随系统，手动切换后记到 localStorage
const STORAGE_KEY = 'resume:theme'

export const theme = ref('light')

function apply(value) {
  document.documentElement.dataset.theme = value
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', value === 'dark' ? '#0d1015' : '#ffffff')
}

export function initTheme() {
  let stored = null
  try {
    stored = localStorage.getItem(STORAGE_KEY)
  } catch {
    // 隐私模式下 localStorage 不可用，忽略
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  theme.value = stored === 'dark' || stored === 'light' ? stored : prefersDark ? 'dark' : 'light'
  apply(theme.value)
}

export function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  apply(theme.value)
  try {
    localStorage.setItem(STORAGE_KEY, theme.value)
  } catch {
    // 忽略
  }
}

export function useTheme() {
  return { theme, toggleTheme }
}
