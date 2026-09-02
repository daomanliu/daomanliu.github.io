<template>
  <div class="schedule-view">
    <!-- 标题栏 -->
    <div class="schedule-header">
      <a-button type="text" shape="circle" @click="goBack" title="返回">
        <template #icon><ArrowLeftOutlined /></template>
      </a-button>
      <h2 class="schedule-title">课表查询</h2>
    </div>

    <!-- 加载失败提示 -->
    <a-alert
      v-if="loadError"
      type="error"
      show-icon
      :message="loadError"
      style="margin-bottom: 12px"
    />

    <!-- 课表主体 -->
    <a-spin :spinning="loading">
      <div class="schedule-card" v-if="data">
        <div class="schedule-grid" :style="gridStyle">
          <!-- 表头：左上角空白 + 周一~周日 -->
          <!-- 每个 cell 显式指定 gridColumn/gridRow，避免课程块占 slot 后 auto-placement 错位 -->
          <div
            class="cell head-cell head-spacer"
            style="grid-column: 1 / 2; grid-row: 1 / 2"
          ></div>
          <div
            v-for="(d, i) in weekDays"
            :key="d.label"
            class="cell head-cell"
            :class="{ today: d.isToday }"
            :style="{ gridColumn: `${i + 2} / ${i + 3}`, gridRow: '1 / 2' }"
          >
            {{ d.label }}
          </div>

          <!-- 每个节次一行：左列时间段 + 7 个空格子 -->
          <template v-for="p in data.periods" :key="'row-' + p.index">
            <div
              class="cell period-cell"
              :style="{ gridColumn: '1 / 2', gridRow: `${p.index + 1} / ${p.index + 2}` }"
            >
              <div class="period-no">{{ p.index }}</div>
              <div class="period-time">
                <div>{{ p.start }}</div>
                <div>{{ p.end }}</div>
              </div>
            </div>
            <div
              v-for="i in 7"
              :key="'cell-' + p.index + '-' + i"
              class="cell day-cell"
              :style="{ gridColumn: `${i + 1} / ${i + 2}`, gridRow: `${p.index + 1} / ${p.index + 2}` }"
            ></div>
          </template>

          <!-- 课程块（按 weekday × 节次定位覆盖） -->
          <div
            v-for="c in data.courses"
            :key="c.id"
            class="course-block"
            :style="getCourseStyle(c)"
            :title="courseTitle(c)"
            @click="openDetail(c)"
          >
            <div class="course-name">{{ c.name }}</div>
            <div v-if="c.teacher" class="course-teacher">{{ c.teacher }}</div>
          </div>
        </div>

        <div class="summary">
          共 {{ data.courses.length }} 门课 · 数据来源：{{ data.meta.source || '学校教务管理系统' }}
        </div>
      </div>
    </a-spin>

    <!-- 课程详情弹窗 -->
    <a-modal
      :open="detailVisible"
      :footer="null"
      :title="detail?.name || '课程详情'"
      @cancel="detailVisible = false"
    >
      <a-descriptions v-if="detail" :column="1" size="small" bordered>
        <a-descriptions-item label="授课教师">{{ detail.teacher || '—' }}</a-descriptions-item>
        <a-descriptions-item label="上课地点">{{ detail.location || '—' }}</a-descriptions-item>
        <a-descriptions-item label="星期">{{ weekdayName(detail.weekday) }}</a-descriptions-item>
        <a-descriptions-item label="节次">
          第 {{ detail.periods.join('、') }} 节
          <span class="muted">（{{ periodsTimeRange(detail.periods) }}）</span>
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

const router = useRouter()

// ========== 数据加载 ==========
const data = ref(null)
const loading = ref(false)
const loadError = ref('')

async function loadSchedule() {
  loading.value = true
  loadError.value = ''
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'schedule.json', { cache: 'no-store' })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const json = await res.json()
    if (!json.periods || !Array.isArray(json.courses)) {
      throw new Error('课表数据格式不正确')
    }
    data.value = json
  } catch (e) {
    loadError.value = '课表加载失败：' + (e.message || e)
  } finally {
    loading.value = false
  }
}

// ========== 星期表头 ==========
// 每周课程固定，表头只标星期；今天那一列高亮，方便看今天有什么课
const weekDays = computed(() => {
  const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const jsDay = new Date().getDay()      // 0=周日 … 6=周六
  const today = jsDay === 0 ? 7 : jsDay  // 转成 1=周一 … 7=周日
  return labels.map((label, i) => ({ label, isToday: i + 1 === today }))
})

// ========== 课程块定位 ==========
const gridStyle = computed(() => {
  const rows = data.value?.periods?.length || 14
  return {
    gridTemplateColumns: '66px repeat(7, minmax(0, 1fr))',
    gridTemplateRows: `38px repeat(${rows}, 48px)`
  }
})

function getCourseStyle(c) {
  const periods = c.periods || []
  if (!periods.length) return {}
  const min = Math.min(...periods)
  const max = Math.max(...periods)
  // 第 1 列是节次时间，第 1 行是表头，所以课程列/行都要 +1
  const col = c.weekday + 1
  return {
    gridColumn: `${col} / ${col + 1}`,
    gridRow: `${min + 1} / ${max + 2}`,
    '--course-color': colorVar(c.color)
  }
}

function colorVar(name) {
  const map = {
    orange: '#f56c2c',
    blue: '#4d7cff',
    gold: '#e6a23c',
    green: '#67c23a',
    purple: '#8e44ad',
    cyan: '#17a2b8',
    teal: '#16a085',
    geekblue: '#2c5aa0',
    yellow: '#f1c40f',
    red: '#e74c3c',
    pink: '#eb2f96'
  }
  return map[name] || '#4d7cff'
}

// ========== 详情 ==========
const detailVisible = ref(false)
const detail = ref(null)

function openDetail(c) {
  detail.value = c
  detailVisible.value = true
}

function courseTitle(c) {
  const lines = [c.name]
  if (c.teacher) lines.push(c.teacher)
  if (c.location) lines.push('@ ' + c.location)
  return lines.join('\n')
}

function weekdayName(w) {
  return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][w - 1] || ''
}

function periodsTimeRange(periods) {
  if (!data.value) return ''
  const ps = data.value.periods
  const start = ps.find(p => p.index === Math.min(...periods))?.start
  const end = ps.find(p => p.index === Math.max(...periods))?.end
  return start && end ? `${start} - ${end}` : ''
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

onMounted(loadSchedule)
</script>

<style scoped>
.schedule-view {
  padding: 0 0 32px;
}

/* 标题栏 */
.schedule-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0 16px;
}
.schedule-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
}

/* 课表卡片 */
.schedule-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #eee;
  padding: 8px;
  overflow-x: auto;
}
.schedule-grid {
  display: grid;
  position: relative;
  min-width: 640px;
  border-top: 1px solid #f0f0f0;
  border-left: 1px solid #f0f0f0;
}
.cell {
  box-sizing: border-box; /* 让 padding 算在 grid 列宽内，否则 padding 会溢出到下一列 */
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  padding: 4px;
  font-size: 12px;
  background: #fff;
}
.head-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafbfc;
  font-weight: 500;
  color: #555;
  font-size: 13px;
}
.head-spacer {
  background: #f5f7fa;
}
/* 今天那一列：浅蓝底 + 蓝字，能看出是今天但不抢眼 */
.head-cell.today {
  background: #e6f4ff;
  color: #1890ff;
  font-weight: 600;
}

/* 左列时间段：节次数字在上、时间在下，垂直堆叠避免横向溢出 */
.period-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  background: #fafbfc;
  color: #555;
  font-size: 11px;
  padding: 2px 4px;
}
.period-no {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f0f0f0;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
}
.period-time {
  font-size: 10px;
  color: #999;
  line-height: 1.2;
  text-align: center;
}
.day-cell {
  background: #fff;
}

/* 课程块 */
.course-block {
  background: var(--course-color, #4d7cff);
  color: #fff;
  border-radius: 4px;
  padding: 4px 6px;
  margin: 2px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  font-size: 11px;
  line-height: 1.3;
  transition: transform 0.12s, box-shadow 0.12s;
  z-index: 1;
}
.course-block:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  z-index: 2;
}
.course-name {
  font-weight: 600;
  font-size: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.course-teacher {
  font-size: 10px;
  opacity: 0.9;
  margin-top: 2px;
}

/* 底部汇总 */
.summary {
  text-align: center;
  padding: 12px 0 4px;
  color: #999;
  font-size: 12px;
}

.muted {
  color: #999;
  font-size: 12px;
}

@media (max-width: 768px) {
  .schedule-grid {
    min-width: 560px;
  }
}
</style>
