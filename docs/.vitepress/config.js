import { defineConfig } from 'vitepress'
import path from 'node:path'
import { getGitInfo } from './git-contributors.mjs'

// https://vitepress.dev/reference/site-config
// 仅简体中文（默认 root locale）

// ---------------- 简体中文 ----------------
const zhNav = [
  { text: '首页', link: '/' },
  {
    text: '入门指南',
    items: [
      { text: '快速开始', link: '/guide/getting-started' },
      { text: '安装与登录', link: '/guide/installation' },
      { text: '对话界面', link: '/guide/chat' },
      { text: '完整教程', link: '/guide/tutorial' },
    ],
  },
  {
    text: '核心能力',
    items: [
      { text: '技能 Skills', link: '/guide/skills' },
      { text: '连接器 Connectors', link: '/guide/connectors' },
      { text: '自动化 Automations', link: '/guide/automations' },
      { text: '记忆系统 Memory', link: '/guide/memory' },
    ],
  },
  {
    text: '进阶',
    items: [
      { text: '前端设计 Skill', link: '/advanced/frontend-design' },
      { text: '专家中心', link: '/advanced/experts' },
    ],
  },
  { text: '下载', link: '/download' },
  { text: '贡献者', link: '/contributors' },
]

const zhSidebar = {
  '/guide/': [
    {
      text: '入门指南',
      items: [
        { text: '快速开始', link: '/guide/getting-started' },
        { text: '安装与登录', link: '/guide/installation' },
        { text: '对话界面', link: '/guide/chat' },
        { text: '工作模式', link: '/guide/modes' },
        { text: '完整教程', link: '/guide/tutorial' },
      ],
    },
    {
      text: '核心能力',
      items: [
        { text: '技能 Skills', link: '/guide/skills' },
        { text: '连接器 Connectors', link: '/guide/connectors' },
        { text: '自动化 Automations', link: '/guide/automations' },
        { text: '记忆系统 Memory', link: '/guide/memory' },
        { text: '文件与产物', link: '/guide/files' },
      ],
    },
  ],
  '/advanced/': [
    {
      text: '进阶',
      items: [
        { text: '前端设计 Skill', link: '/advanced/frontend-design' },
        { text: '专家中心', link: '/advanced/experts' },
        { text: 'MCP 配置', link: '/advanced/mcp' },
      ],
    },
  ],
}

// ---------------- 共享主题配置 ----------------
const sharedTheme = {
  logo: '/logo.png',
  socialLinks: [
    { icon: 'wechat', link: '#wechat-follow' },
    {
      icon: {
        svg: '<svg viewBox="0 0 24 24" width="24" height="24" aria-label="QQ群"><path fill="currentColor" d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673"/></svg>',
      },
      link: 'https://qm.qq.com/q/o9JGyqoWju',
    },
  ],
  search: {
    provider: 'local',
  },
}

export default defineConfig({
  title: 'WorkBuddy 教程',
  description: 'WorkBuddy AI 助手官方教程站点 —— 从入门到精通',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,

  // 构建时为每页注入 git 贡献信息（最后修改人 + 贡献者）
  transformPageData(pageData, { siteConfig }) {
    const srcDir =
      (siteConfig && siteConfig.srcDir) || path.resolve(process.cwd(), 'docs')
    const abs = path.resolve(srcDir, pageData.filePath)
    const info = getGitInfo(abs)
    if (!info) return {}
    return {
      gitLastModifier: info.last,
      gitContributors: info.contributors,
      gitContributorCount: info.count,
    }
  },

  // ★ 关键修复：VitePress 1.6.4 生成的 `rel="preload stylesheet"` 在 Chrome 等
  // 浏览器中会因 `preload` 优先级高于 `stylesheet` 而只预加载不应用样式，
  // 导致整个主题 CSS 失效（汉堡按钮跑到页面底部、导航布局崩溃）。
  // 强制改为 `rel="stylesheet"` 即可正常加载并应用。
  // ★ 关键修复（已内置到构建钩子，不再依赖 postbuild 脚本）：
  // VitePress 1.6.4 在构建产物 HTML 中输出
  //   <link rel="preload stylesheet" href="..." as="style">
  // Chrome 等浏览器会把 `preload` 的优先级看得比 `stylesheet` 高，
  // 导致主题 CSS 只被预加载而不被应用，整页无样式（汉堡按钮沉底、导航崩溃）。
  // 通过 build 阶段的 transformHtml 钩子统一改写为标准 `rel="stylesheet"`，
  // 不论用何种方式触发构建（含 `vitepress build` 直跑 / CI）都会自动生效，
  // 彻底避免“CSS 又掉了”的反复。
  transformHtml(html) {
    return html.replace(/rel="preload stylesheet"/g, 'rel="stylesheet"')
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#00d9e9' }],
    ['link', { rel: 'stylesheet', href: 'https://font.sec.miui.com/font/css?family=MiSans:400,700:MiSans' }],
    // 预连接 GitHub 头像 CDN，减少 DNS + TLS 握手延迟
    ['link', { rel: 'preconnect', href: 'https://avatars.githubusercontent.com' }],
    ['link', { rel: 'dns-prefetch', href: 'https://avatars.githubusercontent.com' }],
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        ...sharedTheme,
        nav: zhNav,
        sidebar: zhSidebar,
        footer: {
          message: '基于 VitePress 构建 · WorkBuddy 教程站 · 本站使用 MiSans 字体',
          copyright: 'Copyright © 2026 WorkBuddy',
        },
        docFooter: { prev: '上一页', next: '下一页' },
        outline: { label: '本页目录', level: [2, 3] },
        lastUpdatedText: '最后更新于',
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
      },
    },
  },
})
