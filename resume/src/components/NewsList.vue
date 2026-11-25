<script setup>
defineProps({
  items: { type: Array, default: () => [] },
})

// 把一句动态切成「文字 / 链接」片段，链接会渲染成可点的 <a>。
// 支持三种写法（随便挑一种，混着写也行）：
//   [标签](https://example.com)   ← 推荐，链接文字由你定
//   [https://example.com]         ← 方括号里直接放网址
//   https://example.com           ← 裸网址，也会自动变成链接
const LINK_PATTERN =
  /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\[(https?:\/\/[^\s\]]+)\]|(https?:\/\/[^\s<>"'，。；：）】]+)/g

function stripProtocol(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/+$/, '')
}

function tokenize(text = '') {
  const source = String(text)
  const tokens = []
  let cursor = 0

  for (const match of source.matchAll(LINK_PATTERN)) {
    if (match.index > cursor) tokens.push({ type: 'text', value: source.slice(cursor, match.index) })

    if (match[1] && match[2]) {
      // [标签](网址)
      tokens.push({ type: 'link', label: match[1], url: match[2] })
    } else {
      // [网址] 或裸网址：显示时去掉协议头，省点横向空间
      const url = match[3] || match[4]
      tokens.push({ type: 'link', label: stripProtocol(url), url })
    }

    cursor = match.index + match[0].length
  }

  if (cursor < source.length) tokens.push({ type: 'text', value: source.slice(cursor) })
  return tokens
}
</script>

<template>
  <ul class="news">
    <li v-for="(item, index) in items" :key="index" class="item">
      <span class="date">{{ item.date }}</span>
      <span v-if="item.tag" class="pill">{{ item.tag }}</span>
      <span class="text">
        <template v-for="(token, i) in tokenize(item.text)" :key="i">
          <a
            v-if="token.type === 'link'"
            :href="token.url"
            class="news-link"
            target="_blank"
            rel="noopener"
            >{{ token.label }}</a
          >
          <template v-else>{{ token.value }}</template>
        </template>
      </span>
    </li>
  </ul>
</template>

<style scoped>
.news {
  list-style: none;
  margin: 0;
  padding: 0;
}

.item {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 5px 0;
  font-size: 15.5px;
  line-height: 1.8;
}

.date {
  flex: none;
  width: 66px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;
}

.text {
  min-width: 0;
}

.news-link {
  color: var(--accent);
  border-bottom: 1px solid var(--accent-line);
  transition: border-color 0.16s ease;
  word-break: break-word;
}

.news-link:hover {
  text-decoration: none;
  border-bottom-color: var(--accent);
}

@media (max-width: 560px) {
  .item {
    flex-wrap: wrap;
    gap: 2px 8px;
  }
  .text {
    flex-basis: 100%;
    font-size: 15px;
  }
}
</style>
