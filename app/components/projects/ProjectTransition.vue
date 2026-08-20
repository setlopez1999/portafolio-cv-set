<template>
  <div ref="rootRef" class="project-transition" :style="{ '--transition-accent': accent }" aria-hidden="true">
    <svg class="project-transition__svg" viewBox="0 0 900 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path ref="pathRef" class="transition-path" d="M0 80C130 10 220 150 360 80C500 10 620 150 900 80" />
      <rect ref="windowRef" class="transition-window" x="380" y="42" width="140" height="76" rx="8" />
      <g ref="pixelsRef" class="transition-pixels">
        <rect x="410" y="55" width="12" height="12" rx="2" />
        <rect x="430" y="55" width="12" height="12" rx="2" />
        <rect x="450" y="55" width="12" height="12" rx="2" />
        <rect x="410" y="75" width="12" height="12" rx="2" />
        <rect x="430" y="75" width="12" height="12" rx="2" />
        <rect x="450" y="75" width="12" height="12" rx="2" />
        <rect x="410" y="95" width="12" height="12" rx="2" />
        <rect x="430" y="95" width="12" height="12" rx="2" />
        <rect x="450" y="95" width="12" height="12" rx="2" />
      </g>
      <circle ref="circleRef" class="transition-circle" cx="450" cy="80" r="28" />
    </svg>
    <span>{{ fromLabel }} <b>→</b> {{ toLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '~/composables/useReducedMotion'
const props = defineProps<{ fromLabel: string; toLabel: string; accent: string; type: string }>()
const rootRef = ref<HTMLElement | null>(null)
const pathRef = ref<SVGPathElement | null>(null)
const windowRef = ref<SVGRectElement | null>(null)
const pixelsRef = ref<SVGGElement | null>(null)
const circleRef = ref<SVGCircleElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!rootRef.value || prefersReducedMotion.value) return
  gsap.registerPlugin(ScrollTrigger)
  const context = gsap.context(() => {
    const pathLength = pathRef.value?.getTotalLength() ?? 800
    gsap.set(pathRef.value, { strokeDasharray: pathLength, strokeDashoffset: pathLength })
    gsap.set([windowRef.value, circleRef.value], { opacity: 0, scale: 0.86, transformOrigin: 'center' })
    gsap.set(pixelsRef.value, { opacity: 0, scale: 0.6, transformOrigin: 'center' })

    const tl = gsap.timeline({ paused: true })
    if (props.type === 'window') {
      tl.to(pathRef.value, { strokeDashoffset: 0, duration: 0.75, ease: 'power2.out' })
        .to(windowRef.value, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }, '-=0.22')
    } else if (props.type === 'pixels') {
      tl.to(pixelsRef.value, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.03, ease: 'back.out(1.6)' })
        .to(circleRef.value, { opacity: 1, scale: 1.4, duration: 0.6, ease: 'power2.out' }, '-=0.2')
    } else {
      tl.to(pathRef.value, { strokeDashoffset: 0, duration: 0.95, ease: 'power2.out' })
        .to(circleRef.value, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, '-=0.3')
    }

    ScrollTrigger.create({ trigger: rootRef.value, start: 'top 82%', once: true, onEnter: () => tl.play() })
  }, rootRef.value)
  return () => context.revert()
})
</script>

<style scoped>
.project-transition { display: grid; gap: 0.7rem; justify-items: center; padding: 1rem 0; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; }
.project-transition__svg { width: min(900px, 100%); height: auto; overflow: visible; }
.transition-path { stroke: var(--transition-accent); stroke-width: 1.2; stroke-linecap: round; opacity: 0.62; }
.transition-window { fill: rgba(53, 242, 138, 0.08); stroke: var(--transition-accent); stroke-width: 1.2; }
.transition-pixels rect { fill: var(--transition-accent); }
.transition-circle { fill: none; stroke: var(--transition-accent); stroke-width: 1.2; }
.project-transition span { opacity: 0.72; }
.project-transition b { padding: 0 0.4rem; color: var(--color-text); }
</style>
