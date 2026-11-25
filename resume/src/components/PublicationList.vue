<script setup>
defineProps({
  items: { type: Array, default: () => [] },
})

const TYPE_LABEL = {
  conference: '会议',
  journal: '期刊',
  preprint: '预印本',
}
</script>

<template>
  <ol class="pubs">
    <li v-for="(pub, index) in items" :key="index" class="pub">
      <div class="year">{{ pub.year }}</div>
      <div class="main">
        <p class="authors">
          <template v-for="(author, i) in pub.authors" :key="i">
            <span :class="{ me: author.me }">{{ author.name }}</span>
            <span v-if="i < pub.authors.length - 1">, </span>
          </template>
        </p>

        <h3 class="title">{{ pub.title }}</h3>

        <p class="meta">
          <span class="venue" :class="`venue--${pub.type || 'conference'}`">
            {{ TYPE_LABEL[pub.type] || '会议' }} · {{ pub.venue }}
          </span>
          <span v-if="pub.note" class="note">{{ pub.note }}</span>
        </p>

        <p v-if="pub.links?.length" class="links">
          <a
            v-for="link in pub.links"
            :key="link.label"
            :href="link.url"
            :class="{ ghost: link.url === '#' }"
            target="_blank"
            rel="noopener"
          >
            [{{ link.label }}]
          </a>
        </p>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.pubs {
  list-style: none;
  margin: 0;
  padding: 0;
}

.pub {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px dashed var(--line);
}

.pub:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.year {
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--text-faint);
  padding-top: 4px;
  font-variant-numeric: tabular-nums;
}

.authors {
  margin: 0 0 4px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-soft);
}

.authors .me {
  font-weight: 700;
  color: var(--text);
}

.title {
  margin: 0 0 6px;
  font-family: var(--font-serif);
  font-size: 16.5px;
  font-weight: 700;
  line-height: 1.6;
  color: var(--text);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  font-size: 13px;
  color: var(--text-faint);
}

.venue {
  font-family: var(--font-sans);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: 4px;
  padding: 1px 7px;
}

.venue--journal {
  color: var(--green);
  background: var(--green-soft);
}

.venue--preprint {
  color: var(--amber);
  background: var(--amber-soft);
}

.note {
  color: var(--text-faint);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 8px 0 0;
  font-size: 13.5px;
}

.links a {
  color: var(--accent);
}

.links a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.links .ghost {
  color: var(--text-faint);
}

@media (max-width: 560px) {
  .pub {
    grid-template-columns: 1fr;
    gap: 2px;
  }
  .year {
    padding-top: 0;
  }
}
</style>
