<template>
  <section :id="`project-${group.id}`" ref="sectionRef" class="project-group" :style="{ '--group-accent': group.accent }">
    <div class="project-group__header">
      <div>
        <p class="eyebrow">{{ group.kicker }}</p>
        <h3>{{ group.label }}</h3>
      </div>
      <p class="project-group__description">{{ group.description }}</p>
    </div>

    <div class="project-group__grid">
      <article v-for="project in group.projects" :key="project.title" class="project-card">
        <div class="project-card__media">
          <img v-if="project.image" :src="project.image" :alt="project.title" loading="lazy" />
          <div v-else class="project-card__placeholder" aria-hidden="true"><span>{{ project.title.slice(0, 2).toUpperCase() }}</span></div>
          <span v-if="project.status" class="project-card__status">{{ project.status }}</span>
        </div>
        <div class="project-card__body">
          <p class="project-card__subtitle">{{ project.subtitle }}</p>
          <h4>{{ project.title }}</h4>
          <p>{{ project.description }}</p>
          <div class="project-card__tech">
            <span v-for="tech in project.tech" :key="tech">{{ tech }}</span>
          </div>
          <a v-if="project.link" :href="project.link" target="_blank" rel="noreferrer" class="project-card__link">Ver proyecto <span>↗</span></a>
          <span v-else class="project-card__link project-card__link--muted">Detalles próximamente</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ProjectGroup } from '~/config/projects'
import { useReducedMotion } from '~/composables/useReducedMotion'
defineProps<{ group: ProjectGroup }>()
const sectionRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!sectionRef.value || prefersReducedMotion.value) return
  gsap.registerPlugin(ScrollTrigger)
  const context = gsap.context(() => {
    gsap.fromTo('.project-group__header',
      { x: -80, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
      { x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: sectionRef.value, start: 'top 88%', end: 'top 56%', scrub: 0.75 } },
    )

    gsap.utils.toArray<HTMLElement>('.project-card').forEach((card, index) => {
      const media = card.querySelector<HTMLElement>('.project-card__media')
      gsap.fromTo(card,
        { y: 90 + index * 16, rotate: index % 2 === 0 ? -4 : 4, scale: 0.93, clipPath: 'inset(12% 0 0 0 round 1rem)' },
        { y: 0, rotate: 0, scale: 1, clipPath: 'inset(0% 0 0 0 round 1rem)', ease: 'none', scrollTrigger: { trigger: card, start: 'top 93%', end: 'top 54%', scrub: 0.8 } },
      )
      if (media) {
        gsap.fromTo(media, { scale: 1.18, x: index % 2 === 0 ? -18 : 18 }, { scale: 1, x: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top 92%', end: 'top 46%', scrub: 0.8 } })
      }
    })
  }, sectionRef.value)
  return () => context.revert()
})
</script>

<style scoped>
.project-group { padding: 2rem 0 4.5rem; }
.project-group__header { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr); align-items: end; gap: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--color-line); }
.project-group__header h3 { margin: 0; color: var(--group-accent); font-family: var(--font-display); font-size: clamp(2.1rem, 5vw, 4rem); font-weight: 500; letter-spacing: -0.06em; }
.project-group__description { max-width: 500px; margin: 0; color: var(--color-text-muted); line-height: 1.75; }
.project-group__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 1.4rem; }
.project-card { overflow: hidden; transform-style: preserve-3d; will-change: transform, clip-path; border: 1px solid var(--color-line); border-radius: var(--radius-md); background: linear-gradient(160deg, rgba(255,255,255,0.055), rgba(12, 23, 18, 0.78)); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2); transition: transform 220ms var(--ease-out), border-color 220ms var(--ease-out); }
.project-card:hover { border-color: color-mix(in srgb, var(--group-accent), transparent 28%); transform: translateY(-5px); }
.project-card__media { position: relative; will-change: transform; height: 170px; overflow: hidden; background: linear-gradient(145deg, color-mix(in srgb, var(--group-accent), transparent 80%), rgba(0,0,0,0.22)); }
.project-card__media img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.86) contrast(1.02); transition: transform 420ms var(--ease-out); }
.project-card:hover .project-card__media img { transform: scale(1.04); }
.project-card__placeholder { display: grid; width: 100%; height: 100%; place-items: center; background: radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--group-accent), transparent 70%), transparent 45%); }
.project-card__placeholder span { display: grid; width: 4.6rem; aspect-ratio: 1; place-items: center; border: 1px solid var(--group-accent); border-radius: 50%; color: var(--group-accent); font-family: var(--font-mono); font-size: 0.8rem; }
.project-card__status { position: absolute; top: 0.75rem; left: 0.75rem; padding: 0.38rem 0.55rem; border: 1px solid rgba(255,255,255,0.16); border-radius: 999px; background: rgba(5, 8, 7, 0.65); color: var(--color-text); font-family: var(--font-mono); font-size: 0.57rem; }
.project-card__body { padding: 1.2rem; }
.project-card__subtitle { margin: 0; color: var(--group-accent); font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.07em; text-transform: uppercase; }
.project-card h4 { margin: 0.5rem 0 0; font-family: var(--font-display); font-size: 1.45rem; font-weight: 500; }
.project-card__body > p:not(.project-card__subtitle) { min-height: 4.5rem; margin: 0.7rem 0 0; color: var(--color-text-muted); font-size: 0.88rem; line-height: 1.65; }
.project-card__tech { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 1rem; }
.project-card__tech span { padding: 0.3rem 0.42rem; border-radius: 999px; background: rgba(255,255,255,0.06); color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.58rem; }
.project-card__link { display: inline-flex; gap: 0.45rem; margin-top: 1.25rem; color: var(--color-text); font-size: 0.8rem; font-weight: 600; text-decoration: none; }
.project-card__link span { color: var(--group-accent); }
.project-card__link:hover { color: var(--group-accent); }
.project-card__link--muted { color: var(--color-text-muted); font-weight: 400; }

@media (max-width: 900px) {
  .project-group__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 620px) {
  .project-group__header { grid-template-columns: 1fr; gap: 0.8rem; }
  .project-group__grid { grid-template-columns: 1fr; }
  .project-card__body > p:not(.project-card__subtitle) { min-height: auto; }
}
</style>
