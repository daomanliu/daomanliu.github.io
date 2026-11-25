// v-reveal：元素进入视口时轻轻地淡入上移一次。
// 系统开了「减少动态效果」就完全跳过，页面直接可见。
const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export const reveal = {
  mounted(el) {
    if (reduceMotion() || !('IntersectionObserver' in window)) return

    el.classList.add('reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          el.classList.add('reveal-in')
          observer.unobserve(el)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    el._revealObserver = observer
  },
  unmounted(el) {
    el._revealObserver?.disconnect()
    delete el._revealObserver
  },
}
