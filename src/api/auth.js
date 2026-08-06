// ========== 单账号认证（纯前端，静态博客适用） ==========
// GitHub Pages 是纯静态托管，没有服务器，登录只用于保护前台的后台入口。
// 校验方式：对输入密码做 SHA-256，与 blogConfig.passwordHash 比对。
import { blogConfig } from '@/config/blog'

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('')
}

// 生成一个本地会话 token（仅标识"已通过密码校验"，不含敏感信息）
function makeToken(username) {
  const payload = { username, ts: Date.now() }
  return 'blog.' + btoa(unescape(encodeURIComponent(JSON.stringify(payload)))) + '.local'
}

/**
 * 登录（仅允许配置中的唯一账号）
 * @param {{username: string, password: string}} params
 * @returns {Promise<{token: string, user: {username, nickname, avatar}}>}
 */
export async function login({ username, password }) {
  const u = (username || '').trim()
  const p = password || ''

  if (!u || !p) {
    throw new Error('请输入账号和密码')
  }
  if (u !== blogConfig.username) {
    throw new Error('账号不存在')
  }
  const hash = await sha256(p)
  if (hash !== blogConfig.passwordHash) {
    throw new Error('密码错误')
  }

  return {
    token: makeToken(u),
    user: {
      username: u,
      nickname: blogConfig.author,
      avatar: blogConfig.avatar
    }
  }
}

/**
 * 校验本地 token（刷新页面后恢复登录态）
 * @param {string} token
 */
export async function fetchProfile(token) {
  if (!token || !token.startsWith('blog.')) {
    throw new Error('登录已失效，请重新登录')
  }
  try {
    const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))))
    if (payload.username !== blogConfig.username) throw new Error('用户不存在')
    return {
      username: payload.username,
      nickname: blogConfig.author,
      avatar: blogConfig.avatar
    }
  } catch (e) {
    throw new Error('登录已失效，请重新登录')
  }
}
