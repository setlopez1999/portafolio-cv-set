<template>
  <div class="draw-marquee" aria-label="Tecnologías y áreas de trabajo">
    <div class="draw-marquee__track">
      <template v-for="copy in 2" :key="copy">
        <span v-for="item in items" :key="`${copy}-${item}`">{{ item }} <b aria-hidden="true">✳</b></span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const items = ['Flutter', 'Kotlin', 'APIs', 'Vue / Nuxt', 'Docker', 'Smart TV', 'Product thinking']
</script>

<style scoped>
.draw-marquee__track b {
  color: var(--draw-lime);
  font-size: 0.6em;
}
</style>
