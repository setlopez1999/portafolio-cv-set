<template>
  <header class="draw-nav" aria-label="Navegación principal">
    <a class="draw-nav__brand" href="#inicio">
      <strong>Set Carlos</strong>
      <span>Software Developer</span>
    </a>

    <nav class="draw-nav__links" aria-label="Secciones">
      <a v-for="item in items" :key="item.id" :href="`#${item.id}`">{{ item.label }}</a>
    </nav>

    <button class="draw-nav__settings" type="button" @click="$emit('open-settings')">
      Ajustes <span aria-hidden="true">⌄</span>
    </button>
  </header>
</template>

<script setup lang="ts">
defineProps<{ items: Array<{ id: string; label: string }> }>()
defineEmits<{ 'open-settings': [] }>()
</script>
