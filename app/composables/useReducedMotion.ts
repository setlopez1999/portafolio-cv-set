import { onBeforeUnmount, onMounted, ref } from 'vue'

export const useReducedMotion = () => {
  const prefersReducedMotion = ref(false)
  let mediaQuery: MediaQueryList | null = null

  const update = () => {
    prefersReducedMotion.value = mediaQuery?.matches ?? false
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    mediaQuery.addEventListener?.('change', update)
  })

  onBeforeUnmount(() => {
    mediaQuery?.removeEventListener?.('change', update)
  })

  return { prefersReducedMotion }
}
