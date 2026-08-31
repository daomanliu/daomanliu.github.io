// 生成笔记的唯一 id：时间戳 + 随机串，避免与时间相关的碰撞。
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
