<template>
  <div class="portfolio-shell">
    <PreloaderScene />
    <LampRevealHero />
    <SectionTabs :items="navigationItems" />
    <JourneySection :items="journeyItems" />
    <ProjectGroups />
    <StorySection :blocks="storyBlocks" />
    <AchievementsSection :items="achievementItems" />
    <ContactSection />
    <footer class="site-footer section-wrap">
      <span>Set Carlos Lopez Quispe</span>
      <span>Software Developer · Lima, Perú · {{ year }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
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
.site-footer { display: flex; justify-content: space-between; gap: 1rem; padding-top: 1.6rem; padding-bottom: 1.6rem; border-top: 1px solid var(--color-line); color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.05em; }

@media (max-width: 680px) {
  .site-footer { flex-direction: column; }
}
</style>
