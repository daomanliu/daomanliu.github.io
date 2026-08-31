<template>
  <div class="login-page">
    <!-- 左上角 Logo -->
    <div class="login-logo-top">
      <router-link to="/">
        <img src="/logo.png" alt="logo" />
      </router-link>
    </div>

    <!-- 登录卡片（右侧） -->
    <div class="login-card-wrapper">
      <div class="login-card">
        <div class="login-brand">
          <h1 class="login-title">{{ cfg.title }} · 后台登录</h1>
          <p class="login-subtitle">登录后开始写作（仅站长本人）</p>
        </div>

        <a-form
          :model="form"
          layout="vertical"
          @finish="handleLogin"
        >
          <a-form-item
            label="账号"
            name="username"
            :rules="[{ required: true, message: '请输入账号' }]"
          >
            <a-input
              v-model:value="form.username"
              size="large"
              placeholder="请输入账号"
              allow-clear
            >
              <template #prefix><UserOutlined style="color: #bfbfbf" /></template>
            </a-input>
          </a-form-item>

          <a-form-item
            label="密码"
            name="password"
            :rules="[{ required: true, message: '请输入密码' }]"
          >
            <a-input-password
              v-model:value="form.password"
              size="large"
              placeholder="请输入密码"
              @pressEnter="handleLogin"
            >
              <template #prefix><LockOutlined style="color: #bfbfbf" /></template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              size="large"
              block
              html-type="submit"
              :loading="auth.loading"
            >
              登 录
            </a-button>
          </a-form-item>
        </a-form>

        <div class="back-home">
          <router-link to="/">← 返回博客首页</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { blogConfig as cfg } from '@/config/blog'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({
  username: '',
  password: ''
})

async function handleLogin() {
  if (!form.username || !form.password) {
    message.warning('请输入账号和密码')
    return
  }
  try {
    const user = await auth.login({ username: form.username, password: form.password })
    message.success(`欢迎回来，${user.nickname}`)
    const redirect = route.query.redirect
    router.replace(typeof redirect === 'string' ? redirect : '/admin')
  } catch (err) {
    message.error(err.message || '登录失败')
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  background-image: url('/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  padding: 24px;
}

/* 左上角 Logo */
.login-logo-top {
  position: absolute;
  top: 10px;
  left: 40px;
}
.login-logo-top img {
  height: 64px;
  width: auto;
  object-fit: contain;
}

/* 右侧卡片容器 */
.login-card-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5%;
}

.login-card {
  width: 420px;
  max-width: 90%;
  border-radius: 20px;
  padding: 48px 40px;
  box-shadow: 0 12px 32px 0 rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);  /* 背景模糊 */
  -webkit-backdrop-filter: blur(6px);  /* Safari 兼容 */
}

.login-brand {
  text-align: center;
  margin-bottom: 28px;
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 6px;
}

.login-subtitle {
  font-size: 13px;
  color: #999;
  margin: 0;
}

.back-home {
  text-align: center;
  margin-top: 4px;
}
.back-home a {
  color: #888;
  font-size: 13px;
}
.back-home a:hover {
  color: #1890ff;
}
</style>
