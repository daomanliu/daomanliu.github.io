# 个人简介页（resume）

学术风格的个人简介页，样式参考常见的高校 / 实验室个人主页（左侧栏 + 衬线正文）。
独立的 Vite + Vue 3 子站，部署后地址是 **<https://daomanliu.github.io/resume/>**。

## 改内容

只有一个文件需要动：

```
src/data/profile.js
```

姓名、头衔、邮箱、办公室、简介、研究方向、技能、教育经历、最新动态、论文、奖项、学术服务、教学经历，全在里面，每项都有注释。标了「示例」的地方记得换成真实信息。

其他常用改动：

| 想改什么 | 改哪里 |
| --- | --- |
| 头像 | 替换 `src/assets/avatar.jpg`（建议正方形，400×400 以上） |
| 配色 / 字体 / 间距 | `src/style.css` 顶部的 CSS 变量 |
| 顶部导航项 | `src/data/profile.js` 里的 `navItems` |
| 页面标题 / SEO 描述 | `index.html` |
| 浏览器标签小图标 | `public/favicon.svg` |

论文条目里 `authors` 中带 `me: true` 的那个人会自动加粗，改成你名字的写法即可。

## 本地开发

```bash
# 首次安装依赖
npm --prefix resume install

# 开发服务器（http://localhost:5174/resume/）
npm run resume:dev        # 在仓库根目录执行

# 构建（产物在 resume/dist）
npm run resume:build
```

## 部署

仓库根目录的 GitHub Actions 已经接好了，push 到 `main` 就会：

1. `npm --prefix resume ci` + `npm run resume:build` → 生成 `resume/dist`
2. 根站 `npm run build` → 生成 `dist`，其 `postbuild` 调 `scripts/copy-resume.js` 把 `resume/dist` 复制进 `dist/resume`
3. 上传整个 `dist` 到 GitHub Pages

因此线上路径是 `/resume/`，和 `vite.config.js` 里的 `base: '/resume/'` 对应。**这两处必须一致**，否则样式和脚本会 404。

如果以后想换地址（比如 `daomanliu.github.io/about/`），改三处：`vite.config.js` 的 `base`、`scripts/copy-resume.js` 里的目标目录名、根站里指向它的链接。

## 还有点小心思

- **暗色模式**：右上角切换，跟随系统偏好，选择记在 localStorage
- **打印成 PDF**：`Ctrl/⌘ + P` 直接存，导航、入动效自动关掉，适合当简历附件
- **滚动入场动画**：只对能滚到的区块生效，系统开了「减少动态效果」就直接显示
- **零第三方 UI 依赖**：只有一个 `vue`，图标是内联 SVG（`src/components/AppIcon.vue`）

## 目录

```
resume/
├── index.html
├── vite.config.js            # base: '/resume/'
├── public/favicon.svg
└── src/
    ├── App.vue               # 页面骨架：侧栏 + 内容区
    ├── main.js
    ├── style.css             # 设计变量 + 全局样式
    ├── data/profile.js       # ★ 所有文字内容
    ├── assets/avatar.jpg
    ├── composables/useTheme.js
    ├── directives/reveal.js  # v-reveal 入场动画
    └── components/
        ├── AppHeader.vue       # 顶部导航 + 阅读进度
        ├── SidebarProfile.vue  # 左侧头像栏
        ├── ProfileHead.vue     # 姓名 / 头衔 / 邮箱
        ├── SectionBlock.vue    # 小节标题 + 内容
        ├── NewsList.vue
        ├── PublicationList.vue
        ├── TimelineList.vue    # 教育经历
        ├── InfoList.vue        # 奖项 / 服务 / 教学
        ├── AppFooter.vue
        └── AppIcon.vue
```
