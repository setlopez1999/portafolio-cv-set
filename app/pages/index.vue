<template>
  <div class="draw-page">
    <AppearancePanel />
    <EditorialNav :items="navigationItems" @open-settings="openSettings" />

    <main>
      <EditorialHero />
      <QuoteStage />
      <TechMarquee />
      <EditorialServices />
      <EditorialProjects />
      <EditorialAbout />
      <EditorialProof />
      <EditorialContact />
    </main>

    <footer class="draw-footer">
      <span>{{ siteConfig.shortName }} / {{ siteConfig.role }}</span>
      <span>{{ siteConfig.location }} / {{ year }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppearancePanel from '~/components/settings/AppearancePanel.vue'
import EditorialNav from '~/components/editorial/EditorialNav.vue'
import EditorialHero from '~/components/editorial/EditorialHero.vue'
import QuoteStage from '~/components/editorial/QuoteStage.vue'
import TechMarquee from '~/components/editorial/TechMarquee.vue'
import EditorialServices from '~/components/editorial/EditorialServices.vue'
import EditorialProjects from '~/components/editorial/EditorialProjects.vue'
import EditorialAbout from '~/components/editorial/EditorialAbout.vue'
import EditorialProof from '~/components/editorial/EditorialProof.vue'
import EditorialContact from '~/components/editorial/EditorialContact.vue'
import { navigationItems } from '~/config/sections'
import { siteConfig } from '~/config/site'
import { useAppearancePreferences } from '~/composables/useAppearancePreferences'

const year = new Date().getFullYear()
const { isOpen } = useAppearancePreferences()
const openSettings = () => { isOpen.value = true }

useHead({
  title: 'Set Carlos — Software Developer',
  meta: [
    { name: 'description', content: 'Portafolio editorial de Set Carlos: software, mobile, APIs y producto digital.' },
  ],
})
</script>
