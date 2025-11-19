<template>
  <section id="contacto" class="centred min-h-screen px-16 py-20">
    <h2 class="text-4xl font-bold text-green-400 mb-6">Contacto</h2>
    <p class="text-gray-300 text-lg">Email: {{ email }}</p>
    <p class="text-gray-300 text-lg">Linkedln: <a href={{ linkedlnsource }}>{{ linkedlnsource }}</a></p>
  </section>
</template>

<script setup>
defineProps({
  email: String,
  linkedlnsource: String
})
</script>

<style scoped>
section {
  justify-content: center;    /* centra horizontalmente */
  background-color: rgba(15, 15, 15, 0.562);
  border-radius: 1pc;
  padding: 6px;
  width: 40%;
  margin: 0 auto;
  padding-bottom: 10px;
}
</style>
