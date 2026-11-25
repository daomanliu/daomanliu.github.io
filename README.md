# 道满的博客

[![Deploy Blog](https://github.com/daomanliu/daomanliu.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/daomanliu/daomanliu.github.io/actions/workflows/deploy.yml)
![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)

我的个人博客，纯静态、无后端，文章用 Markdown 写作，push 即发布。

**在线访问：<https://daomanliu.github.io>**

---

## 特色

- **Markdown 写作**：文章就是 `public/posts/` 下的 `.md` 文件，支持代码块、表格、KaTeX 数学公式
- **push 即发布**：GitHub Actions 自动构建部署，在 GitHub 网页上直接新建文章也能上线
- **写作后台**：站内 `/admin` 提供分屏编辑器（编辑/预览可折叠），写完导出 `.md`
- **阅读体验**：文章列表、标签筛选、全文搜索，访客无需登录
- **个人简介页**：`resume/` 是一个独立的 Vue 子站（学术主页风格），部署在 [`/resume/`](https://daomanliu.github.io/resume/)

## 技术栈

Vue 3 · Vite · Vue Router · Pinia · Ant Design Vue · marked · KaTeX · DOMPurify

---

## 本地开发

```bash
npm install       # 安装依赖
npm run dev       # 开发服务器
npm run build     # 构建到 dist/（自动重新生成文章索引，并把 resume 子站复制进 dist/resume）
npm run preview   # 预览构建产物
npm run posts     # 只重新生成文章索引 posts.json

# 个人简介子站（详见 resume/README.md）
npm run resume:install   # 安装 resume/ 的依赖
npm run resume:dev       # 开发服务器 http://localhost:5174/resume/
npm run resume:build     # 构建到 resume/dist
```

## 写文章

在 `public/posts/` 下新建 `.md` 文件，文件名即文章路径，头部写 front-matter：

```markdown
---
title: 文章标题
date: 2026-08-07
tags: [标签1, 标签2]
summary: 一句话摘要
---

正文……
```

然后 push，GitHub Actions 会自动生成索引、构建并发布：

```bash
git add -A && git commit -m "新文章" && git push
```

也可以直接在 GitHub 网页上 Add file 新建 md，效果一样。

### 嵌入 B 站等外部内容

正文里可以直接写 `<iframe>`，B 站分享面板里的「嵌入代码」原样粘过来即可：

```html
<iframe src="//player.bilibili.com/player.html?bvid=BV1GJ411x7h7&page=1"
        scrolling="no" frameborder="no" allowfullscreen="true"
        width="800" height="450"></iframe>
```

- 视频播放器会跟随正文宽度按 16:9 自适应；想固定尺寸就在标签里加 `style="width:800px;height:450px"`。
- 只放行白名单站点（B 站、YouTube、优酷、腾讯视频、网易云音乐、QQ 音乐等，见 `src/utils/embed.js` 的 `EMBED_HOSTS`）。其他来源会显示一条可点击的提示而不是静默消失；要支持新站点，把域名加进列表即可。

## 部署说明

- 仓库：`daomanliu.github.io`（用户主页仓库，`vite.config.js` 中 `base: '/'`）
- Pages 来源：**Settings → Pages → Source → GitHub Actions**
- 部署流程：`.github/workflows/deploy.yml`（push 到 main 自动触发）
- 个人简介子站：`resume/`（独立 Vite 子站，`base: '/resume/'`），构建后由 `scripts/copy-resume.js` 复制进 `dist/resume`，访问地址 <https://daomanliu.github.io/resume/>

## 个人简介页（resume/）

`resume/` 是一个独立的小 Vue 站，学术主页那种「左侧头像栏 + 右侧简介」的排版，
零第三方 UI 依赖（只有 `vue`），支持暗色模式和直接打印成 PDF。

内容全在 `resume/src/data/profile.js` 里，改一个字都不用碰组件。详见 [resume/README.md](resume/README.md)。

## 站长后台

- 入口：站点右上角「登录」→ 进入 `/admin`
- 账号配置：`src/config/blog.js`（用户名 + 密码 SHA-256 哈希）
- 后台编辑保存在浏览器本地，点「导出 .md」下载后放回 `public/posts/` 再 push 即发布

> GitHub Pages 为纯静态托管，登录仅用于保护写作入口。

## 目录结构

```
├── .github/workflows/deploy.yml  # 自动部署流程（含 resume 子站构建）
├── public/posts/                 # 博客文章（.md）+ posts.json 索引
├── scripts/
│   ├── build-posts-index.js      # 索引生成脚本
│   └── copy-resume.js            # 把 resume/dist 复制进 dist/resume
├── resume/                       # 个人简介子站（独立 Vite 应用）
│   ├── src/data/profile.js       # ★ 简介的全部文字
│   └── README.md
├── src/
│   ├── config/blog.js            # 博客信息 + 站长账号
│   ├── layouts/BlogLayout.vue    # 站点布局
│   ├── stores/posts.js           # 文章加载 / 本地草稿
│   ├── utils/markdown.js         # Markdown 渲染（KaTeX + 净化）
│   └── views/                    # 首页 / 文章页 / 登录 / 后台
└── vite.config.js
```

---

© 2026 刘道满 · Powered by Vue 3 + GitHub Pages
