<template>
  <section class="about centred">
    <h1>{{ title }}</h1>
    <p v-for="(paragraph, i) in content" :key="i">{{ paragraph }}</p>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  content: Array
})
</script>

<style scoped>
h1{
  margin-bottom: 50px;
}
.about {
  margin-top: 100px;
  max-width: 70%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
    margin-top: 70px;
  margin-bottom: 100px;
}
</style>
