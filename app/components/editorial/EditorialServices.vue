<template>
  <section id="trayectoria" ref="sectionRef" class="draw-section draw-services" aria-labelledby="services-title">
    <div>
      <p class="draw-section__eyebrow">01 · What I build</p>
      <h2 id="services-title" class="draw-section__heading">From interface to product.</h2>
    </div>

    <div ref="listRef" class="draw-services__list">
      <div v-for="(item, index) in services" :key="item.label" class="draw-service-line">
        <span>{{ item.label }}</span>
        <span aria-hidden="true">0{{ index + 1 }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '~/composables/useReducedMotion'

const services = [
  { label: 'Frontend systems' },
  { label: 'Mobile experiences' },
  { label: 'API integration' },
  { label: 'Smart TV interfaces' },
  { label: 'Product thinking' },
]

const sectionRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!sectionRef.value || !listRef.value || prefersReducedMotion.value) return
  gsap.registerPlugin(ScrollTrigger)
  const context = gsap.context(() => {
    gsap.fromTo(listRef.value?.children ?? [],
      { x: 120, clipPath: 'inset(0 100% 0 0)' },
      { x: 0, clipPath: 'inset(0 0% 0 0)', stagger: 0.1, ease: 'none', scrollTrigger: { trigger: sectionRef.value, start: 'top 80%', end: 'center 30%', scrub: 0.8 } },
    )
  }, sectionRef.value)

  return () => context.revert()
})
</script>
