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
  degreeLine: '软件工程 · 本科生',

  // 正文标题下的三行信息
  position: '本科生 @ 西南大学 计算机与信息科学学院 软件学院',
  email: 'daomanliu@163.com',
  office: '0xDD 李园一舍',
  location: '中国 · 重庆',

  // 侧栏与页脚的入口，icon 可选：github / blog / mail / scholar / cv / link
  links: [
    { label: 'GitHub', icon: 'github', url: 'https://github.com/daomanliu' },
    { label: 'Google Scholar', icon: 'scholar', url: '#' },
    { label: 'Email', icon: 'mail', url: 'mailto:daomanliu@163.com' },
    { label: '博客', icon: 'blog', url: 'https://daomanliu.github.io' },
    { label: 'CV', icon: 'cv', url: '#' },
  ],

  // ---------- 关于我（每段一个字符串） ----------
  bio: [
    '我是刘道满，西南大学软件工程2025级本科生，期待的研究方向是AI基础设施。',
    '我关心的是「怎么让模型训练和推理更高效、更可靠」：从数据供给、存储与 I/O、算力调度到性能优化和可观测性，很多问题本质上都是系统问题换了个壳。比起堆功能，我更在意把一件事解释清楚，所以会把学习过程和踩过的坑写成笔记。',
    '这个页面放我的学术简介与动态；更零碎的日常在博客，欢迎顺路看看。',
  ],

  // ---------- 期待研究方向（加粗小标题 + 说明） ----------
  interests: [
    { lead: 'AI 基础设施', detail: '大模型推理加速、训练/推理系统优化、算力调度与资源管理' },
    { lead: '系统性能与可靠性', detail: '性能剖析、存储与 I/O、容错与可观测性' },
    { lead: '数据质量', detail: '实体识别、冲突消解与真值发现' }
  ],

  // ---------- 技能 ----------
  skills: [
    { lead: '语言', detail: '中文、English' },
    { lead: '开发', detail: 'C/C++、Java、Python、SQL' },
    { lead: '工具', detail: 'Git、Linux、Docker、LaTeX' },
    { lead: '其他', detail: '喜欢把学到的东西整理成能看懂的笔记' },
  ],

  // ---------- 教育经历 ----------
  education: [
    {
      period: '2025 — 至今',
      degree: '本科生',
      school: '西南大学',
      detail: '软件工程',
    },
  ],

  // ---------- 最新动态（时间新的放上面） ----------
  // text 里可以直接写链接，三种写法都支持（混着写也行）：
  //   [链接文字](https://example.com)   ← 推荐，显示的文字由你定
  //   [https://example.com]             ← 方括号里放网址，显示时会去掉 http(s)://
  //   https://example.com               ← 裸网址，也会自动变成链接
  news: [
    {
      date: '2026-11',
      tag: '项目',
      text: '给西南大学教务系统做了个自用的鸿蒙软件，[源码见 GitHub](https://github.com/daomanliu/swu-eas)。',
    },
    {
      date: '2026-11',
      tag: '项目',
      text: 'Java 课程项目，可通过 [www.daomanliu.cn](https://www.daomanliu.cn) 访问。',
    },
    { date: '2026-09', tag: '荣誉', text: '评选国家奖学金。' },
    { date: '2026-05', tag: '分享', text: '在组内做了「ATTENTION RESIDUALS」的报告。' },
    { date: '2025-11', tag: '开始', text: '加入胡莎老师的 AI 学习小组。' },
  ],

  // ---------- 论文发表 ----------
  // type: conference / journal / preprint，决定标签配色
  // authors 里带 me: true 的会加粗（一般是你自己）
  publications: [],

  // ---------- 获奖与荣誉 ----------
  awards: [
    { year: '2026', text: '第十八届全国大学生数学竞赛重庆赛区一等奖', extra: '省级' },
    { year: '2026', text: '第二十届西南大学数学建模竞赛三等奖', extra: '校级' },
    { year: '2025', text: '第十七届全国大学生数学竞赛重庆赛区一等奖', extra: '省级' },
  ],

  // ---------- 学术服务 ----------
  services: [],

  // ---------- 教学经历（留空数组则整块隐藏） ----------
  teaching: [],

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
