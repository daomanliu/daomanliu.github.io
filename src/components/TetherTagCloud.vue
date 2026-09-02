<template>
  <!-- 绳子（SVG 曲线，张力大时拉直、小时下垂） -->
  <svg class="tether-rope" aria-hidden="true">
    <path
      :d="ropePath"
      fill="none"
      :stroke="ropeColor"
      stroke-width="2.5"
      stroke-linecap="round"
    />
    <!-- 锚点小圆点 -->
    <circle :cx="anchor.x" :cy="anchor.y" r="3.5" fill="#bfbfbf" />
  </svg>

  <!-- 标签云挂件（绳结在卡片顶部中心） -->
  <div ref="cloudEl" class="tether-cloud" :style="cloudStyle">
    <div class="cloud-knot"></div>
    <h3 class="cloud-title">
      <TagsOutlined /> 标签云
    </h3>
    <div class="tag-cloud">
      <button
        class="cloud-item cloud-all"
        :class="{ active: !store.activeTag }"
        @click="store.activeTag = ''"
      >全部</button>
      <button
        v-for="t in tagCloud"
        :key="t.name"
        class="cloud-item"
        :class="{ active: store.activeTag === t.name }"
        :style="{ fontSize: t.fontSize + 'px', color: t.color }"
        :title="`${t.name} · ${t.count} 篇`"
        @click="toggleTag(t.name)"
      >{{ t.name }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { TagsOutlined } from '@ant-design/icons-vue'

// anchorEl：头像元素的 ref（绳子上端固定点）
const props = defineProps({
  anchorEl: { type: Object, default: null }
})

const store = usePostsStore()

// ========== 物理参数 ==========
const ROPE_LENGTH = 165   // 绳长 px
const SPRING_K = 0.025    // 鼠标吸引力（弹簧常数）
const DAMPING = 0.92      // 阻尼（越接近 1 摆动越久）
const GRAVITY = 0.4       // 重力（自然下垂）

// ========== 状态 ==========
const cloudEl = ref(null)
const anchor = ref({ x: 0, y: 0 })
const pos = ref({ x: 0, y: 0 })      // 绳结位置（卡片顶部中心）
const vel = ref({ x: 0, y: 0 })
const mouse = ref({ x: -9999, y: -9999 })
const cloudW = ref(250)               // 挂件宽度（用于水平居中 + 边界约束）
const tension = ref(0)

let rafId = 0
let ro = null
let initialized = false
let lastMoveTime = 0   // 鼠标最后移动时间，静止一段时间后挂件垂回

function measureAnchor() {
  const el = props.anchorEl?.value ?? props.anchorEl
  if (el && el.getBoundingClientRect) {
    const r = el.getBoundingClientRect()
    // 只有解析出有效位置才更新（ref 未解析时保持 (0,0)）
    if (r.width > 0) {
      anchor.value = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }
  }
}
function measureCloud() {
  if (cloudEl.value) {
    const r = cloudEl.value.getBoundingClientRect()
    if (r.width > 0) cloudW.value = r.width
  }
}
function onMove(e) {
  mouse.value = { x: e.clientX, y: e.clientY }
  lastMoveTime = Date.now()
}

function tick() {
  measureAnchor()
  const a = anchor.value

  // 锚点还没解析出来（ref 时序问题），等下一帧
  if (a.x === 0 && a.y === 0) {
    rafId = requestAnimationFrame(tick)
    return
  }
  // 锚点首次就绪时初始化挂件位置（挂在正下方）
  if (!initialized) {
    pos.value = { x: a.x, y: a.y + ROPE_LENGTH }
    vel.value = { x: 0, y: 0 }
    initialized = true
  }

  const p = pos.value
  const v = vel.value
  const m = mouse.value

  // 弹簧力：拉向鼠标。鼠标静止超过 800ms 就不施加，让挂件受重力自然垂回
  const mouseActive = m.x > -999 && (Date.now() - lastMoveTime < 800)
  if (mouseActive) {
    v.x += (m.x - p.x) * SPRING_K
    v.y += (m.y - p.y) * SPRING_K
  }
  // 重力
  v.y += GRAVITY
  // 阻尼
  v.x *= DAMPING
  v.y *= DAMPING
  // 位置积分
  p.x += v.x
  p.y += v.y

  // 绳长约束：把位置投影回以锚点为圆心、半径 L 的圆上，并去掉径向速度（只保留切向 → 摆动）
  const dx = p.x - a.x
  const dy = p.y - a.y
  const dist = Math.hypot(dx, dy)
  if (dist > 0.001) {
    const nx = dx / dist
    const ny = dy / dist
    p.x = a.x + nx * ROPE_LENGTH
    p.y = a.y + ny * ROPE_LENGTH
    const rv = v.x * nx + v.y * ny
    v.x -= rv * nx
    v.y -= rv * ny
  }

  // 边界约束：卡片不超出屏幕左右边缘（绳子碰到"墙"会自然松弛下垂）
  const halfW = cloudW.value / 2
  const vw = window.innerWidth
  if (p.x < halfW) {
    p.x = halfW
    if (v.x < 0) v.x = 0
  } else if (p.x > vw - halfW) {
    p.x = vw - halfW
    if (v.x > 0) v.x = 0
  }

  // 张力：偏离正下方角度越大、速度越快，绳子越绷直；被边界挡住时角度小 → 松弛下垂
  const angle = Math.abs(Math.atan2(p.x - a.x, p.y - a.y)) // 0 = 正下方
  tension.value = Math.min(1, angle / 1.1 + Math.hypot(v.x, v.y) / 30)

  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  measureAnchor()
  measureCloud()
  ro = new ResizeObserver(measureCloud)
  if (cloudEl.value) ro.observe(cloudEl.value)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('resize', measureAnchor)
  rafId = requestAnimationFrame(tick)
})
onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('resize', measureAnchor)
  ro?.disconnect()
})

// 卡片左上角（pos 是卡片顶部中心）
const cloudStyle = computed(() => ({
  transform: `translate(${pos.value.x - cloudW.value / 2}px, ${pos.value.y}px)`
}))

// 绳子颜色：绷直时略深
const ropeColor = computed(() => (tension.value > 0.6 ? '#8c8c8c' : '#c7c7c7'))

// 绳子路径：二次贝塞尔，松弛时中点下垂（sag），绷直时接近直线
const ropePath = computed(() => {
  const a = anchor.value
  const p = pos.value
  const sag = (1 - tension.value) * 34
  const mx = (a.x + p.x) / 2
  const my = (a.y + p.y) / 2 + sag
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${p.x} ${p.y}`
})

// ========== 词云数据 ==========
const FONT_MIN = 12
const FONT_MAX = 22
const PALETTE = [
  '#1890ff', '#36cfc9', '#722ed1', '#eb2f96',
  '#fa8c16', '#52c41a', '#2f54eb', '#f5222d',
  '#13c2c2', '#faad14'
]

const tagCloud = computed(() => {
  const tags = store.allTags
  if (!tags.length) return []
  const counts = tags.map(t => t.count)
  const min = Math.min(...counts)
  const max = Math.max(...counts)
  const span = max - min
  // 热度跨度小时收窄字号区间，避免只有两档对比过猛
  const range = (Math.min(span, 4) / 4) * (FONT_MAX - FONT_MIN)
  return tags.map((t, i) => ({
    ...t,
    fontSize: span === 0
      ? Math.round((FONT_MIN + FONT_MAX) / 2)
      : Math.round(FONT_MIN + ((t.count - min) / span) * range),
    color: PALETTE[i % PALETTE.length]
  }))
})

function toggleTag(name) {
  store.activeTag = store.activeTag === name ? '' : name
}
</script>

<style scoped>
.tether-rope {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 45;
}
.tether-cloud {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 46;
  width: 250px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px 14px 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  will-change: transform;
}
/* 绳结：突出卡片顶部，与绳子末端对齐 */
.cloud-knot {
  width: 10px;
  height: 10px;
  border: 2px solid #bbb;
  border-radius: 50%;
  background: #fff;
  margin: -16px auto 8px;
}
.cloud-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 2px 8px;
}
.cloud-item {
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  line-height: 1.5;
  opacity: 0.85;
  transition: opacity 0.15s, transform 0.15s;
  font-family: inherit;
}
.cloud-item:hover {
  opacity: 1;
  transform: scale(1.08);
}
.cloud-item.active {
  opacity: 1;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}
.cloud-all {
  color: #8c8c8c;
  font-size: 13px;
}

/* 移动端隐藏挂件，避免遮挡内容 */
@media (max-width: 768px) {
  .tether-rope,
  .tether-cloud {
    display: none;
  }
}
</style>
