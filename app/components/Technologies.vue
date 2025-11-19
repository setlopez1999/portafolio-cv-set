<template>
  <section class="tech centred">
    <h1>Tecnologías</h1>
    <div class="tech-list">
      <span v-for="(tech, i) in techList" :key="i">{{ tech }}</span>
    </div>
  </section>
</template>

<script setup>
defineProps({
  techList: Array
})
</script>

<style scoped>
.tech {
  margin-top: 100px;
  max-width: 70%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  margin-top: 70px;
  margin-bottom: 100px;
}
h1{
  margin-bottom: 50px;
}
.tech-list span {
  display: inline-block;
  padding: 10px 18px;
  margin: 5px;
  background: #222;
  border-radius: 10px;
  transition: all 0.3s ease;
}
.tech-list span:hover {
  background: #2ecc71;
  color: white;
  transform: scale(1.3);
}
</style>
