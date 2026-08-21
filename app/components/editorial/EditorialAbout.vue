<template>
  <section id="sobre-mi" ref="sectionRef" class="draw-section draw-about" aria-labelledby="about-title">
    <div ref="wordsRef" class="draw-about__words" aria-hidden="true">
      <span class="draw-about__word">Code</span>
      <span class="draw-about__word">Learn</span>
      <span class="draw-about__word">Grow</span>
    </div>

    <div ref="copyRef" class="draw-about__copy">
      <p class="draw-section__eyebrow">03 · Sobre mí</p>
      <h2 id="about-title">Código, curiosidad y dirección.</h2>
      <p>{{ text }}</p>
      <div class="draw-about__meta">
        <span>Frontend + Mobile</span>
        <span>APIs + Producto</span>
        <span>Lima, Perú</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '~/composables/useReducedMotion'

const text = 'Me interesa crear soluciones que se entiendan, funcionen y puedan seguir creciendo. Actualmente fortalezco mis bases en software, cloud, diseño de videojuegos y desarrollo de productos digitales.'
const sectionRef = ref<HTMLElement | null>(null)
const wordsRef = ref<HTMLElement | null>(null)
const copyRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!sectionRef.value || prefersReducedMotion.value) return
  gsap.registerPlugin(ScrollTrigger)
  const context = gsap.context(() => {
    gsap.fromTo(wordsRef.value?.children ?? [],
      { x: -100, opacity: 0.1 },
      { x: 0, opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: sectionRef.value, start: 'top 82%', end: 'center 38%', scrub: 0.8 } },
    )
    gsap.fromTo(copyRef.value,
      { x: 90, clipPath: 'inset(0 0 0 100%)' },
      { x: 0, clipPath: 'inset(0 0 0 0%)', ease: 'none', scrollTrigger: { trigger: sectionRef.value, start: 'top 72%', end: 'center 35%', scrub: 0.8 } },
    )
  }, sectionRef.value)

  return () => context.revert()
})
</script>
