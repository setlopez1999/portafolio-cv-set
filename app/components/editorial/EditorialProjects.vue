<template>
  <section id="proyectos" ref="sectionRef" class="draw-section draw-projects" aria-labelledby="projects-title">
    <div class="draw-projects__intro">
      <div>
        <p class="draw-section__eyebrow">02 · Work / Selected projects</p>
        <h2 id="projects-title" class="draw-section__heading">Ideas take shape.</h2>
      </div>
      <p>Una selección de productos, interfaces y experimentos donde mezclo lógica, diseño, interacción y desarrollo multiplataforma.</p>
    </div>

    <div class="draw-project-list">
      <template v-for="group in projectGroups" :key="group.id">
        <div class="draw-project-group-label">
          <span>{{ group.label }}</span>
          <span>{{ group.kicker }}</span>
        </div>
        <article
          v-for="(project, projectIndex) in group.projects"
          :key="`${group.id}-${project.title}`"
          class="draw-project-item"
          :style="{ '--project-accent': group.accent }"
        >
          <span class="draw-project-item__index">{{ String(projectIndex + 1).padStart(2, '0') }}</span>
          <div class="draw-project-item__media">
            <img v-if="project.image" :src="project.image" :alt="project.title" loading="lazy" />
            <div v-else class="draw-project-item__placeholder" aria-hidden="true">{{ project.title.slice(0, 2).toUpperCase() }}</div>
          </div>
          <div class="draw-project-item__copy">
            <p class="draw-project-item__kicker">{{ project.subtitle }}</p>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <a v-if="project.link" class="draw-project-item__link" :href="project.link" target="_blank" rel="noreferrer">View project ↗</a>
          </div>
          <div class="draw-project-item__meta">
            <span class="draw-project-item__status">{{ project.status }}</span>
            <div class="draw-project-item__tech">
              <span v-for="tech in project.tech" :key="tech">{{ tech }}</span>
            </div>
          </div>
        </article>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projectGroups } from '~/config/projects'
import { useReducedMotion } from '~/composables/useReducedMotion'

const sectionRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion } = useReducedMotion()

onMounted(() => {
  if (!sectionRef.value || prefersReducedMotion.value) return
  gsap.registerPlugin(ScrollTrigger)
  const context = gsap.context(() => {
    gsap.fromTo('.draw-projects__intro > *',
      { y: 90, clipPath: 'inset(0 0 100% 0)' },
      { y: 0, clipPath: 'inset(0 0 0% 0)', stagger: 0.1, ease: 'none', scrollTrigger: { trigger: sectionRef.value, start: 'top 80%', end: 'top 35%', scrub: 0.65 } },
    )
    gsap.fromTo('.draw-project-group-label',
      { x: -70, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: sectionRef.value, start: 'top 82%', end: 'center 30%', scrub: 0.8 } },
    )
    gsap.fromTo('.draw-project-item',
      { y: 76, opacity: 0.2, clipPath: 'inset(10% 0 0 0)' },
      { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', stagger: 0.13, ease: 'none', scrollTrigger: { trigger: sectionRef.value, start: 'top 75%', end: 'bottom 70%', scrub: 0.72 } },
    )
    gsap.to('.draw-project-item__media', {
      yPercent: -7,
      stagger: 0.08,
      ease: 'none',
      scrollTrigger: { trigger: sectionRef.value, start: 'top bottom', end: 'bottom top', scrub: 1 },
    })
  }, sectionRef.value)

  return () => context.revert()
})
</script>

<style scoped>
.draw-project-group-label {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid rgba(5, 8, 7, 0.34);
  color: #168a4e;
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}
</style>
