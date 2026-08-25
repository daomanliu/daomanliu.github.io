<template>
  <div class="admin">
    <!-- 左侧：文章列表（可收起） -->
    <div class="sider" :class="{ collapsed: siderCollapsed }">
      <div class="sider-inner">
        <div class="sider-header">
          <span class="sider-title">文章管理</span>
          <a-button type="primary" size="small" @click="createNew">
            <PlusOutlined /> 新建
          </a-button>
        </div>
        <div class="sider-list">
          <div
            v-for="p in store.allPosts"
            :key="p.slug"
            class="sider-item"
            :class="{ active: currentSlug === p.slug }"
            @click="editPost(p.slug)"
          >
            <div class="item-title">
              <span class="item-name">{{ p.title || p.slug }}</span>
              <a-tag v-if="p.draft" color="orange" style="margin-left: 4px">草稿</a-tag>
              <a-tag v-else-if="p.modified" color="gold" style="margin-left: 4px">已修改</a-tag>
              <a-popconfirm
                v-if="p.draft || p.modified"
                :title="p.draft ? '删除这篇本地草稿？' : '撤销本地修改，恢复为已发布版本？'"
                ok-text="确定"
                cancel-text="取消"
                @confirm="removeLocalBySlug(p.slug)"
              >
                <a-button
                  type="text"
                  size="small"
                  danger
                  class="item-delete"
                  :title="p.draft ? '删除草稿' : '撤销修改'"
                  @click.stop
                >
                  <DeleteOutlined v-if="p.draft" />
                  <RollbackOutlined v-else />
                </a-button>
              </a-popconfirm>
            </div>
            <div class="item-date">{{ p.date }}</div>
          </div>
          <a-empty v-if="!store.allPosts.length" description="暂无文章" style="padding: 32px 0" />
        </div>
      </div>
    </div>

    <!-- 右侧：编辑区 -->
    <div class="editor-area" v-if="editing">
      <!-- 标题栏 -->
      <div class="editor-header">
        <a-button type="text" @click="siderCollapsed = !siderCollapsed" title="收起/展开列表">
          <MenuFoldOutlined v-if="!siderCollapsed" />
          <MenuUnfoldOutlined v-else />
        </a-button>
        <a-input
          v-model:value="meta.title"
          placeholder="输入标题..."
          :bordered="false"
          style="font-size: 20px; font-weight: bold; flex: 1;"
        />
        <a-space>
          <a-button @click="showMeta = !showMeta" title="文件名 / 日期 / 摘要">
            <InfoCircleOutlined /> 信息
          </a-button>
          <a-button @click="toggleEditorPane" :title="editorCollapsed ? '展开编辑' : '折叠编辑'">
            <ColumnWidthOutlined :rotate="editorCollapsed ? 90 : 0" />
            {{ editorCollapsed ? '展开编辑' : '折叠编辑' }}
          </a-button>
          <a-button @click="togglePreviewPane" :title="previewCollapsed ? '展开预览' : '折叠预览'">
            <ColumnWidthOutlined :rotate="previewCollapsed ? 90 : 0" />
            {{ previewCollapsed ? '展开预览' : '折叠预览' }}
          </a-button>
          <a-button type="primary" @click="save">保存</a-button>
          <a-button @click="exportMd">导出 .md</a-button>
          <a-popconfirm
            v-if="isNew || isModified"
            :title="isNew ? '删除这篇本地草稿？' : '撤销本地修改，恢复为已发布版本？'"
            ok-text="确定"
            cancel-text="取消"
            @confirm="removeLocal"
          >
            <a-button danger>{{ isNew ? '删除' : '撤销修改' }}</a-button>
          </a-popconfirm>
        </a-space>
      </div>

      <!-- 文章信息（文件名/日期/摘要），可收起 -->
      <div class="meta-bar" v-show="showMeta">
        <a-input
          v-model:value="meta.slug"
          addon-before="文件名"
          placeholder="如 my-first-post（建议小写字母/数字/连字符）"
          :disabled="!isNew"
          style="flex: 1.2"
        />
        <a-input v-model:value="meta.date" addon-before="日期" placeholder="2026-08-06" style="flex: 0.8" />
        <a-input
          v-model:value="meta.summary"
          addon-before="摘要"
          placeholder="一句话摘要（显示在首页列表）"
          style="flex: 1.6"
        />
      </div>

      <!-- 标签栏 -->
      <div class="tag-bar">
        <a-select
          v-model:value="meta.tags"
          mode="tags"
          placeholder="添加标签，回车确认..."
          style="width: 100%"
          :options="tagOptions"
        />
      </div>

      <!-- 发布提示 -->
      <a-alert
        v-if="!tipClosed"
        type="info"
        show-icon
        closable
        class="publish-tip"
        @close="tipClosed = true"
      >
        <template #message>
          「保存」只存到浏览器；点「导出 .md」下载文件 → 放到 <b>public/posts/</b> →
          <b>npm run build</b> → 推送 dist/ 到 GitHub 即发布。
        </template>
      </a-alert>

      <!-- 编辑/预览分屏 -->
      <div class="editor-body">
        <div class="editor-pane" :class="{ collapsed: editorCollapsed, expanded: previewCollapsed && !editorCollapsed }">
          <div class="pane-label">
            <span>Markdown</span>
            <a-button type="text" size="small" @click="toggleEditorPane">
              <ColumnWidthOutlined :rotate="editorCollapsed ? 90 : 0" />
            </a-button>
          </div>
          <textarea
            v-show="!editorCollapsed"
            v-model="content"
            class="markdown-input"
            placeholder="开始写 Markdown..."
          />
        </div>
        <div class="preview-pane" :class="{ collapsed: previewCollapsed, expanded: editorCollapsed && !previewCollapsed }">
          <div class="pane-label">
            <span>预览</span>
            <a-button type="text" size="small" @click="togglePreviewPane">
              <ColumnWidthOutlined :rotate="previewCollapsed ? 90 : 0" />
            </a-button>
          </div>
          <div v-show="!previewCollapsed" class="markdown-preview markdown-body" v-html="renderedHtml"></div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="editor-area empty-state">
      <a-empty description="选择左侧文章进行编辑，或点击「新建」开始写作" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { renderMarkdown } from '@/utils/markdown'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  ColumnWidthOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  RollbackOutlined
} from '@ant-design/icons-vue'

const store = usePostsStore()

const editing = ref(false)
const isNew = ref(false)
const currentSlug = ref('')
const meta = ref({ slug: '', title: '', date: '', tags: [], summary: '' })
const content = ref('')

// 面板状态
const siderCollapsed = ref(false)
const editorCollapsed = ref(false)
const previewCollapsed = ref(false)
const showMeta = ref(false)
const tipClosed = ref(localStorage.getItem('blog-admin-tip-closed') === '1')

function toggleEditorPane() {
  editorCollapsed.value = !editorCollapsed.value
  if (editorCollapsed.value) previewCollapsed.value = false
}

function togglePreviewPane() {
  previewCollapsed.value = !previewCollapsed.value
  if (previewCollapsed.value) editorCollapsed.value = false
}

const tagOptions = computed(() => store.allTags.map(t => ({ value: t.name })))
const isModified = computed(() => store.allPosts.find(p => p.slug === currentSlug.value)?.modified)
const renderedHtml = computed(() => renderMarkdown(content.value || ''))

onMounted(() => store.loadIndex())

async function editPost(slug) {
  try {
    const { meta: m, content: c } = await store.loadPost(slug)
    meta.value = { slug, ...m }
    content.value = c
    currentSlug.value = slug
    isNew.value = false
    editing.value = true
    showMeta.value = false
  } catch (e) {
    message.error(e.message || '文章加载失败')
  }
}

function createNew() {
  const today = new Date().toISOString().slice(0, 10)
  meta.value = { slug: '', title: '', date: today, tags: [], summary: '' }
  content.value = ''
  currentSlug.value = ''
  isNew.value = true
  editing.value = true
  showMeta.value = true // 新建时需要填文件名，默认展开
}

function validSlug(s) {
  return /^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/.test(s)
}

function checkForm() {
  if (!meta.value.slug) {
    message.warning('请填写文件名（点「信息」按钮展开）')
    return false
  }
  if (!validSlug(meta.value.slug)) {
    message.warning('文件名只能包含字母、数字、中文、连字符和下划线')
    return false
  }
  if (!meta.value.title) {
    message.warning('请填写标题')
    return false
  }
  return true
}

function save() {
  if (!checkForm()) return
  if (isNew.value && store.allPosts.some(p => p.slug === meta.value.slug)) {
    message.warning('文件名已存在，请换一个')
    return
  }
  store.saveLocal(meta.value.slug, meta.value, content.value, isNew.value)
  currentSlug.value = meta.value.slug
  message.success('已保存到本地（浏览器），记得导出 .md 发布')
}

function exportMd() {
  if (!checkForm()) return
  store.exportPost(meta.value.slug, meta.value, content.value)
  message.success('已下载 .md 文件，放入 public/posts/ 后重新构建即可发布')
}

function removeLocal() {
  store.removeLocal(currentSlug.value)
  editing.value = false
  currentSlug.value = ''
  message.success(isNew.value ? '草稿已删除' : '已恢复为线上版本')
}

// 列表里直接删除草稿 / 撤销修改
function removeLocalBySlug(slug) {
  const wasDraft = !!store.allPosts.find(p => p.slug === slug)?.draft
  store.removeLocal(slug)
  if (currentSlug.value === slug) {
    editing.value = false
    currentSlug.value = ''
  }
  message.success(wasDraft ? '草稿已删除' : '已恢复为线上版本')
}
</script>

<style scoped>
.admin {
  display: flex;
  height: 100vh;
  min-height: 0;
  background: #fff;
  overflow: hidden;
}

/* 左侧文章列表（可收起） */
.sider {
  width: 280px;
  flex-shrink: 0;
  border-right: 1px solid #f0f0f0;
  background: #fafafa;
  overflow: hidden;
  transition: width 0.25s ease;
}
.sider.collapsed {
  width: 0;
  border-right: none;
}
.sider-inner {
  width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.sider-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.sider-title {
  font-weight: 600;
}
.sider-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
.sider-item {
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f2f2f2;
}
.sider-item:hover {
  background: #f0f7ff;
}
.sider-item.active {
  background: #e6f4ff;
}
.item-title {
  font-size: 14px;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.item-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 删除按钮平时隐藏，悬浮该行时显示 */
.item-delete {
  opacity: 0;
  transition: opacity 0.15s;
  margin-left: auto;
  flex-shrink: 0;
}
.sider-item:hover .item-delete {
  opacity: 1;
}
.item-date {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

/* 右侧编辑区 */
.editor-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.editor-header {
  display: flex;
  align-items: center;
  padding: 8px 24px;
  border-bottom: 1px solid #f0f0f0;
  gap: 12px;
  flex-shrink: 0;
}
.meta-bar {
  display: flex;
  gap: 8px;
  padding: 8px 24px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.tag-bar {
  padding: 8px 24px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.publish-tip {
  margin: 8px 24px 0;
  border-radius: 8px;
  flex-shrink: 0;
}
.editor-body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.editor-pane, .preview-pane {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: flex 0.3s ease;
}
.editor-pane {
  border-right: 1px solid #f0f0f0;
}
.editor-pane.collapsed {
  flex: 0 0 40px;
}
.preview-pane.collapsed {
  flex: 0 0 40px;
}
.pane-label {
  padding: 8px 16px;
  font-size: 12px;
  color: #999;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 40px;
}
.editor-pane.collapsed .pane-label,
.preview-pane.collapsed .pane-label {
  border-bottom: none;
  padding: 8px 4px;
  justify-content: center;
}
.editor-pane.collapsed .pane-label span,
.preview-pane.collapsed .pane-label span {
  writing-mode: vertical-rl;
  letter-spacing: 2px;
}
.markdown-input {
  flex: 1;
  min-height: 0;
  width: 100%;
  padding: 16px;
  border: none;
  outline: none;
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  background: #fafafa;
  overflow-y: auto;
  box-sizing: border-box;
}
.markdown-preview {
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
}
.empty-state {
  align-items: center;
  justify-content: center;
}
@media (max-width: 768px) {
  .sider {
    position: absolute;
    z-index: 5;
    height: 100%;
  }
  .editor-header {
    flex-wrap: wrap;
  }
}
</style>
