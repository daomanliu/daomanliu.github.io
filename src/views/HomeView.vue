<template>
  <div class="home">
    <!-- 博客简介 -->
    <section class="hero">
      <h1 class="hero-title">{{ cfg.title }}</h1>
      <p class="hero-subtitle">{{ cfg.subtitle }}</p>
    </section>

    <!-- 搜索 -->
    <div class="filter-bar">
      <a-input-search
        v-model:value="store.searchQuery"
        placeholder="搜索文章标题 / 摘要 / 标签"
        allow-clear
        style="max-width: 360px"
        @search="onSearch"
      />
    </div>

    <!-- 当前筛选提示 -->
    <div v-if="store.activeTag" class="active-filter">
      已按标签 <b>{{ store.activeTag }}</b> 筛选，共 {{ store.publishedPosts.length }} 篇
      <a class="clear-btn" @click="store.activeTag = ''">清除</a>
    </div>

    <!-- 文章列表 -->
    <a-spin :spinning="store.loading && !store.loaded">
      <div v-if="store.publishedPosts.length" class="post-list">
        <article
          v-for="p in store.publishedPosts"
          :key="p.slug"
          class="post-card"
          @click="goPost(p.slug)"
        >
          <div class="post-date">{{ p.date }}</div>
          <h2 class="post-title">{{ p.title }}</h2>
          <p v-if="p.summary" class="post-summary">{{ p.summary }}</p>
          <div class="post-tags" v-if="p.tags?.length">
            <a-tag v-for="t in p.tags" :key="t" color="blue">{{ t }}</a-tag>
          </div>
        </article>
      </div>
      <a-empty v-else description="没有匹配的文章" style="padding: 64px 0" />
    </a-spin>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { blogConfig as cfg } from '@/config/blog'

const store = usePostsStore()
const router = useRouter()

onMounted(() => store.loadIndex())

function onSearch() {
  // 搜索时清掉标签筛选，两者同时生效容易筛出 0 条让人困惑
  if (store.searchQuery.trim()) store.activeTag = ''
}

function goPost(slug) {
  router.push({ name: 'post', params: { slug } })
}
</script>

<style scoped>
/* 标题居中 */
.hero {
  text-align: center;
  padding: 40px 0 16px;
}
.hero-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px;
}
.hero-subtitle {
  color: #888;
  margin: 0;
}

/* 文章区 */
.filter-bar {
  margin-bottom: 16px;
}
.active-filter {
  font-size: 13px;
  color: #666;
  background: #f0f7ff;
  border: 1px solid #d6e8ff;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 16px;
}
.active-filter b {
  color: #1890ff;
}
.clear-btn {
  margin-left: 8px;
  color: #1890ff;
  cursor: pointer;
}
.post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.post-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px 24px;
  cursor: pointer;
  border: 1px solid #eee;
  transition: box-shadow 0.2s, transform 0.2s;
}
.post-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
.post-date {
  font-size: 13px;
  color: #999;
  margin-bottom: 4px;
}
.post-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 8px;
}
.post-card:hover .post-title {
  color: #1890ff;
}
.post-summary {
  color: #666;
  font-size: 14px;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
</style>
