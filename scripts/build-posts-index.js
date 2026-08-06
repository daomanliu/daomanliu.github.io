// 扫描 public/posts/ 下的 .md 文件，生成 posts.json 文章索引。
// 会在 npm run dev / npm run build 之前自动执行，无需手动调用。
// 新增文章只需把 .md 文件放进 public/posts/（或部署后的 posts/ 目录），
// 文件头部用 front-matter 写元信息：
//   ---
//   title: 标题
//   date: 2026-08-06
//   tags: [随笔, 生活]
//   summary: 一句话摘要
//   ---
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const postsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'posts')

function parseMeta(raw) {
  const meta = { title: '', date: '', tags: [], summary: '' }
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return meta
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+)\s*:\s*(.*)$/)
    if (!kv) continue
    const [, key, rawVal] = kv
    const val = rawVal.trim()
    if (key === 'tags') {
      meta.tags = val.replace(/^\[|\]$/g, '').split(',').map(t => t.trim()).filter(Boolean)
    } else if (key in meta) {
      meta[key] = val.replace(/^["']|["']$/g, '')
    }
  }
  return meta
}

const files = readdirSync(postsDir).filter(f => /\.md$/i.test(f))
const posts = files.map(f => {
  const slug = f.replace(/\.md$/i, '')
  const meta = parseMeta(readFileSync(join(postsDir, f), 'utf-8'))
  return {
    slug,
    title: meta.title || slug,
    date: meta.date,
    tags: meta.tags,
    summary: meta.summary
  }
}).sort((a, b) => (b.date || '').localeCompare(a.date || ''))

const out = join(postsDir, 'posts.json')
writeFileSync(out, JSON.stringify(posts, null, 2) + '\n', 'utf-8')
console.log(`[posts] 已生成 posts.json，共 ${posts.length} 篇文章`)
