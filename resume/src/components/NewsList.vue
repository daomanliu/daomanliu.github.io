<script setup>
defineProps({
  items: { type: Array, default: () => [] },
})
</script>

<template>
  <ul class="news">
    <li v-for="(item, index) in items" :key="index" class="item">
      <span class="date">{{ item.date }}</span>
      <span v-if="item.tag" class="pill">{{ item.tag }}</span>
      <span class="text">{{ item.text }}</span>
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
  color: var(--text);
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
