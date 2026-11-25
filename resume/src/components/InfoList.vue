<script setup>
// 通用的「时间 + 文字 + 备注」列表，奖项 / 服务 / 教学共用
defineProps({
  items: { type: Array, default: () => [] },
  keyField: { type: String, default: 'year' },
})
</script>

<template>
  <ul class="list">
    <li v-for="(item, index) in items" :key="index" class="row">
      <span class="key">{{ item[keyField] }}</span>
      <span class="text">
        {{ item.text }}
        <span v-if="item.extra" class="extra">{{ item.extra }}</span>
      </span>
    </li>
  </ul>
</template>

<style scoped>
.list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.row {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 6px 0;
  font-size: 15.5px;
  line-height: 1.75;
}

.key {
  flex: none;
  width: 92px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;
}

.text {
  min-width: 0;
}

.extra {
  margin-left: 8px;
  font-family: var(--font-sans);
  font-size: 11.5px;
  color: var(--text-faint);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 0 6px;
}

@media (max-width: 560px) {
  .row {
    flex-wrap: wrap;
    gap: 0 10px;
  }
  .key {
    width: 100%;
  }
}
</style>
