// 统一的 Markdown 渲染工具：Markdown + 公式(KaTeX) + 净化(DOMPurify)
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const MATH_PLACEHOLDER = /@@KATEX(\d+)@@/g

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
  const { text, store } = renderMath(md)
  let html = marked.parse(text, { breaks: true })
  html = DOMPurify.sanitize(html)
  // 还原公式 HTML（KaTeX 输出由我们生成，安全可控）
  html = html.replace(MATH_PLACEHOLDER, (_, i) => store[Number(i)] || '')
  return html
}
