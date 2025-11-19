<template>
  <section class="hero">
    <h1 class="title" ref="titleRef">{{ name }}</h1>
    <h2 class="subtitle">{{ subtitle }}</h2>
    <p class="description">{{ description }}</p>

    <div class="hero-buttons">
      <template v-for="(btn, i) in buttons" :key="i">
        <!-- Botón interno de Nuxt -->
        <a
        v-if="btn.action === 'scroll'"
        href="#"
        class="btn"
        @click.prevent="scrollToSection(btn.target)"
        >
          {{ btn.text }}
        </a>

        <a
          v-else-if="btn.href"
          :href="btn.href"
          download
          class="btn secondary"
        >
          {{ btn.text }}
        </a>
      </template>
    </div>

    <!-- Botones laterales -->
    <div class="tech-side left">
      <div v-for="tech in techList.slice(0, Math.ceil(techList.length/2))" :key="tech.name" class="tech-item">
        <Icon :icon="tech.icon" width="32" height="32" :alt="tech.name"/>

      </div>
    </div>

    <div class="tech-side right">
      <div v-for="tech in techList.slice(Math.ceil(techList.length/2))" :key="tech.name" class="tech-item">
        <Icon :icon="tech.icon" width="32" height="32" :alt="tech.name"/>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

defineProps({
  name: String,
  subtitle: String,
  description: String,
  buttons: {
    type: Array,
    default: () => []
  },
  techList:{
    type: Array,
    default: () => []
  }
})
const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const titleRef = ref(null)

onMounted(() => {
  // Animaciones uu
  const letters = titleRef.value.innerText.split('')
  titleRef.value.innerHTML = letters.map(l => `<span class="letter">${l}</span>`).join('')

  gsap.from('.letter', {
    opacity: 0,
    y: 50,
    stagger: 0.05,
    duration: 0.8,
    ease: 'back.out(1.7)'
  })
})

</script>

<style scoped>
.hero {
  text-align: center;
  padding: 80px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 2;
}

/* Botones laterales */
.tech-side {
  position: absolute;
  top: 50%;
  transform: translateY(-70%) scale(1.5);
  display: grid;
  margin-inline: 3%;
  grid-template-rows: repeat(4, 50px); /* tantas columnas como quepan */
  grid-auto-rows: 50px; /* altura de cada “ladrillo” */
  grid-auto-flow: column;
  gap: 15px;
}

.tech-side.left {
  left: 10px;
  justify-content: start;
  direction: ltr;
}

.tech-side.right {
  right: 10px;
  justify-self: end;
  direction: rtl;
}

/* Botón tipo ladrillo */
.tech-item {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s;
  
}

.tech-item:hover {
  transform: scale(1.3);
  background: rgba(255, 255, 255, 0.2);
  transition: transform 0.5s, background 0.3s;
  transform: scale(1.6) rotate(5deg);
}

.tech-item img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.tech-side::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(39, 223, 116, 0.233), transparent);/*es el lazos */
  border-radius: 12px;
  z-index: -1;
}

@media (max-width: 768px) {
  .tech-side {
    display: none;
  }
}







.title {
  font-size: 48px;
  font-weight: bold;
}
.subtitle {
  font-size: 24px;
  color: #2ecc71;
  margin-top: -10px;
}
.description {
  max-width: 600px;
  margin: 20px auto;
  opacity: 0.8;
}
.hero-buttons {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap; /* que los botones no se salgan en pantallas pequeñas */
}
.btn {
  padding: 12px 25px;
  background: rgb(46, 204, 113);
  border-radius: 8px;
  color: black;
  font-weight: bold;
  text-decoration: none;
}
.btn.secondary {
  background: #ffffff22;
  border: 1px solid white;
  color: white;
}
</style>
