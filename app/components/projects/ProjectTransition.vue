<template>
  <div ref="rootRef" class="project-transition" :style="{ '--transition-accent': accent }" aria-hidden="true">
    <svg class="project-transition__svg" viewBox="0 0 900 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path ref="pathRef" class="transition-path" d="M0 80C130 10 220 150 360 80C500 10 620 150 900 80" />

      <g ref="iconRef" class="transition-icon">
        <template v-if="icon === 'flutter'">
          <path d="M 420 40 L 462 80 L 420 120" />
          <path d="M 444 66 L 478 94 L 444 122" />
        </template>

        <template v-else-if="icon === 'vue'">
          <path d="M 412 45 L 450 115 L 488 45" />
          <path d="M 434 45 L 450 74 L 466 45" />
        </template>

        <template v-else-if="icon === 'java'">
          <rect x="424" y="60" width="52" height="46" rx="6" />
          <path d="M 476 70 Q 494 70 494 83 Q 494 96 476 94" />
          <path d="M 436 52 Q 432 44 438 38" />
          <path d="M 452 52 Q 448 44 454 38" />
        </template>

        <template v-else-if="icon === 'design'">
          <path d="M 420 100 L 450 60 L 480 100" />
          <path d="M 450 60 L 450 42" stroke-dasharray="2 4" />
          <circle class="transition-icon__dot" cx="450" cy="60" r="4" />
          <circle class="transition-icon__dot" cx="420" cy="100" r="3" />
          <circle class="transition-icon__dot" cx="480" cy="100" r="3" />
        </template>

        <template v-else>
          <g transform="rotate(-45 450 80)">
            <rect x="435" y="42" width="18" height="13" rx="2" />
            <rect x="435" y="55" width="18" height="60" rx="3" />
            <path d="M 435 115 L 444 132 L 453 115 Z" />
          </g>
        </template>
      </g>
    </svg>
    <span>{{ fromLabel }} <b>→</b> {{ toLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '~/composables/useReducedMotion'

const props = defineProps<{
  fromLabel: string
  toLabel: string
  accent: string
  icon: 'flutter' | 'vue' | 'java' | 'design' | 'pencil'
}>()
const rootRef = ref<HTMLElement | null>(null)
const pathRef = ref<SVGPathElement | null>(null)
const iconRef = ref<SVGGElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!rootRef.value || prefersReducedMotion.value) return
  gsap.registerPlugin(ScrollTrigger)
  const context = gsap.context(() => {
    const pathLength = pathRef.value?.getTotalLength() ?? 800
    gsap.set(pathRef.value, { strokeDasharray: pathLength, strokeDashoffset: pathLength })
    gsap.set(iconRef.value, { opacity: 0, scale: 0.7, transformOrigin: '450px 80px' })

    const tl = gsap.timeline({ paused: true })
    tl.to(pathRef.value, { strokeDashoffset: 0, duration: 0.85, ease: 'power2.out' })
      .to(iconRef.value, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.7)' }, '-=0.35')

    ScrollTrigger.create({ trigger: rootRef.value, start: 'top 82%', once: true, onEnter: () => tl.play() })
  }, rootRef.value)
  return () => context.revert()
})
</script>

<style scoped>
.project-transition { display: grid; gap: 0.7rem; justify-items: center; padding: 1rem 0; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; }
.project-transition__svg { width: min(900px, 100%); height: auto; overflow: visible; }
.transition-path { stroke: var(--transition-accent); stroke-width: 1.2; stroke-linecap: round; opacity: 0.62; fill: none; }
.transition-icon path,
.transition-icon rect {
  fill: none;
  stroke: var(--transition-accent);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.transition-icon__dot { fill: var(--transition-accent); stroke: none; }
.project-transition span { opacity: 0.72; }
.project-transition b { padding: 0 0.4rem; color: var(--color-text); }
</style>
