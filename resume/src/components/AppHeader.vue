<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

import AppIcon from '@/components/AppIcon.vue'
import { useTheme } from '@/composables/useTheme'
import { navItems, profile } from '@/data/profile'

const { theme, toggleTheme } = useTheme()

const progress = ref(0)
const stuck = ref(false)
let ticking = false

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const root = document.documentElement
    const scrollable = root.scrollHeight - root.clientHeight
    progress.value = scrollable > 0 ? Math.min(1, root.scrollTop / scrollable) : 0
    stuck.value = root.scrollTop > 4
    ticking = false
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="topbar no-print" :class="{ 'topbar--stuck': stuck }">
    <div class="topbar-inner">
      <a class="brand" href="#top">{{ profile.name }}</a>

      <nav class="topnav" aria-label="页面导航">
        <template v-for="item in navItems" :key="item.label">
          <a
            v-if="item.external"
            :href="item.href"
            target="_blank"
            rel="noopener"
            class="topnav-link"
          >
            {{ item.label }}
            <span class="ext" aria-hidden="true">↗</span>
          </a>
          <a v-else :href="`#${item.id}`" class="topnav-link">{{ item.label }}</a>
        </template>
      </nav>

      <button
        class="theme-btn"
        type="button"
        :aria-label="theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'"
        :title="theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'"
        @click="toggleTheme"
      >
        <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" :size="15" />
      </button>
    </div>
    <div class="progress" :style="{ transform: `scaleX(${progress})` }"></div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: color-mix(in srgb, var(--bg) 94%, transparent);
  backdrop-filter: saturate(150%) blur(10px);
  border-bottom: 1px solid var(--line);
}

.progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1.5px;
  transform-origin: 0 50%;
  background: var(--accent);
  opacity: 0.55;
}

.topbar-inner {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 32px;
  height: 62px;
  display: flex;
  align-items: center;
  gap: 28px;
}

.brand {
  font-family: var(--font-serif);
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--text);
  white-space: nowrap;
}

.brand:hover {
  color: var(--text);
  text-decoration: none;
}

.topnav {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 30px;
}

.topnav-link {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--text-soft);
  white-space: nowrap;
  transition: color 0.16s ease;
}

.topnav-link:hover {
  color: var(--text);
  text-decoration: underline;
  text-underline-offset: 5px;
  text-decoration-thickness: 1px;
  text-decoration-color: var(--line-strong);
}

.ext {
  font-size: 10px;
  color: var(--text-faint);
  margin-left: 2px;
}

.theme-btn {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--text-faint);
  cursor: pointer;
  transition: color 0.16s ease, border-color 0.16s ease;
}

.theme-btn:hover {
  color: var(--accent);
  border-color: var(--accent-line);
}

@media (max-width: 860px) {
  .topbar-inner {
    padding: 0 20px;
    gap: 16px;
  }
  .topnav {
    gap: 18px;
  }
  .topnav-link:nth-child(n + 4):not(:last-child) {
    display: none;
  }
}

@media (max-width: 560px) {
  .topnav {
    display: none;
  }
  .theme-btn {
    margin-left: auto;
  }
}
</style>
