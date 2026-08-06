// 统一的日期格式化工具。
// short=true 时（如列表项）只显示「月/日」，否则显示完整日期；
// 当天的笔记统一显示「时:分」，更符合笔记类应用的直觉。
export function formatDate(ts, short = false) {
  const date = new Date(ts)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  return short
    ? date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
    : date.toLocaleDateString('zh-CN')
}
