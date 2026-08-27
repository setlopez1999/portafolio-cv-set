<template>
  <div class="portfolio-shell">
    <AppearancePanel />
    <PreloaderScene />
    <LampRevealHero />
    <SectionTabs :items="navigationItems" />
    <SectionMorph shape="circle" mode="grow" from-color="#050807" to-color="#071310" accent-color="#35f28a" />
    <JourneySection :items="journeyItems" />
    <SectionMorph shape="diamond" mode="shrink" from-color="#071310" to-color="#0a121c" accent-color="#ffd27a" />
    <ProjectGroups />
    <SectionMorph shape="triangle" mode="grow" from-color="#0a121c" to-color="#140f0a" accent-color="#35f28a" />
    <StorySection :blocks="storyBlocks" />
    <SectionMorph shape="square" mode="shrink" from-color="#140f0a" to-color="#0d1712" accent-color="#ffd27a" />
    <AchievementsSection :items="achievementItems" />
    <SectionMorph shape="circle" mode="grow" from-color="#0d1712" to-color="#050807" accent-color="#35f28a" />
    <ContactSection />
    <footer class="site-footer section-wrap">
      <span>Set Carlos Lopez Quispe</span>
      <span>Software Developer · Lima, Perú · {{ year }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppearancePanel from '~/components/settings/AppearancePanel.vue'
import PreloaderScene from '~/components/experience/PreloaderScene.vue'
import LampRevealHero from '~/components/experience/LampRevealHero.vue'
import SectionTabs from '~/components/navigation/SectionTabs.vue'
import JourneySection from '~/components/story/JourneySection.vue'
import StorySection from '~/components/story/StorySection.vue'
import ProjectGroups from '~/components/projects/ProjectGroups.vue'
import AchievementsSection from '~/components/achievements/AchievementsSection.vue'
import ContactSection from '~/components/contact/ContactSection.vue'
import SectionMorph from '~/components/transitions/SectionMorph.vue'
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
