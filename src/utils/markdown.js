// 统一的 Markdown 渲染工具：Markdown + 公式(KaTeX) + 图表(PlantUML/Mermaid) + 净化(DOMPurify)
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { plantumlHtml, mermaidPlaceholderHtml } from '@/utils/diagrams'

const MATH_PLACEHOLDER = /@@KATEX(\d+)@@/g
const DIAGRAM_PLACEHOLDER = /@@DIAGRAM(\d+)@@/g
const DIAGRAM_PLACEHOLDER_P = /<p>@@DIAGRAM(\d+)@@<\/p>/

// 先把 ```plantuml / ```mermaid 代码块抽成占位符，避免 marked 按普通代码块处理；
// 同时保护图表代码中的 $ 字符不被 KaTeX 抽取。其他代码块逻辑不变。
function extractDiagrams(markdown) {
  const store = []
  const text = (markdown || '').replace(
    /^```(plantuml|mermaid)[^\S\r\n]*\r?\n([\s\S]*?)^```[^\S\r\n]*$/gm,
    (_, lang, code) => {
      store.push({ lang, code: code.replace(/\s+$/, '') })
      return `@@DIAGRAM${store.length - 1}@@`
    }
  )
  return { text, store }
}

// 先把公式抽成占位符交给 marked，避免与 Markdown 语法互相干扰；
// 标记渲染并净化后再把占位符替换回 KaTeX 生成的 HTML。
function renderMath(markdown) {
  const store = []
  let text = markdown || ''
  // 块级 $$...$$
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
    const html = katex.renderToString(expr, {
      displayMode: true,
      throwOnError: false,
      output: 'html'
    })
    store.push(html)
    return `@@KATEX${store.length - 1}@@`
  })
  // 行内 $...$
  text = text.replace(/\$([^$\n]+?)\$/g, (_, expr) => {
    const html = katex.renderToString(expr, {
      displayMode: false,
      throwOnError: false,
      output: 'html'
    })
    store.push(html)
    return `@@KATEX${store.length - 1}@@`
  })
  return { text, store }
}

export function renderMarkdown(md) {
  const { text: noDiagrams, store: diagrams } = extractDiagrams(md)
  const { text, store } = renderMath(noDiagrams)
  let html = marked.parse(text, { breaks: true })
  html = DOMPurify.sanitize(html)
  // 还原公式 HTML（KaTeX 输出由我们生成，安全可控）
  html = html.replace(MATH_PLACEHOLDER, (_, i) => store[Number(i)] || '')
  // 还原图表 HTML（在净化之后插入，避免 <img>/占位结构被改写；
  // Mermaid 的 SVG 消毒在 diagrams.js 内单独完成）
  const diagramHtml = (i) => {
    const d = diagrams[Number(i)]
    if (!d) return ''
    return d.lang === 'plantuml' ? plantumlHtml(d.code) : mermaidPlaceholderHtml(d.code)
  }
  // 独占一行的占位符会被 marked 包上 <p>，先整体替换掉，避免 <p> 套 <div>
  while (DIAGRAM_PLACEHOLDER_P.test(html)) {
    html = html.replace(DIAGRAM_PLACEHOLDER_P, (_, i) => diagramHtml(i))
  }
  html = html.replace(DIAGRAM_PLACEHOLDER, (_, i) => diagramHtml(i))
  return html
}
