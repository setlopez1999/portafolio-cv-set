<template>
  <section id="logros" ref="sectionRef" class="draw-section draw-proof" aria-labelledby="proof-title">
    <p class="draw-section__eyebrow">04 · Proof of work</p>
    <h2 id="proof-title" class="draw-section__heading">Already in motion.</h2>

    <div class="draw-proof__grid">
      <article v-for="item in items" :key="item.label" class="draw-proof__item">
        <small>{{ item.label }}</small>
        <strong>{{ item.value }}</strong>
        <p>{{ item.detail }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { achievementItems } from '~/config/sections'
import { useReducedMotion } from '~/composables/useReducedMotion'

const items = achievementItems
const sectionRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!sectionRef.value || prefersReducedMotion.value) return
  gsap.registerPlugin(ScrollTrigger)
  const context = gsap.context(() => {
    gsap.fromTo('.draw-proof__item',
      { y: 55, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
      { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.value, start: 'top 78%', end: 'center 42%', scrub: 0.65 } },
    )
  }, sectionRef.value)

  return () => context.revert()
})
</script>
