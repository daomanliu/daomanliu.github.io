---
title: 欢迎来到我的博客
date: 2026-08-06
tags: [随笔]
summary: 博客开张了，这里记录了它是如何搭建的，以及如何发布新文章。
---

欢迎来到我的个人博客！这里会记录我的学习笔记、生活随笔和一些折腾记录。

## 这个博客是怎么搭的

- **前端**：Vue 3 + Vite + Ant Design Vue
- **写作**：所有文章都是 Markdown 文件，支持代码块、表格、数学公式
- **托管**：GitHub Pages，纯静态，零成本

## 怎么发布一篇新文章

1. 在 `public/posts/` 目录下新建一个 `.md` 文件，文件名就是文章的访问路径（slug）
2. 文件开头写上 front-matter 元信息：

```markdown
---
title: 文章标题
date: 2026-08-06
tags: [标签1, 标签2]
summary: 一句话摘要
---
```

3. 运行 `npm run posts` 更新文章索引，然后 `npm run build` 构建
4. 把 `dist/` 目录的内容推送到 `daomanliu.github.io` 仓库，稍等片刻即可访问

## Markdown 效果展示

> 支持引用块。种一棵树最好的时间是十年前，其次是现在。

支持行内代码 `console.log('hello')` 和代码块：

```js
function greet(name) {
  return `你好，${name}！`
}
```

还支持数学公式，比如质能方程 $E = mc^2$，以及独立公式：

$$
\int_{-\infty}^{+\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

| 功能 | 状态 |
| ---- | ---- |
| Markdown 渲染 | 已支持 |
| KaTeX 公式 | 已支持 |
| 标签筛选 | 已支持 |
| 全文搜索 | 已支持 |
