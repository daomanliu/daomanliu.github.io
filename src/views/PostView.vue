<template>
  <div class="post-page">
    <a-spin :spinning="loading">
      <template v-if="post">
        <div class="post-header">
          <h1 class="post-title">{{ post.meta.title || slug }}</h1>
          <div class="post-meta">
            <span>{{ post.meta.date }}</span>
            <a-tag v-for="t in post.meta.tags" :key="t" color="blue">{{ t }}</a-tag>
          </div>
        </div>
        <div class="post-content markdown-body" v-html="html"></div>
        <div class="post-nav">
          <a-button @click="router.push('/')"><ArrowLeftOutlined /> 返回首页</a-button>
        </div>
      </template>
      <a-result v-else-if="!loading" status="404" title="文章不存在" sub-title="可能已被删除或移动">
        <template #extra>
          <a-button type="primary" @click="router.push('/')">回到首页</a-button>
        </template>
      </a-result>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { renderMarkdown } from '@/utils/markdown'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const store = usePostsStore()

const post = ref(null)
const loading = ref(true)
const slug = computed(() => String(route.params.slug || ''))

const html = computed(() => (post.value ? renderMarkdown(post.value.content) : ''))

watch(slug, async (s) => {
  loading.value = true
  post.value = null
  try {
    post.value = await store.loadPost(s)
    document.title = `${post.value.meta.title || s} - ${document.title.split(' - ').pop()}`
  } catch (e) {
    post.value = null
  } finally {
    loading.value = false
  }
  window.scrollTo(0, 0)
}, { immediate: true })
</script>

<style scoped>
.post-page {
  background: #fff;
  border-radius: 10px;
  padding: 32px 40px;
  border: 1px solid #eee;
  min-height: 400px;
}
.post-header {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
  margin-bottom: 24px;
}
.post-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 12px;
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
  font-size: 13px;
}
.post-nav {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
@media (max-width: 640px) {
  .post-page { padding: 20px; }
}
</style>
