<script setup>
defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  en: { type: String, default: '' },
})
</script>

<template>
  <section :id="id" v-reveal class="block">
    <h2 class="section-title">
      <span>{{ title }}</span>
      <span v-if="en" class="en">{{ en }}</span>
    </h2>
    <slot />
  </section>
</template>

<style scoped>
.block {
  padding: 30px 0 0;
  scroll-margin-top: 84px;
}

.block:last-child {
  padding-bottom: 0;
}
</style>
