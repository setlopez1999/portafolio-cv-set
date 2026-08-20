<template>
  <article
    ref="frameRef"
    class="slide-frame"
    :class="`slide-frame--${tone}`"
    :style="{ '--slide-index': index }"
  >
    <div ref="surfaceRef" class="slide-frame__surface" aria-hidden="true">
      <span class="slide-frame__grid"></span>
      <span class="slide-frame__edge"></span>
    </div>

    <div ref="blocksRef" class="slide-frame__blocks" aria-hidden="true">
      <span v-for="block in 4" :key="block" class="slide-frame__block"></span>
    </div>

    <div class="slide-frame__content">
      <header v-if="label || title" class="slide-frame__header">
        <p v-if="label" class="slide-frame__label">{{ label }}</p>
        <h2 v-if="title" class="slide-frame__title">{{ title }}</h2>
      </header>
      <div class="slide-frame__slot">
        <slot />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '~/composables/useReducedMotion'

type SlideTone = 'green' | 'black' | 'charcoal' | 'lime'

defineProps<{
  label?: string
  title?: string
  tone?: SlideTone
  index?: number
}>()

const frameRef = ref<HTMLElement | null>(null)
const surfaceRef = ref<HTMLElement | null>(null)
const blocksRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!frameRef.value || prefersReducedMotion.value) return
  gsap.registerPlugin(ScrollTrigger)
  const context = gsap.context(() => {
    gsap.fromTo(surfaceRef.value,
      { y: 72, clipPath: 'inset(10% 0 0 0)', opacity: 0.42 },
      { y: 0, clipPath: 'inset(0% 0 0 0)', opacity: 1, ease: 'none', scrollTrigger: { trigger: frameRef.value, start: 'top 94%', end: 'top 58%', scrub: 0.7 } },
    )

    gsap.fromTo(blocksRef.value?.children ?? [],
      { x: -48, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
      { x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', stagger: 0.08, ease: 'none', scrollTrigger: { trigger: frameRef.value, start: 'top 88%', end: 'top 52%', scrub: 0.8 } },
    )
  }, frameRef.value)

  return () => context.revert()
})
</script>

<style scoped>
.slide-frame {
  --slide-bg: #0b1711;
  --slide-ink: var(--color-text);
  --slide-accent: var(--color-primary);
  position: relative;
  z-index: calc(20 + var(--slide-index, 0));
  min-height: min(74svh, 760px);
  margin-inline: auto;
  isolation: isolate;
}

.slide-frame + .slide-frame {
  margin-top: clamp(-8rem, -10vw, -4rem);
}

.slide-frame--green {
  --slide-bg: linear-gradient(135deg, #123d29 0%, #07100b 74%);
  --slide-accent: #70ffa7;
}

.slide-frame--black {
  --slide-bg: linear-gradient(145deg, #050807 0%, #0d1712 74%);
  --slide-accent: #35f28a;
}

.slide-frame--charcoal {
  --slide-bg: linear-gradient(145deg, #151b18 0%, #060908 72%);
  --slide-accent: #bdfccf;
}

.slide-frame--lime {
  --slide-bg: linear-gradient(145deg, #1b2910 0%, #071007 72%);
  --slide-accent: #c7ff60;
}

.slide-frame__surface {
  position: absolute;
  inset: 0;
  z-index: -2;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--slide-accent), transparent 64%);
  border-radius: 2rem 2rem 0.75rem 0.75rem;
  background: var(--slide-bg);
  box-shadow: 0 26px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  will-change: transform, clip-path, opacity;
}

.slide-frame__grid {
  position: absolute;
  inset: 0;
  opacity: 0.14;
  background-image: linear-gradient(color-mix(in srgb, var(--slide-accent), transparent 72%) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--slide-accent), transparent 72%) 1px, transparent 1px);
  background-size: 4rem 4rem;
  mask-image: linear-gradient(180deg, black, transparent 80%);
}

.slide-frame__edge {
  position: absolute;
  top: 0;
  right: 9%;
  width: 24%;
  height: 0.35rem;
  background: var(--slide-accent);
  box-shadow: 0 0 24px color-mix(in srgb, var(--slide-accent), transparent 38%);
}

.slide-frame__blocks {
  position: absolute;
  top: 2.1rem;
  right: 2rem;
  z-index: 2;
  display: flex;
  gap: 0.34rem;
  pointer-events: none;
}

.slide-frame__block {
  display: block;
  width: clamp(1.8rem, 4vw, 4.6rem);
  height: 0.32rem;
  background: var(--slide-accent);
  box-shadow: 0 0 16px color-mix(in srgb, var(--slide-accent), transparent 42%);
  will-change: transform, clip-path, opacity;
}

.slide-frame__block:nth-child(2) { width: clamp(1rem, 2vw, 2.3rem); opacity: 0.7; }
.slide-frame__block:nth-child(3) { width: clamp(2.6rem, 6vw, 6rem); opacity: 0.45; }
.slide-frame__block:nth-child(4) { width: clamp(1.3rem, 3vw, 3.4rem); opacity: 0.75; }

.slide-frame__content {
  position: relative;
  min-height: min(74svh, 760px);
  padding: clamp(4.6rem, 8vw, 7.5rem) clamp(1rem, 5vw, 5.5rem) clamp(3rem, 6vw, 5rem);
  color: var(--slide-ink);
}

.slide-frame__header {
  position: absolute;
  top: clamp(2rem, 3vw, 3.2rem);
  left: clamp(1rem, 5vw, 5.5rem);
  z-index: 3;
  pointer-events: none;
}

.slide-frame__label {
  margin: 0;
  color: var(--slide-accent);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.slide-frame__title {
  display: none;
}

.slide-frame__slot {
  position: relative;
  z-index: 1;
}

:deep(.slide-frame__slot > section.section-padding) {
  padding-top: 0;
  padding-bottom: 0;
}

:deep(.slide-frame__slot > section.section-padding > .section-wrap) {
  width: 100%;
}

:deep(.slide-frame__slot > section .eyebrow) {
  display: none;
}

:deep(.slide-frame__slot .section-title) {
  text-wrap: balance;
}

@media (max-width: 760px) {
  .slide-frame {
    min-height: auto;
  }

  .slide-frame + .slide-frame {
    margin-top: -3rem;
  }

  .slide-frame__surface,
  .slide-frame__content {
    min-height: 0;
  }

  .slide-frame__content {
    padding: 4rem 1rem 3rem;
  }

  .slide-frame__header {
    top: 1.4rem;
    left: 1rem;
  }

  .slide-frame__blocks {
    top: 1.4rem;
    right: 1rem;
  }
}
</style>
