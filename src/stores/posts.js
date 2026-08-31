import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { parsePost, stringifyPost } from '@/utils/frontmatter'

// 文章目录地址（构建后 md/json 与 index.html 同目录，在 posts/ 子目录下）
const BASE = (import.meta.env.BASE_URL || '/') + 'posts/'

// 本地覆盖层：后台编辑的改动先存浏览器，导出 md 发布后才真正生效
const OVERRIDE_KEY = 'blog-post-overrides' // { slug: 完整md文本 }，覆盖已发布文章
const DRAFT_KEY = 'blog-post-drafts'       // { slug: 完整md文本 }，尚未发布的新文章

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}')
  } catch (e) {
    return {}
  }
}

export const usePostsStore = defineStore('posts', () => {
  // ========== State ==========
  const index = ref([])        // posts.json 的文章索引：[{slug,title,date,tags,summary}]
  const contents = ref({})     // slug -> 原始 md 文本（缓存，避免重复请求）
  const overrides = ref(readJson(OVERRIDE_KEY))
  const drafts = ref(readJson(DRAFT_KEY))
  const loading = ref(false)
  const loaded = ref(false)
  const searchQuery = ref('')
  const activeTag = ref('')

  // ========== Getters ==========
  // 全量文章列表 = 已发布索引 + 本地覆盖 + 本地草稿，按日期倒序
  const allPosts = computed(() => {
    const map = new Map()
    for (const p of index.value) {
      map.set(p.slug, { ...p, published: true })
    }
    // 覆盖层：元信息以本地编辑后的为准
    for (const [slug, raw] of Object.entries(overrides.value)) {
      const { meta } = parsePost(raw)
      const prev = map.get(slug) || { published: true }
      map.set(slug, { ...prev, ...meta, slug, modified: true })
    }
    // 草稿：还没发布的新文章
    for (const [slug, raw] of Object.entries(drafts.value)) {
      const { meta } = parsePost(raw)
      map.set(slug, { ...meta, slug, published: false, draft: true })
    }
    return [...map.values()].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  })

  // 前台展示：只显示已发布文章，支持搜索和标签筛选
  const publishedPosts = computed(() => {
    let list = allPosts.value.filter(p => p.published)
    const q = searchQuery.value.trim().toLowerCase()
    if (q) {
      list = list.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.summary || '').toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }
    if (activeTag.value) {
      list = list.filter(p => (p.tags || []).includes(activeTag.value))
    }
    return list
  })

  // 所有已发布文章的标签（含计数）
  const allTags = computed(() => {
    const counter = new Map()
    for (const p of allPosts.value) {
      if (!p.published) continue
      for (const t of p.tags || []) {
        counter.set(t, (counter.get(t) || 0) + 1)
      }
    }
    return [...counter.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  })

  // 每篇文章的本地状态：draft（本地草稿）/ modified（已发布文章被本地改过）
  const localKind = computed(() => {
    const m = new Map()
    for (const s of Object.keys(overrides.value)) m.set(s, 'modified')
    for (const s of Object.keys(drafts.value)) m.set(s, 'draft')
    return m
  })

  // ========== Actions ==========
  // 是否已发布（在 posts.json 索引里）
  function isPublished(slug) {
    return index.value.some(p => p.slug === slug)
  }

  // slug 是否已被占用（已发布 / 本地草稿 / 本地覆盖）
  function slugExists(slug) {
    return isPublished(slug) || !!drafts.value[slug] || !!overrides.value[slug]
  }

  // 导入：直接写入一份完整的 md 文本
  // 命中已发布文章 → 覆盖层（标为「已修改」）；否则 → 本地草稿
  function putRaw(slug, raw) {
    if (isPublished(slug)) {
      overrides.value = { ...overrides.value, [slug]: raw }
      localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides.value))
      return 'modified'
    }
    drafts.value = { ...drafts.value, [slug]: raw }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts.value))
    return 'draft'
  }

  // 重命名：把本地数据从 oldSlug 迁移到 newSlug（调用方需自行校验 newSlug 未冲突）
  function renameLocal(oldSlug, newSlug) {
    if (!oldSlug || oldSlug === newSlug) return
    if (drafts.value[oldSlug]) {
      const next = { ...drafts.value, [newSlug]: drafts.value[oldSlug] }
      delete next[oldSlug]
      drafts.value = next
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next))
    } else if (overrides.value[oldSlug]) {
      const next = { ...overrides.value, [newSlug]: overrides.value[oldSlug] }
      delete next[oldSlug]
      overrides.value = next
      localStorage.setItem(OVERRIDE_KEY, JSON.stringify(next))
    }
  }

  // 拉取文章索引 posts/posts.json
  async function loadIndex(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    try {
      const res = await fetch(BASE + 'posts.json?t=' + Date.now())
      if (!res.ok) throw new Error('posts.json 加载失败')
      index.value = await res.json()
      loaded.value = true
    } catch (e) {
      index.value = []
    } finally {
      loading.value = false
    }
  }

  // 拉取单篇文章原始 md（优先本地覆盖/草稿）
  async function loadPost(slug, force = false) {
    if (drafts.value[slug]) return parsePost(drafts.value[slug])
    if (overrides.value[slug]) return parsePost(overrides.value[slug])
    if (!force && contents.value[slug]) return parsePost(contents.value[slug])

    const res = await fetch(`${BASE}${encodeURIComponent(slug)}.md`)
    if (!res.ok) throw new Error('文章不存在或加载失败')
    const raw = await res.text()
    contents.value[slug] = raw
    return parsePost(raw)
  }

  // 后台保存：写入本地覆盖层/草稿（不会改动服务器文件，需导出后发布）
  function saveLocal(slug, meta, content, isNew) {
    const raw = stringifyPost(meta, content)
    if (isNew) {
      drafts.value = { ...drafts.value, [slug]: raw }
      localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts.value))
    } else {
      overrides.value = { ...overrides.value, [slug]: raw }
      localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides.value))
    }
  }

  // 导出单篇文章为 .md 下载（发布方式：把文件放进 posts/ 并更新索引）
  function exportPost(slug, meta, content) {
    const raw = stringifyPost(meta, content)
    const blob = new Blob([raw], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 删除本地草稿 / 撤销本地修改
  function removeLocal(slug) {
    if (drafts.value[slug]) {
      const next = { ...drafts.value }
      delete next[slug]
      drafts.value = next
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next))
    }
    if (overrides.value[slug]) {
      const next = { ...overrides.value }
      delete next[slug]
      overrides.value = next
      localStorage.setItem(OVERRIDE_KEY, JSON.stringify(next))
    }
  }

  return {
    index, loading, loaded, searchQuery, activeTag,
    allPosts, publishedPosts, allTags, localKind,
    loadIndex, loadPost, saveLocal, exportPost, removeLocal,
    isPublished, slugExists, putRaw, renameLocal
  }
})
