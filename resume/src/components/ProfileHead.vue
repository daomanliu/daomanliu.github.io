<script setup>
import { profile } from '@/data/profile'

// 参考站写法：Email 写成 xxx [AT] yyy
const emailText = profile.email.replace('@', ' [AT] ')
</script>

<template>
  <header id="top" class="head">
    <h1 class="name">
      {{ profile.name }}
      <span class="name-en">{{ profile.nameEn }}</span>
    </h1>

    <p class="meta-line meta-line--strong">{{ profile.position }}</p>
    <p class="meta-line"><b>Email</b>: <a :href="`mailto:${profile.email}`">{{ emailText }}</a></p>
    <p class="meta-line"><b>Office</b>: {{ profile.office }}</p>
    <p v-if="profile.advisor" class="meta-line"><b>Advisor</b>: {{ profile.advisor }}</p>
  </header>
</template>

<style scoped>
.head {
  scroll-margin-top: 84px;
}

.name {
  margin: 0 0 18px;
  font-family: var(--font-serif);
  font-size: clamp(1.85rem, 3.6vw, 2.3rem);
  font-weight: 700;
  letter-spacing: 0.005em;
  line-height: 1.25;
}

.name-en {
  margin-left: 10px;
  font-size: 0.52em;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: var(--text-faint);
  white-space: nowrap;
}

.meta-line {
  margin: 0 0 5px;
  font-size: 15.5px;
  line-height: 1.75;
  color: var(--text-soft);
}

.meta-line--strong {
  font-weight: 700;
  color: var(--text);
}

.meta-line b {
  color: var(--text);
  font-weight: 700;
}

.meta-line a {
  border-bottom: 1px solid var(--accent-line);
}

.meta-line a:hover {
  text-decoration: none;
  border-bottom-color: var(--accent);
}
</style>
