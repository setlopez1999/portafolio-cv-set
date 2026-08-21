<template>
  <section id="inicio" ref="sectionRef" class="draw-hero" aria-labelledby="hero-title">
    <div class="draw-hero__grain" aria-hidden="true"></div>

    <div ref="typeRef" class="draw-hero__type" aria-label="Build products that work">
      <span class="draw-hero__word" style="--word-shift: 0px">Build</span>
      <span class="draw-hero__word" style="--word-shift: 4vw">Products</span>
      <span class="draw-hero__word" style="--word-shift: 1vw">That</span>
      <span class="draw-hero__word" style="--word-shift: 7vw">Work</span>
    </div>

    <figure ref="mediaRef" class="draw-hero__media">
      <span class="draw-hero__crosshair" aria-hidden="true"></span>
      <img :src="siteConfig.profileImage" :alt="`Retrato de ${siteConfig.name}`" />
      <span class="draw-hero__corner" aria-hidden="true"></span>
      <figcaption class="draw-hero__caption">{{ siteConfig.location }} · 2026</figcaption>
    </figure>

    <div ref="sideRef" class="draw-hero__side">
      <p>{{ siteConfig.role }}</p>
      <p>{{ siteConfig.hero.description }}</p>
    </div>

    <a class="draw-scroll-mark" href="#trayectoria">Scroll to explore</a>

    <h1 id="hero-title" class="sr-only">{{ siteConfig.name }} — {{ siteConfig.role }}</h1>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteConfig } from '~/config/site'
import { useReducedMotion } from '~/composables/useReducedMotion'

const sectionRef = ref<HTMLElement | null>(null)
const typeRef = ref<HTMLElement | null>(null)
const mediaRef = ref<HTMLElement | null>(null)
const sideRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!sectionRef.value || prefersReducedMotion.value) return
  gsap.registerPlugin(ScrollTrigger)

  const context = gsap.context(() => {
    const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
    intro.from('.draw-hero__word', { yPercent: 115, rotate: 4, opacity: 0, stagger: 0.08, duration: 0.9 })
      .from(mediaRef.value, { y: 70, rotate: 5, opacity: 0, duration: 1 }, '-=0.62')
      .from(sideRef.value, { x: 42, opacity: 0, duration: 0.7 }, '-=0.54')

    gsap.to(typeRef.value, {
      xPercent: -7,
      scrollTrigger: { trigger: sectionRef.value, start: 'top top', end: 'bottom top', scrub: 0.8 },
    })
    gsap.to(mediaRef.value, {
      y: -84,
      rotate: 4,
      scrollTrigger: { trigger: sectionRef.value, start: 'top top', end: 'bottom top', scrub: 1.1 },
    })
    gsap.to(sideRef.value, {
      y: -28,
      scrollTrigger: { trigger: sectionRef.value, start: 'top top', end: 'bottom top', scrub: 1.3 },
    })
  }, sectionRef.value)

  return () => context.revert()
})
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
