<script setup>
// 极简线性图标集：不引第三方图标库，省一个依赖
const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 16 },
})

const ICONS = {
  github: {
    fill: true,
    body: '<path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.9 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z"/>',
  },
  mail: {
    fill: false,
    body: '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3.5 6.5 8.5 6 8.5-6"/>',
  },
  pin: {
    fill: false,
    body: '<path d="M12 21s6.5-5.4 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z"/><circle cx="12" cy="10.3" r="2.4"/>',
  },
  scholar: {
    fill: false,
    body: '<path d="M22 9.2 12 3.8 2 9.2l10 5.4 10-5.4Z"/><path d="M6 11.8V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.2"/>',
  },
  cv: {
    fill: false,
    body: '<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8Z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 16.5h4"/>',
  },
  blog: {
    fill: false,
    body: '<path d="M4 6h16M4 12h16M4 18h10"/>',
  },
  link: {
    fill: false,
    body: '<path d="M10 13.5a4.5 4.5 0 0 0 6.8.5l2.2-2.2a4.5 4.5 0 0 0-6.4-6.4l-1.5 1.4"/><path d="M14 10.5a4.5 4.5 0 0 0-6.8-.5L5 12.2a4.5 4.5 0 0 0 6.4 6.4l1.4-1.4"/>',
  },
  sun: {
    fill: false,
    body: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  },
  moon: {
    fill: false,
    body: '<path d="M20.5 13.3A8.5 8.5 0 1 1 10.7 3.5a6.6 6.6 0 0 0 9.8 9.8Z"/>',
  },
  arrow: {
    fill: false,
    body: '<path d="M5 12h13M12.5 6l6 6-6 6"/>',
  },
}

const icon = ICONS[props.name] ?? ICONS.link
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="icon.fill ? 'currentColor' : 'none'"
    :stroke="icon.fill ? 'none' : 'currentColor'"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    v-html="icon.body"
  />
</template>
