<script setup>
defineProps({
  items: { type: Array, default: () => [] },
})
</script>

<template>
  <ul class="timeline">
    <li v-for="(item, index) in items" :key="index" class="row">
      <span class="period">{{ item.period }}</span>
      <span class="text">
        <b>{{ item.degree }}</b>
        <span class="school">{{ item.school }}</span>
        <span v-if="item.detail" class="detail">{{ item.detail }}</span>
      </span>
    </li>
  </ul>
</template>

<style scoped>
.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}

.row {
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr);
  gap: 16px;
  padding: 7px 0;
  font-size: 15.5px;
  line-height: 1.75;
}

.period {
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--text-faint);
  padding-top: 3px;
  font-variant-numeric: tabular-nums;
}

.school {
  margin-left: 10px;
  color: var(--text-soft);
}

.detail {
  display: block;
  font-size: 14px;
  color: var(--text-faint);
  line-height: 1.7;
}

@media (max-width: 560px) {
  .row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
