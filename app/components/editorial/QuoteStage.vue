<template>
  <section ref="sectionRef" class="draw-quote-stage" aria-labelledby="quote-title">
    <p id="quote-title" class="draw-quote-stage__intro">01 · A way of working</p>
    <article v-for="(quote, index) in quotes" :key="quote.text" class="draw-quote-card">
      <span class="draw-quote-card__number">0{{ index + 1 }}</span>
      <p class="draw-quote-card__text">{{ quote.text }}</p>
      <span class="draw-quote-card__mark" aria-hidden="true">{{ quote.mark }}</span>
    </article>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '~/composables/useReducedMotion'

const quotes = [
  { text: 'Build', mark: '↗' },
  { text: 'With', mark: '×' },
  { text: 'Intent', mark: '✳' },
]

const sectionRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!sectionRef.value || prefersReducedMotion.value) return
  gsap.registerPlugin(ScrollTrigger)

  const context = gsap.context(() => {
    gsap.fromTo('.draw-quote-card',
      { y: 130, opacity: 0.15, rotate: 0 },
      {
        y: 0,
        opacity: 1,
        rotate: (index) => [0, 1.2, -1][index] ?? 0,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.value, start: 'top 78%', end: 'center 38%', scrub: 0.75 },
      },
    )
  }, sectionRef.value)

  return () => context.revert()
})
</script>
