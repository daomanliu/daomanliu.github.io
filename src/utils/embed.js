// Markdown 中的 <iframe> 嵌入支持（B 站 / YouTube 等）
// DOMPurify 默认会把 <iframe> 整段删掉，所以统一在这里：
//   1) 把 iframe 及其常用属性加进白名单（EMBED_SANITIZE_OPTIONS）；
//   2) 在消毒过程中逐个校验来源，只放行白名单站点；
//   3) 给放行的 iframe 补上样式类，让播放器自适应正文宽度。
// 不在白名单里的 iframe 不会静默消失，而是换成一条可点击的提示。
//
// 想支持新的站点：把域名加进 EMBED_HOSTS 即可（按后缀匹配，子域名自动放行）；
// 如果它也是以 16:9 播放的视频站，再把域名加进 VIDEO_EMBED_HOSTS。

// 允许嵌入的站点（按域名后缀匹配，含所有子域名）
export const EMBED_HOSTS = [
  'bilibili.com', // B 站（player.bilibili.com）
  'youtube.com', // YouTube
  'youtube-nocookie.com',
  'vimeo.com',
  'youku.com', // 优酷
  'iqiyi.com', // 爱奇艺
  'v.qq.com', // 腾讯视频
  'tv.sohu.com', // 搜狐视频
  'acfun.cn', // A 站
  'douyin.com', // 抖音
  'ixigua.com', // 西瓜视频
  'music.163.com', // 网易云音乐
  'y.qq.com', // QQ 音乐（i.y.qq.com 外链播放器）
  'open.spotify.com', // Spotify
  'player.twitch.tv',
  'codepen.io', // CodePen
  'jsfiddle.net',
  'docs.google.com', // Google 文档 / 表单
  'drive.google.com',
  'amap.com', // 高德地图
  'map.baidu.com'
]

// 视频站：按 16:9 自适应宽度显示
export const VIDEO_EMBED_HOSTS = [
  'bilibili.com',
  'youtube.com',
  'youtube-nocookie.com',
  'vimeo.com',
  'youku.com',
  'iqiyi.com',
  'v.qq.com',
  'tv.sohu.com',
  'acfun.cn',
  'douyin.com',
  'ixigua.com',
  'player.twitch.tv'
]

// DOMPurify 配置：放行 iframe 标签 + 嵌入播放器常用的属性
// （allowfullscreen 等不在 DOMPurify 默认属性白名单里，必须显式声明）
export const EMBED_SANITIZE_OPTIONS = {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: [
    'allow',
    'allowfullscreen',
    'frameborder',
    'framespacing',
    'scrolling',
    'referrerpolicy',
    'loading',
    'webkitallowfullscreen',
    'mozallowfullscreen',
    'marginwidth',
    'marginheight'
  ]
}

// 域名后缀匹配：bilibili.com 同时放行 player.bilibili.com
function matchHost(hostname, list) {
  const host = String(hostname || '').toLowerCase()
  if (!host) return false
  return list.some((entry) => host === entry || host.endsWith('.' + entry))
}

// 同源地址（博客自己放在 public/ 里的页面）也允许嵌入
function isSameOrigin(url) {
  try {
    return typeof location !== 'undefined' && !!location.origin && url.origin === location.origin
  } catch (e) {
    return false
  }
}

function isVideoEmbed(url) {
  return matchHost(url.hostname, VIDEO_EMBED_HOSTS)
}

// 统一成绝对地址：协议相对的 //player.bilibili.com/... 补成 https，
// 白名单站点的 http 地址升级成 https（本地 http 预览下也能正常加载）
function normalizeSrc(raw, url, sameOrigin) {
  if (raw.startsWith('//')) return 'https:' + raw
  if (!sameOrigin && url.protocol === 'http:') return 'https://' + raw.replace(/^http:\/\//i, '')
  return url.href
}

// 被拦下的 iframe 换成一条提示（而不是直接删掉，方便作者发现写错了）
function replaceWithFallback(el, url, reason) {
  const doc = el.ownerDocument
  const box = doc.createElement('span')
  box.className = 'markdown-embed-fallback'
  box.appendChild(doc.createTextNode('无法嵌入 iframe：' + reason + '。'))
  if (url) {
    const link = doc.createElement('a')
    link.setAttribute('href', url.href)
    link.setAttribute('rel', 'noopener noreferrer')
    link.textContent = url.href
    box.appendChild(doc.createTextNode(' '))
    box.appendChild(link)
  }
  el.replaceWith(box)
}

// DOMPurify 的 afterSanitizeAttributes 钩子：逐个处理 <iframe>
// （此时属性已经过消毒，src 保留的才是安全协议）
export function applyEmbedGuards(el) {
  if (!el) return

  // 提示里的链接要新窗口打开。
  // DOMPurify 默认会去掉 target（包括我们刚插入的节点），
  // 所以在这个钩子里补回来——此时该 <a> 的属性已经消毒完毕。
  if (el.tagName === 'A' && el.parentElement?.classList?.contains('markdown-embed-fallback')) {
    el.setAttribute('target', '_blank')
    return
  }

  if (el.tagName !== 'IFRAME') return

  const raw = (el.getAttribute('src') || '').trim()
  if (!raw) {
    el.remove()
    return
  }

  let url = null
  try {
    url = new URL(raw, el.ownerDocument?.baseURI || undefined)
  } catch (e) {
    url = null
  }
  if (!url || (url.protocol !== 'http:' && url.protocol !== 'https:')) {
    replaceWithFallback(el, null, '嵌入了非 http(s) 的地址')
    return
  }

  const sameOrigin = isSameOrigin(url)
  if (!sameOrigin && !matchHost(url.hostname, EMBED_HOSTS)) {
    replaceWithFallback(el, url, '站点 ' + url.hostname + ' 不在允许嵌入的名单里')
    return
  }

  el.setAttribute('src', normalizeSrc(raw, url, sameOrigin))
  if (!el.hasAttribute('loading')) el.setAttribute('loading', 'lazy')
  if (!el.hasAttribute('frameborder')) el.setAttribute('frameborder', '0')
  if (!el.hasAttribute('title')) el.setAttribute('title', '嵌入内容：' + url.hostname)

  el.classList.add('markdown-embed')
  if (isVideoEmbed(url)) el.classList.add('embed-video')
}
