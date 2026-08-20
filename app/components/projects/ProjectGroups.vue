<template>
  <section id="proyectos" ref="sectionRef" class="projects section-padding">
    <div class="section-wrap">
      <div class="projects__intro">
        <div>
          <p class="eyebrow">02 · Proyectos</p>
          <h2 class="section-title">Ideas que toman forma.</h2>
        </div>
        <p class="muted-copy">Explora cada grupo para ver cómo mezclo lógica, diseño, interacción y desarrollo multiplataforma.</p>
      </div>

      <div class="projects__tabs" role="tablist" aria-label="Categorías de proyectos">
        <button
          v-for="group in groups"
          :key="group.id"
          type="button"
          role="tab"
          :aria-selected="activeId === group.id"
          :class="{ 'is-active': activeId === group.id }"
          @click="jumpTo(group.id)"
        >
          <span :style="{ background: group.accent }"></span>{{ group.label }}
        </button>
      </div>

      <div class="projects__groups">
        <template v-for="(group, index) in groups" :key="group.id">
          <ProjectGroupSection :group="group" />
          <ProjectTransition
            v-if="index < groups.length - 1"
            :from-label="group.label"
            :to-label="groups[index + 1].label"
            :accent="groups[index + 1].accent"
            :type="groups[index + 1].transition"
          />
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { projectGroups, type ProjectGroupId } from '~/config/projects'
import ProjectGroupSection from './ProjectGroupSection.vue'
import ProjectTransition from './ProjectTransition.vue'

const groups = projectGroups
const sectionRef = ref<HTMLElement | null>(null)
const activeId = ref<ProjectGroupId>(groups[0]?.id ?? 'apps')
let observer: IntersectionObserver | null = null

const jumpTo = (id: ProjectGroupId) => {
  document.getElementById(`project-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  const sections = groups.map((group) => document.getElementById(`project-${group.id}`)).filter(Boolean) as HTMLElement[]
  observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (visible) activeId.value = visible.target.id.replace('project-', '') as ProjectGroupId
  }, { threshold: [0.25, 0.55], rootMargin: '-12% 0px -65% 0px' })
  sections.forEach((section) => observer?.observe(section))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.projects { position: relative; }
.projects__intro { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.72fr); align-items: end; gap: 2rem; }
.projects__intro .muted-copy { max-width: 450px; margin: 0 0 0.2rem; }
.projects__tabs { position: sticky; top: 3.4rem; z-index: 10; display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 3.2rem; padding: 0.65rem; border: 1px solid var(--color-line); border-radius: 999px; background: rgba(5, 8, 7, 0.75); backdrop-filter: blur(16px); }
.projects__tabs button { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.52rem 0.72rem; border: 0; border-radius: 999px; background: transparent; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.62rem; transition: background 180ms var(--ease-out), color 180ms var(--ease-out); }
.projects__tabs button:hover,
.projects__tabs button.is-active { background: rgba(53, 242, 138, 0.11); color: var(--color-text); }
.projects__tabs button span { width: 0.38rem; height: 0.38rem; border-radius: 50%; box-shadow: 0 0 9px currentColor; }
.projects__groups { margin-top: 1.6rem; }

@media (max-width: 720px) {
  .projects__intro { grid-template-columns: 1fr; gap: 0.7rem; }
  .projects__tabs { top: 3.4rem; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
  .projects__tabs::-webkit-scrollbar { display: none; }
  .projects__tabs button { flex: 0 0 auto; }
}
</style>
