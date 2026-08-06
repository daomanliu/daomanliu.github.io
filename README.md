# 道满的博客

一个纯静态个人博客：文章用 Markdown 写作，存放在 `public/posts/` 目录，构建后随站点一起部署到 GitHub Pages。使用 Vue 3 + Vite + Ant Design Vue 构建，支持 LaTeX 公式、标签筛选、全文搜索，并带一个仅站长可登录的写作后台。

---

## 功能特性

- **公开阅读**：首页文章列表（按日期倒序）、标签筛选、全文搜索、文章详情页，无需登录。
- **Markdown 文章**：文章就是 `public/posts/` 下的 `.md` 文件，头部用 front-matter 写元信息；`marked` + `KaTeX` + `DOMPurify` 渲染。
- **单人后台**：仅站长一个账号（配置在 `src/config/blog.js`），登录后可在 `/admin` 写作 / 编辑 / 预览，保存到浏览器本地并一键导出 `.md` 文件。
- **自动索引**：`npm run dev` / `npm run build` 前自动扫描 `public/posts/` 生成 `posts.json` 文章索引。

---

## 快速开始

```bash
npm install       # 安装依赖
npm run dev       # 本地开发（自动更新文章索引）
npm run build     # 构建到 dist/（自动更新文章索引）
npm run preview   # 本地预览构建产物
npm run posts     # 只更新文章索引 posts.json
```

---

## 写一篇新文章

1. 在 `public/posts/` 下新建 `.md` 文件，文件名即文章路径（slug），如 `my-first-post.md`；
2. 文件开头写 front-matter：

```markdown
---
title: 文章标题
date: 2026-08-06
tags: [标签1, 标签2]
summary: 一句话摘要
---

正文……
```

3. 执行 `npm run build`，把 `dist/` 里的内容推送到 GitHub 仓库，稍等片刻即上线。

也可以在 `/admin` 后台在线写作：编辑 → 保存到本地 → 导出 .md → 把文件放入 `public/posts/` → 构建推送。

---

## 部署到 GitHub Pages（daomanliu.github.io）

仓库 `daomanliu.github.io` 是用户主页仓库，内容必须放在**默认分支（通常是 main/master）的根目录**。

### 方式一：dist 直接推到主仓库（最简单）

```bash
npm run build

# 在另一个目录克隆仓库
git clone https://github.com/daomanliu/daomanliu.github.io.git
# 清空旧文件，把 dist/ 里的内容复制进去
cp -r dist/* daomanliu.github.io/
cd daomanliu.github.io
git add -A && git commit -m "update blog" && git push
```

稍等 1~2 分钟，访问 <https://daomanliu.github.io> 即可看到博客。

### 方式二：GitHub Actions 自动部署（推荐，一劳永逸）

项目已内置 `.github/workflows/deploy.yml`。一次性设置：

1. 把本项目**源码**推到 `daomanliu.github.io` 仓库的 `main` 分支（注意清空旧 dist 文件）；
2. 仓库 Settings → Pages → Source 选择 **GitHub Actions**。

之后每次 push（哪怕只加了一篇 `public/posts/xxx.md`），Action 都会自动构建并发布，1~2 分钟后上线。**甚至可以直接在 GitHub 网页上新建/编辑 md 文章**，提交后自动上线，完全不用在本地构建。

### 方式三：只发文章（不构建，应急用）

文章是运行时动态加载的，所以也可以直接在已部署的仓库里：

1. 上传 `posts/xxx.md`；
2. 编辑 `posts/posts.json`，在数组里加一条（保持按日期倒序）：

```json
{ "slug": "xxx", "title": "标题", "date": "2026-08-07", "tags": ["标签"], "summary": "摘要" }
```

提交后即上线。注意手动维护 posts.json 容易和方式一/二冲突，建议固定用一种方式。

> 注意：`vite.config.js` 中 `base` 已配置为 `/`（用户主页仓库适用）。若改部署到项目仓库（`daomanliu.github.io/blog/`），需改为 `base: '/blog/'`。

---

## 站长账号配置

账号配置在 `src/config/blog.js`：

- 用户名：`username`（默认 `刘道满`）
- 密码：存 SHA-256 哈希 `passwordHash`（默认密码 `123456`）。修改方法：浏览器控制台执行

```js
crypto.subtle.digest('SHA-256', new TextEncoder().encode('你的新密码'))
  .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('')))
```

把输出替换到 `passwordHash` 即可。

> 说明：GitHub Pages 是纯静态托管，无服务器，登录仅用于保护后台写作入口；文章数据以仓库中的 md 文件为准。

---

## 项目结构

```
my-project/
├── public/
│   └── posts/               # 博客文章（.md）+ 自动生成的 posts.json
├── scripts/
│   └── build-posts-index.js # 扫描 posts 生成索引（dev/build 前自动执行）
├── src/
│   ├── api/auth.js          # 单账号登录校验（SHA-256）
│   ├── assets/markdown.css  # 文章正文样式
│   ├── config/blog.js       # 博客信息 + 站长账号配置
│   ├── layouts/BlogLayout.vue # 站点布局（顶栏/页脚）
│   ├── router/index.js      # 路由：/ 首页、/post/:slug、/login、/admin
│   ├── stores/
│   │   ├── auth.js          # 登录态
│   │   └── posts.js         # 文章索引/内容加载、本地草稿与导出
│   ├── utils/
│   │   ├── frontmatter.js   # md 元信息解析/生成
│   │   └── markdown.js      # marked + KaTeX + DOMPurify 渲染
│   └── views/
│       ├── HomeView.vue     # 首页（文章列表/搜索/标签）
│       ├── PostView.vue     # 文章详情
│       ├── LoginView.vue    # 站长登录
│       └── AdminView.vue    # 写作后台
├── index.html
├── vite.config.js           # base: '/'
└── package.json
```

---

## 技术栈

Vue 3.5 · Vite 8 · Vue Router 4（hash 模式）· Pinia 3 · Ant Design Vue 4 · marked + katex + dompurify
