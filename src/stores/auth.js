import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@/api/auth'

const TOKEN_KEY = 'blog-token'
const USER_KEY = 'blog-user'

export const useAuthStore = defineStore('auth', () => {
  // ========== State ==========
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const user = ref(null)
  const loading = ref(false)

  const savedUser = localStorage.getItem(USER_KEY)
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser)
    } catch (e) {
      user.value = null
    }
  }

  // ========== Getters ==========
  const isLoggedIn = computed(() => !!token.value)

  // ========== Actions ==========
  function persist() {
    if (token.value) {
      localStorage.setItem(TOKEN_KEY, token.value)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
    if (user.value) {
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  }

  // 登录：调用模拟后端
  async function login(credentials) {
    loading.value = true
    try {
      const { token: t, user: u } = await authApi.login(credentials)
      token.value = t
      user.value = u
      persist()
      return u
    } finally {
      loading.value = false
    }
  }

  // 登出
  function logout() {
    token.value = ''
    user.value = null
    persist()
  }

  async function init() {
    if (token.value && !user.value) {
      try {
        const profile = await authApi.fetchProfile(token.value)
        user.value = profile
        persist()
      } catch (e) {
        token.value = ''
        user.value = null
        persist()
      }
    }
  }

  return {
    token, user, loading,
    isLoggedIn,
    login, logout, init
  }
})
