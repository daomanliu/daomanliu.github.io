// Markdown 图表渲染支持：PlantUML（远程 SVG 图片）+ Mermaid（本地异步渲染 SVG）
// 与 utils/markdown.js 配合：markdown.js 负责抽取代码块并生成占位 HTML，
// 本模块的 renderDiagrams(container) 在 v-html 挂载后做异步后处理。
import plantumlEncoder from 'plantuml-encoder'

const PLANTUML_SERVER = 'https://www.plantuml.com/plantuml/svg/'
const MAX_CACHE = 100 // Mermaid SVG 缓存上限（按 主题+代码 键控）

let mermaidTheme = null
let idCounter = 0
const svgCache = new Map()

// Mermaid 体积较大，按需动态加载：只有页面真的包含 mermaid 图表时才下载
let mermaidPromise = null
function loadMermaid() {
  if (!mermaidPromise) mermaidPromise = import('mermaid').then((m) => m.default)
  return mermaidPromise
}

// 主题跟随博客自身的暗色开关（html 上的 dark class），
// 而不是系统偏好——避免系统暗色但页面浅色时出现"深色图配浅底"。
// 如果你的博客暗色模式不是用 dark class 实现的，改成你实际的判断方式。
function isDarkMode() {
  return typeof document !== 'undefined'
    && document.documentElement.classList.contains('dark')
}

// startOnLoad: false 避免 mermaid 自动扫描 DOM 与 Vue 渲染冲突；
// htmlLabels: false 让节点文字走纯 SVG <text>，不经过 foreignObject，
// 从根本上避免消毒/浏览器兼容导致文字丢失（flowchart 和 classDiagram 分别配置）。
async function ensureMermaid() {
  const mermaid = await loadMermaid()
  const theme = isDarkMode() ? 'dark' : 'neutral'
  if (mermaidTheme !== theme) {
    mermaid.initialize({
      startOnLoad: false,
      theme,
      themeVariables: { background: 'transparent' },
      flowchart: { htmlLabels: false },
      class: { htmlLabels: false }
    })
    mermaidTheme = theme
  }
  return mermaid
}

function uniqueId() {
  idCounter += 1
  return `mermaid-${Date.now()}-${idCounter}-${Math.random().toString(36).slice(2, 8)}`
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function errorInnerHtml(title, detail) {
  return `<div class="diagram-error-title">${escapeHtml(title)}</div>`
    + (detail ? `<pre class="diagram-error-detail">${escapeHtml(detail)}</pre>` : '')
}

// ---- PlantUML：编码为远程图片 URL ----

export function plantumlHtml(code) {
  let encoded
  try {
    encoded = plantumlEncoder.encode(code)
  } catch (e) {
    return `<div class="markdown-diagram diagram-error">${errorInnerHtml('PlantUML 编码失败', e && e.message)}</div>`
  }
  return `<div class="markdown-diagram plantuml-diagram">`
    + `<img src="${PLANTUML_SERVER}${encoded}" alt="PlantUML 图表" loading="lazy" class="diagram-img">`
    + `</div>`
}

// ---- Mermaid：先输出占位 div，渲染在 renderDiagrams 中异步完成 ----
// 代码经 encodeURIComponent 存入 data 属性，可安全通过 DOMPurify（data-* 默认放行）。

export function mermaidPlaceholderHtml(code) {
  return `<div class="markdown-diagram mermaid-diagram" data-mermaid="${encodeURIComponent(code)}">`
    + `<div class="diagram-loading">Mermaid 图表渲染中…</div>`
    + `</div>`
}

// 缓存的是"id 占位符版本"的 SVG。
// mermaid 生成的 SVG 内联 <style> 选择器、节点 id、url(#...) 引用都含渲染时的 id，
// 若同一篇文档插入两段相同代码的缓存结果，会出现重复 id、样式互串（配色全乱）。
// 因此缓存时把 id 统一换成占位符，插入页面时再换成全新唯一 id。
const ID_PLACEHOLDER = '__MERMAID_ID__'

async function renderMermaidSvg(code) {
  const theme = isDarkMode() ? 'dark' : 'neutral'
  const key = `${theme}::${code}`
  if (svgCache.has(key)) return svgCache.get(key)

  const mermaid = await ensureMermaid()
  const id = uniqueId()
  let result
  try {
    const { svg } = await mermaid.render(id, code)
    // 个人博客内容可信，SVG 不再经 DOMPurify 消毒
    // （消毒会把 foreignObject / 嵌套 HTML 里的文字洗掉，导致图表无文字）。
    // 先替换带前缀的 d${id}（mermaid 部分引用用此变体），再替换 id 本身，
    // 顺序不能反，否则后者会先吃掉前者里的 id 部分
    result = {
      ok: true,
      html: svg
        .replaceAll(`d${id}`, `d${ID_PLACEHOLDER}`)
        .replaceAll(id, ID_PLACEHOLDER)
    }
  } catch (e) {
    result = { ok: false, message: (e && e.message) || String(e) }
    // mermaid 渲染失败时可能在 body 下残留临时节点，按 id 清理
    document.getElementById(id)?.remove()
    document.getElementById(`d${id}`)?.remove()
  }

  if (svgCache.size >= MAX_CACHE) svgCache.delete(svgCache.keys().next().value)
  svgCache.set(key, result)
  return result
}

// ---- v-html 挂载后的异步后处理入口 ----

export async function renderDiagrams(container) {
  if (!container) return

  // 1) Mermaid 占位符 -> SVG（并发渲染，不阻塞主线程的其他工作）
  const mermaidNodes = container.querySelectorAll('.mermaid-diagram[data-mermaid]')
  await Promise.all(Array.from(mermaidNodes).map(async (el) => {
    if (el.dataset.rendered === '1') return
    el.dataset.rendered = '1'
    let code = ''
    try {
      code = decodeURIComponent(el.getAttribute('data-mermaid') || '')
    } catch {
      el.classList.add('diagram-error')
      el.innerHTML = errorInnerHtml('Mermaid 图表代码读取失败')
      return
    }
    const res = await renderMermaidSvg(code)
    if (res.ok) {
      // 插入前把占位符换成全新唯一 id，保证页面内无重复 id
      el.innerHTML = res.html.replaceAll(ID_PLACEHOLDER, uniqueId())
    } else {
      el.classList.add('diagram-error')
      el.innerHTML = errorInnerHtml('Mermaid 图表渲染失败', res.message)
    }
  }))

  // 2) PlantUML 图片加载失败兜底（网络故障或语法错误导致服务器返回失败）
  container.querySelectorAll('.plantuml-diagram img.diagram-img').forEach((img) => {
    if (img.dataset.errBound === '1') return
    img.dataset.errBound = '1'
    const fail = () => {
      const box = img.closest('.plantuml-diagram')
      if (!box) return
      box.classList.add('diagram-error')
      box.innerHTML = errorInnerHtml(
        'PlantUML 图表加载失败',
        '可能是网络问题或 PlantUML 语法错误，请检查代码或稍后重试。'
      )
    }
    // 已加载完成但无内容 = 已失败（懒加载图片可能先于监听器绑定触发 error）
    if (img.complete && img.naturalWidth === 0) fail()
    else img.addEventListener('error', fail, { once: true })
  })
}
