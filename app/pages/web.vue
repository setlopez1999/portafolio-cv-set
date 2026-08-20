<template>
  <main class="web-route">
    <div class="web-route__panel">
      <p class="eyebrow">Proyectos web</p>
      <h1>Interfaces que conectan ideas con personas.</h1>
      <p>La sección de páginas web vive dentro del portafolio principal para mantener una experiencia continua y fácil de explorar.</p>
      <NuxtLink to="/#project-web" class="button">Ver proyectos web <span>↗</span></NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
useHead({ title: 'Proyectos web · Set Carlos' })
</script>

<style scoped>
.web-route { display: grid; min-height: 100vh; place-items: center; padding: 2rem; background: var(--color-bg); color: var(--color-text); }
.web-route__panel { width: min(680px, 100%); padding: clamp(2rem, 7vw, 5rem); border: 1px solid var(--color-line); border-radius: var(--radius-lg); background: radial-gradient(circle at top right, rgba(53,242,138,0.14), transparent 45%), var(--color-surface); box-shadow: var(--shadow-deep); }
.eyebrow { margin: 0 0 1rem; color: var(--color-primary); font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; }
h1 { max-width: 560px; margin: 0; font-family: var(--font-display); font-size: clamp(2.6rem, 7vw, 5.6rem); font-weight: 500; letter-spacing: -0.07em; line-height: 0.96; }
p:not(.eyebrow) { max-width: 500px; margin: 1.5rem 0 0; color: var(--color-text-muted); line-height: 1.8; }
.button { display: inline-flex; gap: 0.5rem; margin-top: 2rem; padding: 0.75rem 1rem; border-radius: 999px; background: var(--color-primary); color: var(--color-bg); font-weight: 700; text-decoration: none; }
.button span { color: var(--color-bg); }
</style>
