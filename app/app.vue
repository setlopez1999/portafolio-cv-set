<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
useHead({
  htmlAttrs: { class: 'scroll-smooth' }
});
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
