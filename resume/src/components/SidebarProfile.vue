<script setup>
import AppIcon from '@/components/AppIcon.vue'
import { profile } from '@/data/profile'

// 邮箱在页面上写成 xxx [AT] yyy，避免被爬虫直接抓走
const emailText = profile.email.replace('@', ' [AT] ')
// 邮箱单独占一行，这里就不重复列「Email」入口了
const sidebarLinks = profile.links.filter((link) => link.icon !== 'mail')
</script>

<template>
  <aside class="sidebar no-print">
    <img class="photo" :src="profile.avatar" :alt="`${profile.name} 的照片`" />

    <p class="name">{{ profile.name }}</p>
    <p class="degree">{{ profile.degreeLine }}</p>

    <div class="divider" aria-hidden="true"></div>

    <ul class="contact">
      <li class="contact-item contact-item--static">
        <AppIcon name="pin" :size="14" />
        <span>{{ profile.location }}</span>
      </li>
      <li v-for="link in sidebarLinks" :key="link.label" class="contact-item">
        <AppIcon :name="link.icon" :size="14" />
        <a :href="link.url" target="_blank" rel="noopener">{{ link.label }}</a>
      </li>
      <li class="contact-item contact-item--static">
        <AppIcon name="mail" :size="14" />
        <a :href="`mailto:${profile.email}`">{{ emailText }}</a>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 92px;
  align-self: start;
}

.photo {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  object-position: center 20%;
  border: 1px solid var(--line);
  border-radius: 3px;
  filter: grayscale(0.08);
  transition: filter 0.3s ease;
}

.photo:hover {
  filter: none;
}

.name {
  margin: 16px 0 4px;
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.degree {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-soft);
}

.divider {
  height: 1px;
  background: var(--line);
  margin: 18px 0 16px;
}

.contact {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 9px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--text-soft);
  line-height: 1.5;
  min-width: 0;
}

.contact-item :deep(svg) {
  flex: none;
  color: var(--text-faint);
}

.contact-item a {
  color: var(--text-soft);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contact-item a:hover {
  color: var(--accent);
  text-decoration: none;
}

.contact-item--static span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 820px) {
  .sidebar {
    position: static;
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    grid-template-areas:
      'photo name'
      'photo degree'
      'photo contact';
    gap: 2px 16px;
    align-items: start;
    padding-bottom: 22px;
    border-bottom: 1px solid var(--line);
  }
  .photo {
    grid-area: photo;
    width: 96px;
  }
  .name {
    grid-area: name;
    margin-top: 2px;
  }
  .degree {
    grid-area: degree;
  }
  .divider {
    display: none;
  }
  .contact {
    grid-area: contact;
    margin-top: 8px;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  .contact-item a {
    overflow: visible;
    text-overflow: clip;
    white-space: normal;
    overflow-wrap: anywhere;
  }
}
</style>
