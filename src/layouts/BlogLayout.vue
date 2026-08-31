<template>
  <div class="blog-layout" :class="{ wide: isWide }">
    <!-- 顶部导航 -->
    <header class="blog-header">
      <div class="header-inner">
        <router-link to="/" class="brand">
          <img :src="cfg.avatar" alt="avatar" class="brand-avatar" />
          <span class="brand-title">{{ cfg.title }}</span>
        </router-link>
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <template v-if="auth.isLoggedIn">
            <router-link to="/admin" class="nav-link">后台</router-link>
            <span class="nav-user">{{ auth.user?.nickname || cfg.author }}</span>
            <a-button size="small" @click="handleLogout">
              <LogoutOutlined /> 退出登录
            </a-button>
          </template>
          <router-link v-else to="/login" class="nav-link">登录</router-link>
        </nav>
      </div>
    </header>

    <!-- 页面主体（后台等 wide 页面占满更宽更高） -->
    <main class="blog-main" :class="{ wide: isWide }">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="blog-footer">
      <div class="footer-links" v-if="cfg.links.length">
        <a v-for="l in cfg.links" :key="l.url" :href="l.url" target="_blank" rel="noopener">{{ l.label }}</a>
      </div>
      <div>© {{ year }} {{ cfg.author }} · Powered by Vue 3 + GitHub Pages</div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { blogConfig as cfg } from '@/config/blog'
import { LogoutOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const year = new Date().getFullYear()

// 后台编辑页用宽布局，撑满屏幕
const isWide = computed(() => !!route.meta.wide)

function handleLogout() {
  auth.logout()
  message.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.blog-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
}
/* 宽布局（后台编辑）：整页锁定在视口内，让分屏区自己滚动 */
.blog-layout.wide {
  height: 100vh;
  min-height: 0;
  overflow: hidden;
}
.blog-header {
  background: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-inner {
  max-width: none;
  margin: 0;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.brand-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
}
.brand-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
}
.nav {
  display: flex;
  align-items: center;
  gap: 20px;
}
.nav-link {
  color: #555;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
}
.nav-link:hover, .nav-link.router-link-exact-active {
  color: #1890ff;
}
.nav-user {
  font-size: 14px;
  color: #1a1a2e;
  font-weight: 500;
}
.blog-main {
  flex: 1;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}
/* 宽布局（后台编辑）：占满整个宽度并撑满剩余高度，页面本身不滚动 */
.blog-main.wide {
  max-width: none;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}
.blog-main.wide > * {
  flex: 1;
  min-height: 0;
  height: 100%;
}
.blog-footer {
  text-align: center;
  padding: 24px 16px;
  color: #999;
  font-size: 13px;
  border-top: 1px solid #eee;
  background: #fff;
}
.footer-links {
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  gap: 16px;
}
.footer-links a {
  color: #666;
}
.footer-links a:hover {
  color: #1890ff;
}
</style>
