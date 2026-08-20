<template>
  <nav class="section-tabs" aria-label="Navegación principal del portafolio">
    <div class="section-tabs__inner">
      <a
        v-for="item in items"
        :key="item.id"
        :href="`#${item.id}`"
        class="section-tabs__item"
        :class="{ 'is-active': activeId === item.id }"
        @click.prevent="scrollTo(item.id)"
      >
        <span class="section-tabs__dot"></span>
        {{ item.label }}
      </a>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { navigationItems } from '~/config/sections'

type NavItem = (typeof navigationItems)[number]
const props = defineProps<{ items: NavItem[] }>()
const activeId = ref(props.items[0]?.id ?? '')
let observer: IntersectionObserver | null = null

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

onMounted(() => {
  const sections = props.items.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[]
  observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (visible) activeId.value = visible.target.id
  }, { threshold: [0.18, 0.45, 0.7], rootMargin: '-20% 0px -60% 0px' })
  sections.forEach((section) => observer?.observe(section))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.section-tabs {
  position: sticky;
  top: 0;
  z-index: 20;
  width: 100%;
  border-bottom: 1px solid rgba(189, 252, 207, 0.09);
  background: rgba(5, 8, 7, 0.76);
  backdrop-filter: blur(18px);
}

.section-tabs__inner {
  display: flex;
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  overflow-x: auto;
  scrollbar-width: none;
}

.section-tabs__inner::-webkit-scrollbar { display: none; }

.section-tabs__item {
  display: inline-flex;
  min-height: 3.4rem;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.8rem;
  border-bottom: 1px solid transparent;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;
  transition: color 180ms var(--ease-out), border-color 180ms var(--ease-out);
}

.section-tabs__item:hover,
.section-tabs__item.is-active { border-color: var(--color-primary); color: var(--color-text); }
.section-tabs__dot { width: 0.3rem; height: 0.3rem; border-radius: 50%; background: currentColor; opacity: 0.45; }
.section-tabs__item.is-active .section-tabs__dot { background: var(--color-primary); box-shadow: 0 0 0.6rem var(--color-primary); opacity: 1; }

@media (min-width: 768px) {
  .section-tabs__inner { width: min(1180px, calc(100% - 5rem)); justify-content: center; }
  .section-tabs__item { padding-inline: 1rem; }
}
</style>
