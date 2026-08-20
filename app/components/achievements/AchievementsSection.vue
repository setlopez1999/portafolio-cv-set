<template>
  <section id="logros" ref="sectionRef" class="achievements section-padding">
    <div class="section-wrap">
      <div class="achievements__intro reveal-item">
        <div>
          <p class="eyebrow">04 · Logros</p>
          <h2 class="section-title">Lo que ya está en movimiento.</h2>
        </div>
        <p class="muted-copy">Una selección breve de hitos que resumen mi recorrido actual y dejan espacio para todo lo que sigue.</p>
      </div>

      <div class="achievements__grid">
        <article v-for="item in items" :key="item.label" class="achievement-card reveal-item">
          <p>{{ item.label }}</p>
          <strong>{{ item.value }}</strong>
          <span>{{ item.detail }}</span>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '~/composables/useReducedMotion'
defineProps<{ items: { label: string; value: string; detail: string }[] }>()
const sectionRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!sectionRef.value || prefersReducedMotion.value) return
  gsap.registerPlugin(ScrollTrigger)
  const context = gsap.context(() => {
    gsap.from('.reveal-item', { y: 28, opacity: 0, stagger: 0.1, duration: 0.65, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.value, start: 'top 75%', once: true } })
  }, sectionRef.value)
  return () => context.revert()
})
</script>

<style scoped>
.achievements__intro { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.72fr); align-items: end; gap: 2rem; }
.achievements__intro .muted-copy { max-width: 450px; margin: 0; }
.achievements__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; margin-top: 4rem; border: 1px solid var(--color-line); background: var(--color-line); }
.achievement-card { min-height: 190px; padding: 1.4rem; background: var(--color-bg-elevated); transition: background 220ms var(--ease-out); }
.achievement-card:hover { background: var(--color-surface); }
.achievement-card p { margin: 0; color: var(--color-primary); font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; }
.achievement-card strong { display: block; margin-top: 2.5rem; color: var(--color-text); font-family: var(--font-display); font-size: clamp(1.4rem, 3vw, 2.15rem); font-weight: 500; letter-spacing: -0.05em; }
.achievement-card span { display: block; margin-top: 0.55rem; color: var(--color-text-muted); font-size: 0.82rem; line-height: 1.55; }

@media (max-width: 760px) {
  .achievements__intro { grid-template-columns: 1fr; gap: 0.75rem; }
  .achievements__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 420px) { .achievements__grid { grid-template-columns: 1fr; } }
</style>
