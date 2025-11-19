<template>
  <div class="card">
    <img :src="project.img" alt="" class="thumb" />
    <h4>{{ project.title }}</h4>
    <p class="desc">{{ project.desc }}</p>
    <p class="tech">{{ project.tech }}</p>
    <a :href="project.link" target="_blank" class="btn">Ver Código</a>
  </div>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true,
    validator: p => p.title && p.desc && p.tech && p.link && p.img
  }
})
</script>

<style scoped>
.card {
  flex: 0 0 auto;
  width: clamp(220px, 25%, 300px); /* adaptable a cualquier pantalla */
  background: #1a1a1a;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: white;
  scroll-snap-align: center;
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

.thumb {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 10px;
}

.desc {
  font-size: 0.9rem;
  margin: 8px 0;
  opacity: 0.85;
}

.tech {
  font-size: 0.8rem;
  color: #2ecc71;
  margin-bottom: 10px;
}

.btn {
  display: inline-block;
  padding: 10px;
  background: #2ecc71;
  border-radius: 6px;
  color: black;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.3s;
}

.btn:hover {
  background: #27ae60;
}
</style>
