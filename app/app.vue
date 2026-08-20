<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'es', class: 'scroll-smooth' },
  meta: [
    { name: 'theme-color', content: '#050807' },
    { name: 'description', content: 'Portafolio de Set Carlos Lopez Quispe, Software Developer especializado en frontend, mobile y APIs.' },
  ],
})
</script>
