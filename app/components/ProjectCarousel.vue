<template>
  <h1 class="title">Proyectos</h1>
  <div class="carousel">
    <button class="nav left" @click="prev">&#10094;</button>

    <div class="track" ref="track">
      <ProjectCard
        v-for="(p, i) in projects"
        :key="i"
        :project="p"
      />
    </div>

    <button class="nav right" @click="next">&#10095;</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProjectCard from './ProjectCard.vue'

const track = ref(null)

const projects = ref([
  {
    title: "Juego 2D en Java",
    desc: "Interactividad + POO",
    tech: "Java, Swing",
    link: "https://github.com/setlopez1999/LAB_09",
    img: "/img/juego.png"
  },
  {
    title: "Simulador de Grafos",
    desc: "Editor y visualizador interactivo de grafos con nodos y aristas dinámicas.",
    tech: "HTML, CSS, JS, D3.js",
    link: "https://github.com/setlopez1999/SimGraMod",
    img: "/img/grafos.png"
  },
  {
    title: "App Odontología",
    desc: "Android + Retrofit + Room",
    tech: "Android, Room",
    link: "https://github.com/setlopez1999/AppMovil2025",
    img: "/img/odontologia.png"
  },
  {
    title: "Cine Ultimate",
    desc: "JSP + Servlets",
    tech: "Java Web",
    link: "https://github.com/victovictorio00/CINE_ULTIMATE",
    img: "/img/cine.png"
  },
  {
    title: "AppRoute",
    desc: "React Native + API",
    tech: "React Native",
    link: "https://github.com/HanselChavez/AppRoute",
    img: "/img/approute.png"
  }
])

const next = () => {
  if (!track.value) return
  const width = track.value.clientWidth
  track.value.scrollBy({ left: width, behavior: 'smooth' })
}

const prev = () => {
  if (!track.value) return
  const width = track.value.clientWidth
  track.value.scrollBy({ left: -width, behavior: 'smooth' })
}
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
  color: white;
}
.carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 40px 0;
}

.track {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 20px;
  scroll-snap-type: x mandatory;
  width: 85%;
}

.track::-webkit-scrollbar {
  display: none;
}

/* Botones */
.nav {
  background: #00000055;
  border: none;
  font-size: 28px;
  color: white;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 8px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.left { left: 10px; }
.right { right: 10px; }

.nav:hover { background: #ffffff22; }
</style>
