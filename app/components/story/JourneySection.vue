<template>
  <section id="trayectoria" ref="sectionRef" class="journey section-padding">
    <div class="section-wrap">
      <div class="journey__intro reveal-item">
        <p class="eyebrow">01 · Trayectoria</p>
        <h2 class="section-title">De la idea al producto.</h2>
        <p class="muted-copy">Una evolución construida entre aprendizaje, práctica y proyectos que me acercan cada vez más al desarrollo de software.</p>
      </div>

      <div class="journey__line" aria-hidden="true"><span ref="lineRef"></span></div>
      <div class="journey__items">
        <article v-for="(item, index) in items" :key="item.date" class="journey-card reveal-item">
          <span class="journey-card__index">0{{ index + 1 }}</span>
          <p class="journey-card__date">{{ item.date }}</p>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
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
defineProps<{ items: { date: string; title: string; text: string }[] }>()
const sectionRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!sectionRef.value || prefersReducedMotion.value) return
  gsap.registerPlugin(ScrollTrigger)
  const context = gsap.context(() => {
    gsap.fromTo('.journey__intro',
      { x: -80, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
      { x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: sectionRef.value, start: 'top 84%', end: 'top 54%', scrub: 0.8 } },
    )

    gsap.utils.toArray<HTMLElement>('.journey-card').forEach((card, index) => {
      gsap.fromTo(card,
        { y: 100 + index * 18, rotate: index % 2 === 0 ? -3 : 3, opacity: 0.35, clipPath: 'inset(16% 0 0 0 round 1rem)' },
        { y: 0, rotate: 0, opacity: 1, clipPath: 'inset(0% 0 0 0 round 1rem)', ease: 'none', scrollTrigger: { trigger: card, start: 'top 92%', end: 'top 52%', scrub: 0.75 } },
      )
    })

    const media = gsap.matchMedia()
    media.add('(min-width: 761px)', () => {
      gsap.fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, ease: 'none', transformOrigin: 'left center', scrollTrigger: { trigger: sectionRef.value, start: 'top 70%', end: 'bottom 60%', scrub: 0.8 } })
    })
    media.add('(max-width: 760px)', () => {
      gsap.fromTo(lineRef.value, { scaleY: 0 }, { scaleY: 1, ease: 'none', transformOrigin: 'top center', scrollTrigger: { trigger: sectionRef.value, start: 'top 70%', end: 'bottom 60%', scrub: 0.8 } })
    })
  }, sectionRef.value)
  return () => context.revert()
})
</script>

<style scoped>
.journey { position: relative; }
.journey__intro { display: grid; max-width: 650px; gap: 0.4rem; }
.journey__intro .muted-copy { max-width: 560px; margin: 1rem 0 0; }
.journey__items { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 4rem; }
.journey__line { position: absolute; top: 18.5rem; left: 50%; width: min(1180px, calc(100% - 5rem)); height: 1px; transform: translateX(-50%); background: var(--color-line); }
.journey__line span { display: block; width: 100%; height: 100%; transform-origin: left center; will-change: transform; background: var(--color-primary); box-shadow: 0 0 18px rgba(53, 242, 138, 0.6); }
.journey-card { position: relative; min-height: 220px; padding: 1.5rem; border: 1px solid var(--color-line); border-radius: var(--radius-md); background: rgba(12, 23, 18, 0.66); }
.journey-card::before { content: ''; position: absolute; top: -0.34rem; left: 1.5rem; width: 0.65rem; height: 0.65rem; border: 2px solid var(--color-bg); border-radius: 50%; background: var(--color-primary); box-shadow: 0 0 16px rgba(53, 242, 138, 0.75); }
.journey-card__index { color: var(--color-primary); font-family: var(--font-mono); font-size: 0.7rem; }
.journey-card__date { margin: 2rem 0 0.6rem; color: var(--color-lamp); font-family: var(--font-mono); font-size: 0.75rem; }
.journey-card h3 { margin: 0; font-family: var(--font-display); font-size: 1.35rem; font-weight: 500; }
.journey-card p:last-child { margin: 0.8rem 0 0; color: var(--color-text-muted); line-height: 1.65; }

@media (max-width: 760px) {
  .journey__items { grid-template-columns: 1fr; gap: 1rem; margin-top: 2rem; }
  .journey__line { top: 20rem; bottom: 2rem; left: 1rem; width: 1px; height: auto; transform: none; }
  .journey__line span { width: 100%; height: 100%; transform-origin: top center; }
  .journey-card { padding-left: 2.2rem; }
  .journey-card::before { top: 2rem; left: -0.32rem; }
}
</style>
