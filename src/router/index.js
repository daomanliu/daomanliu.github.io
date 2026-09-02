import { createRouter, createWebHashHistory } from 'vue-router'
import BlogLayout from '@/layouts/BlogLayout.vue'
import { useAuthStore } from '@/stores/auth'

// GitHub Pages 静态托管不支持 history 回退配置，用 hash 模式最省心，
// 地址形如 daomanliu.github.io/#/post/xxx
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true, title: '登录' }
  },
  {
    path: '/',
    component: BlogLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: { public: true, title: '首页' }
      },
      {
        path: 'post/:slug',
        name: 'post',
        component: () => import('@/views/PostView.vue'),
        meta: { public: true, title: '文章' }
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/AdminView.vue'),
        meta: { requiresAuth: true, title: '后台管理', wide: true }
      },
      {
        path: 'schedule',
        name: 'schedule',
        component: () => import('@/views/ScheduleView.vue'),
        meta: { requiresAuth: true, title: '课表查询' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局前置守卫：只有后台需要登录，博客前台完全公开
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.name === 'login' && auth.isLoggedIn) {
    return { name: 'admin' }
  }
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
