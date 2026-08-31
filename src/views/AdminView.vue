<template>
  <div
    class="admin"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <!-- 左侧：文章列表（可收起） -->
    <div class="sider" :class="{ collapsed: siderCollapsed }">
      <div class="sider-inner">
        <div class="sider-header">
          <span class="sider-title">文章管理</span>
          <a-space :size="4">
            <a-tooltip title="导入 .md 文件">
              <a-button size="small" @click="triggerImport"><ImportOutlined /></a-button>
            </a-tooltip>
            <a-button type="primary" size="small" @click="createNew">
              <PlusOutlined /> 新建
            </a-button>
          </a-space>
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
        <span class="save-status" :class="saveState">
          <LoadingOutlined v-if="saveState === 'pending'" />
          <CheckCircleFilled v-else-if="saveState === 'saved'" />
          <ExclamationCircleFilled v-else-if="saveState === 'error'" />
          <span class="save-text">{{ saveText }}</span>
        </span>
        <a-space>
          <a-button @click="showMeta = !showMeta" title="文件名 / 日期 / 摘要">
            <InfoCircleOutlined /> 信息
          </a-button>
          <a-button @click="triggerImport" title="导入 .md 文件">
            <ImportOutlined /> 导入
          </a-button>
          <a-button
            v-if="!editorCollapsed && !previewCollapsed"
            :type="syncScroll ? 'primary' : 'default'"
            @click="syncScroll = !syncScroll"
            :title="syncScroll ? '关闭同步滚动' : '开启同步滚动'"
          >
            <SwapOutlined /> 同步滚动
          </a-button>
          <a-button @click="toggleEditorPane" :title="editorCollapsed ? '展开编辑' : '折叠编辑'">
            <ColumnWidthOutlined :rotate="editorCollapsed ? 90 : 0" />
            {{ editorCollapsed ? '展开编辑' : '折叠编辑' }}
          </a-button>
          <a-button @click="togglePreviewPane" :title="previewCollapsed ? '展开预览' : '折叠预览'">
            <ColumnWidthOutlined :rotate="previewCollapsed ? 90 : 0" />
            {{ previewCollapsed ? '展开预览' : '折叠预览' }}
          </a-button>
          <a-button type="primary" @click="exportMd">导出 .md</a-button>
          <a-popconfirm
            v-if="isLocal"
            :title="isDraft ? '删除这篇本地草稿？' : '撤销本地修改，恢复为已发布版本？'"
            ok-text="确定"
            cancel-text="取消"
            @confirm="removeLocal"
          >
            <a-button danger>{{ isDraft ? '删除' : '撤销修改' }}</a-button>
          </a-popconfirm>
        </a-space>
      </div>

      <!-- 文章信息（文件名/日期/摘要），可收起 -->
      <div class="meta-bar" v-show="showMeta">
        <a-input
          v-model:value="meta.slug"
          addon-before="文件名"
          placeholder="如 my-first-post（建议小写字母/数字/连字符）"
          :disabled="isCurrentPublished"
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
          所有改动<b>自动保存</b>到浏览器本地（换设备不同步）；点「导入」可直接拖入 .md 文件；
          发布时点「导出 .md」下载文件 → 放到 <b>public/posts/</b> →
          <b>npm run build</b> → 推送 dist/ 到 GitHub。
        </template>
      </a-alert>

      <!-- 编辑/预览分屏：两栏各自独立滚动 -->
      <div class="editor-body">
        <div
          class="editor-pane"
          :class="{ collapsed: editorCollapsed, expanded: previewCollapsed && !editorCollapsed }"
        >
          <div class="pane-label">
            <span>Markdown</span>
            <a-button type="text" size="small" @click="toggleEditorPane">
              <ColumnWidthOutlined :rotate="editorCollapsed ? 90 : 0" />
            </a-button>
          </div>
          <textarea
            v-show="!editorCollapsed"
            ref="editorEl"
            v-model="content"
            class="markdown-input"
            placeholder="开始写 Markdown...（也可把 .md 文件直接拖进来）"
            spellcheck="false"
            @scroll="onEditorScroll"
          />
        </div>
        <div
          class="preview-pane"
          :class="{ collapsed: previewCollapsed, expanded: editorCollapsed && !previewCollapsed }"
        >
          <div class="pane-label">
            <span>预览</span>
            <a-button type="text" size="small" @click="togglePreviewPane">
              <ColumnWidthOutlined :rotate="previewCollapsed ? 90 : 0" />
            </a-button>
          </div>
          <div
            v-show="!previewCollapsed"
            ref="previewEl"
            class="markdown-preview markdown-body"
            v-html="renderedHtml"
            @scroll="onPreviewScroll"
          ></div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="editor-area empty-state">
      <a-empty description="选择左侧文章进行编辑，点击「新建」开始写作，或把 .md 文件拖到这里导入" />
      <a-button style="margin-top: 12px" @click="triggerImport">
        <ImportOutlined /> 导入 Markdown 文件
      </a-button>
    </div>

    <!-- 拖拽导入遮罩 -->
    <div v-if="dragging" class="drop-mask">
      <div class="drop-hint">
        <InboxOutlined />
        <div>松开即可导入 Markdown 文件</div>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".md,.markdown,.txt,text/markdown,text/plain"
      multiple
      class="hidden-file-input"
      @change="onFileChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { renderMarkdown } from '@/utils/markdown'
import { parsePost, stringifyPost } from '@/utils/frontmatter'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  ColumnWidthOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  RollbackOutlined,
  ImportOutlined,
  InboxOutlined,
  SwapOutlined,
  CheckCircleFilled,
  LoadingOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons-vue'

const store = usePostsStore()

const editing = ref(false)
const currentSlug = ref('')
const meta = ref({ slug: '', title: '', date: '', tags: [], summary: '' })
const content = ref('')

// 面板状态
const siderCollapsed = ref(false)
const editorCollapsed = ref(false)
const previewCollapsed = ref(false)
const showMeta = ref(false)
const syncScroll = ref(false)
const tipClosed = ref(localStorage.getItem('blog-admin-tip-closed') === '1')

// 滚动元素
const editorEl = ref(null)
const previewEl = ref(null)
const fileInput = ref(null)

// ============ 自动保存 ============
const SAVE_DELAY = 600
// idle：新建还没动过 | pending：有改动待写入 | saved：已落盘 | error：缺文件名等
const saveState = ref('idle')
const savedAt = ref(0)
const savedSlug = ref('') // 当前内容已存到哪个 slug 下（用于重命名）
let saveTimer = null
let suppress = false // 载入文章时不要触发保存

const saveText = computed(() => {
  if (saveState.value === 'pending') return '保存中…'
  if (saveState.value === 'error') return '未保存（文件名无效）'
  if (saveState.value === 'idle') return '尚未保存'
  const d = new Date(savedAt.value)
  const p = n => String(n).padStart(2, '0')
  return `已保存 ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
})

// 标题 / 文件名 / 日期 / 摘要 / 标签 / 正文 任一变化都会自动保存
watch([meta, content], () => {
  if (suppress || !editing.value) return
  scheduleSave()
}, { deep: true })

function scheduleSave() {
  saveState.value = 'pending'
  clearTimeout(saveTimer)
  saveTimer = setTimeout(doSave, SAVE_DELAY)
}

function clearPending() {
  clearTimeout(saveTimer)
  saveTimer = null
}

function flushSave() {
  if (!saveTimer) return
  clearPending()
  doSave()
}

function doSave() {
  if (!editing.value) return
  const slug = (meta.value.slug || '').trim()

  if (!slug || !validSlug(slug)) {
    saveState.value = 'error'
    return
  }

  // 草稿改了文件名：迁移本地数据
  if (savedSlug.value && savedSlug.value !== slug) {
    if (store.slugExists(slug)) {
      message.warning(`文件名「${slug}」已存在，换个名字吧`)
      saveState.value = 'error'
      return
    }
    store.renameLocal(savedSlug.value, slug)
    savedSlug.value = slug
    currentSlug.value = slug
  }

  // 还没写过任何东西的新草稿，先不落盘，避免产生一堆空草稿
  if (!savedSlug.value && !content.value.trim() && !meta.value.title.trim()) {
    saveState.value = 'idle'
    return
  }

  const asDraft = !store.isPublished(slug)
  store.saveLocal(slug, meta.value, content.value, asDraft)
  savedSlug.value = slug
  currentSlug.value = slug
  savedAt.value = Date.now()
  saveState.value = 'saved'
}

// 关页面/刷新前把最后的改动写掉
function handleBeforeUnload() {
  flushSave()
}

function toggleEditorPane() {
  editorCollapsed.value = !editorCollapsed.value
  if (editorCollapsed.value) previewCollapsed.value = false
}

function togglePreviewPane() {
  previewCollapsed.value = !previewCollapsed.value
  if (previewCollapsed.value) editorCollapsed.value = false
}

const tagOptions = computed(() => store.allTags.map(t => ({ value: t.name })))
const localKind = computed(() => (currentSlug.value ? store.localKind.get(currentSlug.value) || '' : ''))
const isDraft = computed(() => localKind.value === 'draft')
const isLocal = computed(() => localKind.value === 'draft' || localKind.value === 'modified')
// 已发布文章不允许改文件名（改了等于另一篇），草稿/新建可以随便改
const isCurrentPublished = computed(() => !!currentSlug.value && store.isPublished(currentSlug.value))
const renderedHtml = computed(() => renderMarkdown(content.value || ''))

onMounted(() => {
  store.loadIndex()
  window.addEventListener('beforeunload', handleBeforeUnload)
})
onBeforeUnmount(() => {
  clearPending()
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

async function loadIntoEditor(slug) {
  const { meta: m, content: c } = await store.loadPost(slug)
  suppress = true
  meta.value = { slug, ...m }
  content.value = c
  currentSlug.value = slug
  editing.value = true
  savedSlug.value = slug
  savedAt.value = Date.now()
  saveState.value = 'saved'
  if (editorEl.value) editorEl.value.scrollTop = 0
  if (previewEl.value) previewEl.value.scrollTop = 0
  await nextTick()
  suppress = false
}

async function editPost(slug) {
  try {
    flushSave()
    await loadIntoEditor(slug)
    showMeta.value = false
  } catch (e) {
    message.error(e.message || '文章加载失败')
  }
}

function createNew() {
  flushSave()
  const today = new Date().toISOString().slice(0, 10)
  suppress = true
  meta.value = { slug: genSlug(), title: '', date: today, tags: [], summary: '' }
  content.value = ''
  currentSlug.value = ''
  savedSlug.value = ''
  savedAt.value = 0
  saveState.value = 'idle'
  editing.value = true
  showMeta.value = true // 新建时默认展开，方便改文件名
  nextTick(() => { suppress = false })
}

function genSlug() {
  const d = new Date()
  const p = n => String(n).padStart(2, '0')
  return `draft-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
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

function exportMd() {
  if (!checkForm()) return
  store.exportPost(meta.value.slug, meta.value, content.value)
  message.success('已下载 .md 文件，放入 public/posts/ 后重新构建即可发布')
}

function removeLocal() {
  clearPending()
  store.removeLocal(currentSlug.value)
  editing.value = false
  currentSlug.value = ''
  savedSlug.value = ''
  saveState.value = 'idle'
  message.success(isDraft.value ? '草稿已删除' : '已恢复为线上版本')
}

// 列表里直接删除草稿 / 撤销修改
function removeLocalBySlug(slug) {
  clearPending()
  const wasDraft = !!store.allPosts.find(p => p.slug === slug)?.draft
  store.removeLocal(slug)
  if (currentSlug.value === slug) {
    editing.value = false
    currentSlug.value = ''
    savedSlug.value = ''
    saveState.value = 'idle'
  }
  message.success(wasDraft ? '草稿已删除' : '已恢复为线上版本')
}

// ============ 双栏独立滚动（可选同步） ============
let syncing = false
function mirrorScroll(from, to) {
  if (!syncScroll.value || syncing || !from || !to) return
  const fromMax = from.scrollHeight - from.clientHeight
  const toMax = to.scrollHeight - to.clientHeight
  if (fromMax <= 0 || toMax <= 0) return
  syncing = true
  to.scrollTop = (from.scrollTop / fromMax) * toMax
  requestAnimationFrame(() => { syncing = false })
}
function onEditorScroll() {
  mirrorScroll(editorEl.value, previewEl.value)
}
function onPreviewScroll() {
  mirrorScroll(previewEl.value, editorEl.value)
}

// ============ Markdown 导入 ============
function triggerImport() {
  fileInput.value?.click()
}

function onFileChange(e) {
  const files = e.target.files
  if (files?.length) importFiles(files)
  e.target.value = '' // 允许重复选同一个文件
}

// 拖拽（enter/leave 会在子元素间冒泡，用计数器抵消）
let dragDepth = 0
const dragging = ref(false)
function onDragEnter(e) {
  if (!e.dataTransfer) return
  const types = [...(e.dataTransfer.types || [])]
  if (!types.includes('Files')) return
  dragDepth++
  dragging.value = true
}
function onDragLeave() {
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) dragging.value = false
}
function onDrop(e) {
  dragDepth = 0
  dragging.value = false
  const files = e.dataTransfer?.files
  if (files?.length) importFiles(files)
}

async function importFiles(fileList) {
  const files = [...fileList].filter(f => /\.(md|markdown|txt)$/i.test(f.name))
  if (!files.length) {
    message.warning('只支持 .md / .markdown / .txt 文件')
    return
  }

  flushSave()
  const today = new Date().toISOString().slice(0, 10)
  let count = 0
  let lastSlug = ''

  for (const file of files) {
    try {
      const text = await file.text()
      const { meta: m, content: c } = parsePost(text)
      const slug = pickImportSlug(file.name, m)
      const normalized = {
        title: m.title || slug,
        date: m.date || today,
        tags: m.tags || [],
        summary: m.summary || ''
      }
      store.putRaw(slug, stringifyPost({ ...normalized, slug }, c))
      lastSlug = slug
      count++
    } catch (err) {
      message.error(`${file.name} 导入失败：${err.message || '读取错误'}`)
    }
  }

  if (!count) return
  message.success(count > 1 ? `已导入 ${count} 篇 Markdown` : '导入成功，已自动保存到本地')
  await loadIntoEditor(lastSlug)
}

// 导入文件的 slug：优先用文件名，非法字符替换为连字符；都不行就用标题或时间戳。
// 同名文章直接覆盖 —— 导出的 .md 改完再导回来，本来就是为了更新这篇。
function pickImportSlug(filename, m) {
  let base = filename.replace(/\.(md|markdown|txt)$/i, '').trim()
  if (!base && m?.title) base = m.title.trim()
  base = base.replace(/[^\w\u4e00-\u9fa5-]+/g, '-').replace(/^-+|-+$/g, '')
  if (!base) {
    const d = new Date()
    base = `import-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Date.now() % 100000}`
  }
  return base
}
</script>

<style scoped>
.admin {
  position: relative;
  display: flex;
  height: 100%;
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
  min-height: 0;
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

/* 保存状态 */
.save-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  flex-shrink: 0;
}
.save-status.saved {
  color: #52c41a;
}
.save-status.pending {
  color: #fa8c16;
}
.save-status.error {
  color: #ff4d4f;
}
.save-text {
  font-variant-numeric: tabular-nums;
}

/* 编辑/预览分屏 */
.editor-body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.editor-pane, .preview-pane {
  flex: 1 1 50%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: flex-basis 0.3s ease;
}
.editor-pane.expanded, .preview-pane.expanded {
  flex: 1 1 100%;
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
  overscroll-behavior: contain;
  box-sizing: border-box;
}
.markdown-preview {
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.empty-state {
  align-items: center;
  justify-content: center;
}

/* 拖拽导入 */
.drop-mask {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: rgba(24, 144, 255, 0.08);
  border: 2px dashed #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.drop-hint {
  text-align: center;
  color: #1890ff;
  font-size: 16px;
}
.drop-hint :deep(.anticon) {
  font-size: 40px;
  margin-bottom: 8px;
}
.hidden-file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
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
