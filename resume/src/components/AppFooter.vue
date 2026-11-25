<script setup>
import AppIcon from '@/components/AppIcon.vue'
import { profile } from '@/data/profile'

const year = new Date().getFullYear()
const followLinks = profile.links.filter((link) => ['GitHub', '博客'].includes(link.label))
</script>

<template>
  <footer class="band">
    <div class="inner">
      <div class="row">
        <span class="follow-label">FOLLOW</span>
        <a
          v-for="link in followLinks"
          :key="link.label"
          :href="link.url"
          target="_blank"
          rel="noopener"
          class="follow"
        >
          <AppIcon :name="link.icon" :size="13" />
          {{ link.label.toUpperCase() }}
        </a>
      </div>
      <p class="copyright">
        © {{ year }} {{ profile.name }} · 更新于 {{ profile.updatedAt }} · {{ profile.footerNote }}
      </p>
    </div>
  </footer>
</template>

<style scoped>
.band {
  margin-top: 64px;
  background: var(--bg-soft);
  border-top: 1px solid var(--line);
}

.inner {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 30px 32px 40px;
}

.row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.follow-label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  color: var(--text-faint);
}

.follow {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--text-soft);
}

.follow:hover {
  color: var(--accent);
  text-decoration: none;
}

.copyright {
  margin: 14px 0 0;
  font-family: var(--font-sans);
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-faint);
}

@media (max-width: 820px) {
  .inner {
    padding: 26px 20px 34px;
  }
}
</style>
