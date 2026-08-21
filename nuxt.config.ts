// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    server: { allowedHosts: true },
  },
  css: ['~/assets/css/tokens.css', '~/assets/css/draw-inspired.css'],
  runtimeConfig: {
    public: {
      themePreset: process.env.NUXT_PUBLIC_THEME_PRESET || 'emerald-night',
      profileImage: process.env.NUXT_PUBLIC_PROFILE_IMAGE || '',
      cityArt: process.env.NUXT_PUBLIC_CITY_ART || '/art/lima-lines.svg',
      cityArtFallback: process.env.NUXT_PUBLIC_CITY_ART_FALLBACK || '',
      cvUrl: process.env.NUXT_PUBLIC_CV_URL || '/doc/CV_Set_Lopez_2025.pdf',
      enableSound: process.env.NUXT_PUBLIC_ENABLE_SOUND === 'true',
    },
  },
})
