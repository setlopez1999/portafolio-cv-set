<template>
  <div ref="rootRef" class="section-morph" aria-hidden="true">
    <div ref="shapeRef" class="section-morph__shape" :class="`section-morph__shape--${shape}`"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '~/composables/useReducedMotion'

const props = defineProps<{
  shape: 'circle' | 'square' | 'diamond' | 'triangle'
  mode: 'grow' | 'shrink'
  fromColor: string
  toColor: string
  accentColor: string
}>()

const rootRef = ref<HTMLElement | null>(null)
const shapeRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!rootRef.value || !shapeRef.value) return

  const baseRotation = props.shape === 'diamond' ? 45 : 0

  gsap.set(rootRef.value, { backgroundColor: props.fromColor })
  gsap.set(shapeRef.value, { backgroundColor: props.accentColor, rotation: baseRotation })

  if (prefersReducedMotion.value) {
    gsap.set(rootRef.value, { backgroundColor: props.toColor })
    gsap.set(shapeRef.value, { scale: 0, opacity: 0 })
    return
  }

  gsap.registerPlugin(ScrollTrigger)
  const startScale = props.mode === 'grow' ? 0 : 2.4
  const endScale = props.mode === 'grow' ? 2.4 : 0
  gsap.set(shapeRef.value, { scale: startScale })

  const ctx = gsap.context(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.value,
        start: 'top 85%',
        end: 'bottom 35%',
        scrub: 0.6,
      },
    })
      .to(shapeRef.value, { scale: endScale, ease: 'none' }, 0)
      .to(rootRef.value, { backgroundColor: props.toColor, ease: 'none' }, 0)
  }, rootRef.value)

  onBeforeUnmount(() => ctx.revert())
})
</script>

<style scoped>
.section-morph {
  position: relative;
  display: grid;
  place-items: center;
  height: clamp(60vh, 75vh, 820px);
  overflow: hidden;
  isolation: isolate;
}

.section-morph__shape {
  width: min(46vw, 420px);
  aspect-ratio: 1;
  opacity: 0.14;
  will-change: transform;
}

.section-morph__shape--circle { border-radius: 50%; }
.section-morph__shape--square { border-radius: 18%; }
.section-morph__shape--diamond { border-radius: 18%; }
.section-morph__shape--triangle { clip-path: polygon(50% 4%, 96% 96%, 4% 96%); }
</style>
