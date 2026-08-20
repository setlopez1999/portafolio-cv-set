<template>
  <div class="portfolio-shell">
    <AppearancePanel />
    <PreloaderScene />
    <LampRevealHero />
    <SectionTabs :items="navigationItems" />
    <main class="slide-stack">
      <SlideSection label="01 · Trayectoria" tone="green" :index="0">
        <JourneySection :items="journeyItems" />
      </SlideSection>
      <SlideSection label="02 · Proyectos" tone="black" :index="1">
        <ProjectGroups />
      </SlideSection>
      <SlideSection label="03 · Sobre mí" tone="charcoal" :index="2">
        <StorySection :blocks="storyBlocks" />
      </SlideSection>
      <SlideSection label="04 · Logros" tone="lime" :index="3">
        <AchievementsSection :items="achievementItems" />
      </SlideSection>
      <SlideSection label="05 · Contacto" tone="black" :index="4">
        <ContactSection />
      </SlideSection>
    </main>
    <footer class="site-footer section-wrap">
      <span>Set Carlos Lopez Quispe</span>
      <span>Software Developer · Lima, Perú · {{ year }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppearancePanel from '~/components/settings/AppearancePanel.vue'
import SlideSection from '~/components/layout/SlideSection.vue'
import PreloaderScene from '~/components/experience/PreloaderScene.vue'
import LampRevealHero from '~/components/experience/LampRevealHero.vue'
import SectionTabs from '~/components/navigation/SectionTabs.vue'
import JourneySection from '~/components/story/JourneySection.vue'
import StorySection from '~/components/story/StorySection.vue'
import ProjectGroups from '~/components/projects/ProjectGroups.vue'
import AchievementsSection from '~/components/achievements/AchievementsSection.vue'
import ContactSection from '~/components/contact/ContactSection.vue'
import { navigationItems, journeyItems, storyBlocks, achievementItems } from '~/config/sections'

const year = new Date().getFullYear()
useHead({ title: 'Set Carlos · Software Developer' })
</script>

<style scoped>
.slide-stack { position: relative; padding-bottom: clamp(2rem, 6vw, 6rem); }
.site-footer { display: flex; justify-content: space-between; gap: 1rem; padding-top: 1.6rem; padding-bottom: 1.6rem; border-top: 1px solid var(--color-line); color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.05em; }

@media (max-width: 680px) {
  .site-footer { flex-direction: column; }
}
</style>
