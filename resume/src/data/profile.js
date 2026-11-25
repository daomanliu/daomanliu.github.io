// ============================================================================
//  个人简介 · 内容配置文件
//  ---------------------------------------------------------------------------
//  整页的文字都在这里，改这一个文件就够了，组件不用动。
//  标了「示例」的地方换成你的真实信息（学校、导师、论文、奖项…）。
// ============================================================================

import avatarUrl from '@/assets/avatar.jpg'

export const profile = {
  // ---------- 基本信息 ----------
  name: '刘道满',
  nameEn: 'Daoman LIU',
  avatar: avatarUrl,

  // 头像下方的两行小字
  degreeLine: '计算机科学与技术 · 硕士研究生',

  // 正文标题下的三行信息
  position: '硕士研究生 @ 某某大学 计算机科学与技术学院',
  email: 'daomanliu@example.com', // 示例邮箱，务必改成你自己的
  office: '某某楼 402 室',
  advisor: '某某 教授（示例）',
  location: '中国 · 广州',

  // 侧栏与页脚的入口，icon 可选：github / blog / mail / scholar / cv / link
  links: [
    { label: 'GitHub', icon: 'github', url: 'https://github.com/daomanliu' },
    { label: 'Google Scholar', icon: 'scholar', url: 'https://scholar.google.com/citations?user=YOUR_ID' },
    { label: 'Email', icon: 'mail', url: 'mailto:daomanliu@example.com' },
    { label: '博客', icon: 'blog', url: 'https://daomanliu.github.io' },
    { label: 'CV', icon: 'cv', url: '#' },
  ],

  // ---------- 关于我（每段一个字符串） ----------
  bio: [
    '我是刘道满，某某大学计算机科学与技术学院硕士研究生，研究方向是数据库系统与数据管理。',
    '我关心的是「怎么让数据快一点、准一点」：从查询优化到数据质量管理，都是差不多的问题换了个壳。比起堆功能，我更在意把一件事解释清楚，所以会把学习过程和踩过的坑写成笔记。',
    '这个页面放我的学术简介与动态；更零碎的日常在博客，欢迎顺路看看。',
  ],

  // ---------- 研究方向（加粗小标题 + 说明） ----------
  interests: [
    { lead: 'AI for DB/SYS', detail: 'learned index、learned query optimizer、data-driven DBMS 等' },
    { lead: 'DB/SYS for AI', detail: '大模型推理加速、AI 基础设施等' },
    { lead: '数据质量', detail: '实体识别、冲突消解与真值发现' },
  ],

  // ---------- 技能 ----------
  skills: [
    { lead: '语言', detail: '中文、English' },
    { lead: '开发', detail: 'C/C++、Java、Python、JavaScript、SQL' },
    { lead: '工具', detail: 'Git、Linux、Docker、LaTeX' },
    { lead: '其他', detail: '喜欢把学到的东西整理成能看懂的笔记' },
  ],

  // ---------- 教育经历 ----------
  education: [
    {
      period: '2024 — 至今',
      degree: '硕士研究生',
      school: '某某大学',
      detail: '计算机科学与技术 · 导师：某某教授',
    },
    {
      period: '2020 — 2024',
      degree: '工学学士',
      school: '某某大学',
      detail: '计算机科学与技术',
    },
  ],

  // ---------- 最新动态（时间新的放上面） ----------
  news: [
    { date: '2026-11', tag: '论文', text: '一篇关于查询优化的论文被某某会议接收（示例）。' },
    { date: '2026-09', tag: '荣誉', text: '获得某某奖学金（示例）。' },
    { date: '2026-06', tag: '分享', text: '在组内做了「关系代数与 SQL 等价改写」的报告（示例）。' },
    { date: '2026-03', tag: '开始', text: '加入某某实验室，进入研究生阶段（示例）。' },
  ],

  // ---------- 论文发表 ----------
  // type: conference / journal / preprint，决定标签配色
  // authors 里带 me: true 的会加粗（一般是你自己）
  publications: [
    {
      year: '2026',
      venue: 'SIGMOD',
      type: 'conference',
      authors: [
        { name: 'Daoman LIU', me: true },
        { name: 'Someone Else' },
        { name: 'Advisor Name' },
      ],
      title: 'A Sample Paper Title About Query Optimization on Modern Hardware',
      note: 'CCF-A 会议（示例条目，记得替换）',
      links: [
        { label: 'PDF', url: '#' },
        { label: 'Code', url: '#' },
      ],
    },
    {
      year: '2025',
      venue: 'VLDBJ',
      type: 'journal',
      authors: [
        { name: 'Someone Else' },
        { name: 'Daoman LIU', me: true },
      ],
      title: 'Another Sample Journal Paper on Data Quality Assessment',
      note: '共同作者（示例条目，记得替换）',
      links: [{ label: 'PDF', url: '#' }],
    },
    {
      year: '2025',
      venue: 'arXiv',
      type: 'preprint',
      authors: [{ name: 'Daoman LIU', me: true }],
      title: 'A Sample Preprint on Efficient Retrieval over Knowledge Graphs',
      note: '预印本（示例条目，记得替换）',
      links: [
        { label: 'arXiv', url: '#' },
        { label: 'BibTeX', url: '#' },
      ],
    },
  ],

  // ---------- 获奖与荣誉 ----------
  awards: [
    { year: '2026', text: '某某奖学金（示例）', extra: '校级' },
    { year: '2025', text: '某某学科竞赛二等奖（示例）', extra: '国家级' },
    { year: '2024', text: '优秀本科毕业生（示例）', extra: '校级' },
  ],

  // ---------- 学术服务 ----------
  services: [{ text: '某某会议 / 期刊审稿人（示例）', period: '2025 — 至今' }],

  // ---------- 教学经历（留空数组则整块隐藏） ----------
  teaching: [{ text: '《数据库系统概论》课程助教（示例）', period: '2025 秋' }],

  // ---------- 页脚 ----------
  updatedAt: '2026-11-25',
  footerNote: 'Powered by Vue 3 + Vite · 静态托管在 GitHub Pages',
}

// 顶部导航：id 对应页面里的 section 锚点；href 则直接外链
export const navItems = [
  { id: 'about', label: '简介' },
  { id: 'news', label: '动态' },
  { id: 'publications', label: '论文' },
  { id: 'awards', label: '荣誉' },
  { id: 'contact', label: '联系' },
  { label: '博客', href: 'https://daomanliu.github.io', external: true },
]
