<template>
  <section id="contacto" ref="sectionRef" class="draw-section draw-contact" aria-labelledby="contact-title">
    <div>
      <p class="draw-section__eyebrow">05 · Contact</p>
      <h2 id="contact-title" class="draw-contact__heading">Let's build something real.</h2>
    </div>

    <div ref="detailsRef" class="draw-contact__details">
      <p>Si tienes un producto, una idea o un problema que resolver, puedes escribirme y lo conversamos.</p>
      <a :href="`mailto:${siteConfig.email}`">{{ siteConfig.email }} ↗</a>
      <a :href="siteConfig.linkedin" target="_blank" rel="noreferrer">LinkedIn ↗</a>
      <a :href="siteConfig.github" target="_blank" rel="noreferrer">GitHub ↗</a>
      <a :href="siteConfig.cvUrl" target="_blank" rel="noreferrer">Download CV ↗</a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteConfig } from '~/config/site'
import { useReducedMotion } from '~/composables/useReducedMotion'

const sectionRef = ref<HTMLElement | null>(null)
const detailsRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!sectionRef.value || !detailsRef.value || prefersReducedMotion.value) return
  gsap.registerPlugin(ScrollTrigger)
  const context = gsap.context(() => {
    gsap.fromTo('.draw-contact__heading',
      { x: -120, clipPath: 'inset(0 100% 0 0)' },
      { x: 0, clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: sectionRef.value, start: 'top 85%', end: 'center 45%', scrub: 0.8 } },
    )
    gsap.fromTo(detailsRef.value?.children ?? [],
      { x: 75, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.value, start: 'top 72%', end: 'center 40%', scrub: 0.7 } },
    )
  }, sectionRef.value)

  return () => context.revert()
})
</script>
