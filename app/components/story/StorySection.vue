<template>
  <section id="sobre-mi" ref="sectionRef" class="story section-padding">
    <div class="section-wrap">
      <div class="story__heading reveal-item">
        <p class="eyebrow">03 · Sobre mí</p>
        <h2 class="section-title">Código, curiosidad y dirección.</h2>
      </div>

      <div class="story__blocks">
        <article v-for="block in blocks" :key="block.id" class="story-block reveal-item" :class="`story-block--${block.align}`">
          <div class="story-block__media" :style="{ '--story-accent': block.accent }">
            <video v-if="block.mediaType === 'video' && block.media" :src="block.media" muted loop playsinline autoplay></video>
            <img v-else-if="block.mediaType === 'image' && block.media" :src="block.media" :alt="block.title" />
            <img v-else-if="block.mediaType === 'svg' && block.media" :src="block.media" :alt="block.title" />
            <div v-else class="story-block__orb" aria-hidden="true"><span>{{ block.id.slice(0, 2).toUpperCase() }}</span></div>
          </div>
          <div class="story-block__copy">
            <p class="eyebrow">{{ block.eyebrow }}</p>
            <h3>{{ block.title }}</h3>
            <p>{{ block.text }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { StoryBlock } from '~/config/sections'
import { useReducedMotion } from '~/composables/useReducedMotion'
defineProps<{ blocks: StoryBlock[] }>()
const sectionRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!sectionRef.value || prefersReducedMotion.value) return
  gsap.registerPlugin(ScrollTrigger)
  const context = gsap.context(() => {
    const blocks = gsap.utils.toArray<HTMLElement>('.story-block')
    blocks.forEach((block, index) => {
      const media = block.querySelector<HTMLElement>('.story-block__media')
      const copy = block.querySelector<HTMLElement>('.story-block__copy')
      const direction = index % 2 === 0 ? -1 : 1
      if (!media || !copy) return

      gsap.fromTo(media,
        { clipPath: index % 2 === 0 ? 'inset(0 100% 0 0 round 1.5rem)' : 'inset(0 0 0 100% round 1.5rem)', y: 70, rotate: direction * -2 },
        { clipPath: 'inset(0 0% 0 0% round 1.5rem)', y: 0, rotate: 0, ease: 'none', scrollTrigger: { trigger: block, start: 'top 86%', end: 'top 42%', scrub: 0.8 } },
      )
      gsap.fromTo(copy,
        { x: direction * 70, opacity: 0.2, filter: 'blur(10px)', clipPath: 'inset(0 0 0 18%)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', clipPath: 'inset(0 0 0 0%)', ease: 'none', scrollTrigger: { trigger: block, start: 'top 82%', end: 'top 48%', scrub: 0.75 } },
      )
    })
  }, sectionRef.value)
  return () => context.revert()
})
</script>

<style scoped>
.story__heading { max-width: 640px; }
.story__blocks { display: grid; gap: clamp(4rem, 10vw, 9rem); margin-top: 5rem; }
.story-block { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr); align-items: center; gap: clamp(2rem, 7vw, 8rem); }
.story-block--right { grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr); }
.story-block--right .story-block__media { order: 2; }
.story-block__media { position: relative; display: grid; min-height: 270px; overflow: hidden; place-items: center; border: 1px solid var(--color-line); border-radius: var(--radius-lg); background: linear-gradient(145deg, rgba(53, 242, 138, 0.12), rgba(12, 23, 18, 0.4)); box-shadow: var(--shadow-deep); }
.story-block__media::before { content: ''; position: absolute; inset: 1.5rem; border: 1px dashed color-mix(in srgb, var(--story-accent), transparent 50%); border-radius: 50%; transform: rotate(-14deg); }
.story-block__media::after { content: ''; position: absolute; inset: auto 12% 15%; height: 1px; background: var(--story-accent); box-shadow: 0 0 18px var(--story-accent); }
.story-block__media img,
.story-block__media video { position: relative; z-index: 1; width: 100%; height: 100%; min-height: 270px; object-fit: cover; }
.story-block__orb { position: relative; z-index: 1; display: grid; width: 8rem; aspect-ratio: 1; place-items: center; border: 1px solid var(--story-accent); border-radius: 50%; color: var(--story-accent); box-shadow: 0 0 50px color-mix(in srgb, var(--story-accent), transparent 72%); font-family: var(--font-mono); letter-spacing: 0.12em; }
.story-block__copy h3 { margin: 0; font-family: var(--font-display); font-size: clamp(1.9rem, 4vw, 3.5rem); font-weight: 500; letter-spacing: -0.055em; line-height: 1; }
.story-block__copy > p:last-child { max-width: 520px; margin: 1.2rem 0 0; color: var(--color-text-muted); line-height: 1.85; }

@media (max-width: 760px) {
  .story-block,
  .story-block--right { grid-template-columns: 1fr; gap: 1.5rem; }
  .story-block--right .story-block__media { order: initial; }
  .story-block__media { min-height: 210px; }
  .story-block__media img,
  .story-block__media video { min-height: 210px; }
}
</style>
