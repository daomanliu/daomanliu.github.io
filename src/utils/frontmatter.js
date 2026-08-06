// ========== Markdown front-matter 解析 ==========
// 文章 .md 文件头部用 --- 包裹元信息，例如：
// ---
// title: 我的文章
// date: 2026-08-06
// tags: [随笔, 生活]
// summary: 一句话摘要
// ---
// 正文……

/**
 * 解析带 front-matter 的 markdown 文本
 * @param {string} raw 原始 md 文本
 * @returns {{ meta: {title, date, tags, summary}, content: string }}
 */
export function parsePost(raw) {
  const meta = { title: '', date: '', tags: [], summary: '' }
  if (!raw) return { meta, content: '' }

  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { meta, content: raw }

  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+)\s*:\s*(.*)$/)
    if (!kv) continue
    const [, key, rawVal] = kv
    const val = rawVal.trim()
    if (key === 'tags') {
      // 支持 [a, b] 或 a, b 两种写法
      const inner = val.replace(/^\[|\]$/g, '')
      meta.tags = inner.split(',').map(t => t.trim()).filter(Boolean)
    } else if (key in meta) {
      meta[key] = val.replace(/^["']|["']$/g, '')
    }
  }
  return { meta, content: raw.slice(m[0].length) }
}

/**
 * 由元信息 + 正文组装回完整的 md 文件文本（后台编辑器导出用）
 */
export function stringifyPost(meta, content) {
  const lines = ['---']
  lines.push(`title: ${meta.title || '未命名'}`)
  lines.push(`date: ${meta.date || new Date().toISOString().slice(0, 10)}`)
  lines.push(`tags: [${(meta.tags || []).join(', ')}]`)
  if (meta.summary) lines.push(`summary: ${meta.summary}`)
  lines.push('---', '')
  return lines.join('\n') + (content || '')
}
