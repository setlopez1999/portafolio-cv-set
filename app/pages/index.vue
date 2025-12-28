<template>
  <div class="page">
    <HeroSection
      name="Set Carlos Lopez Quispe"
      subtitle=" Web &amp; Mobile Developer Frontend"
      description="Creo soluciones multiplataforma combinando logica, diseño y tecnologia."
      :buttons="[
        { text: 'See Projects', action: 'scroll', target: 'proyectos' },
        { text: 'Download CV', href: '/doc/CV_Set_Lopez_2025.pdf', download: true }
      ]"
      :techList="techList"
    />

    <AboutSection
      title="Sobre mi"
      :content="[
        'Soy desarrollador Full Stack y Mobile enfocado en crear aplicaciones prácticas, eficientes y bien estructuradas.',
        'Trabajo principalmente con Flutter, Java, JavaScript y tecnologías web modernas. Me interesa construir soluciones que no solo funcionen, sino que sean claras, mantenibles y pensadas para el usuario final.',
        'Disfruto aprender nuevas herramientas, mejorar mis proyectos de forma iterativa y enfrentar retos técnicos que me permitan crecer como desarrollador.'


      ]"
    />

    <Technologies :techList="['Java','Android','React Native','Vue 3','Nuxt','MySQL','Retrofit','Room','API REST','GitHub']" />
    <section  id="proyectos" class="proyectos">
      <ProjectCarousel/>
    </section>
    

    <ContactSection email="setcarlos.2511@gmail.com" linkedlnsource="https://www.linkedin.com/in/setlopez/" />

    <Footer copyright="© 2025 - Portafolio creado por Set Lopez" />
  </div>
</template>

<script setup>
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import Technologies from '@/components/Technologies.vue'
import ProjectCarousel from '@/components/ProjectCarousel.vue'
import ContactSection from '@/components/ContactSection.vue'
import Footer from '@/components/Footer.vue'
import { ref, onMounted } from 'vue'

const light = ref(null)

onMounted(() => {
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX
    const y = e.clientY

    if (light.value) {
      light.value.style.background = `
        radial-gradient(circle 150px at ${x}px ${y}px,
        rgba(255,255,255,0.3),
        rgba(0,0,0,0.8) 80%)
      `
    }
  })
})

const techList = [
  { name: 'Java', icon: 'devicon-java' },
  { name: 'Android', icon: 'devicon-android' },
  { name: 'Vue 3', icon: 'devicon-vuejs' },
  { name: 'Nuxt', icon: 'devicon-nuxtjs' },
  { name: 'React Native', icon: 'devicon-react' },
  { name: 'MySQL', icon: 'devicon-mysql' },
  { name: 'Python', icon: 'devicon-python' }, 
  { name: 'Room', icon: 'mdi-database' },
  { name: 'API REST', icon: 'mdi-api' },
  { name: 'GitHub', icon: 'devicon-github' }
  ,
  { name: 'Unity', icon: 'devicon-unity' },
  { name: 'Arduino', icon: 'devicon-arduino' },
  { name: 'Bootstrap', icon: 'devicon-bootstrap' },
  { name: 'Chartjs', icon: 'devicon-chartjs' },
  { name: 'C++', icon: 'devicon-cplusplus' },
  { name: 'C#', icon: 'devicon-csharp' },
  { name: 'CSS3', icon: 'devicon-css3' },
  { name: 'Expo', icon: 'devicon-expo' }
]


/* Asi estara los botnes pero todavia no

      :buttons="[
        { text: 'See Projects', action: 'scroll', target: 'proyectos' },
        { text: 'Download CV', href: '/doc/CV_Set_Lopez_2025.pdf', download: true },
        { text: 'WEB', action: 'route', target: 'web' },
        { text: 'APP', action: 'route', target: 'app' },
        { text: 'GAMES', action: 'route', target: 'games' },
        { text: 'DESING', action: 'route', target: 'desing' }
      ]"

*/

</script>

<style scoped>
.page {
  width: 100%;
  padding: 20px;
  color: rgb(255, 255, 255);
  font-family: Arial;
  overflow-x: hidden;
  box-sizing: border-box;
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #0b0013; /* fondo oscuro */

  background: linear-gradient(120deg, #0d0d0d, #0b0013, #2ecc71);
  background-size: 300% 300%;
  animation: gradientFlow 10s ease infinite;
}
.light {
  pointer-events: none; /* para no bloquear clicks */
  position: fixed;
  inset: 0;
  z-index: 999;
  mix-blend-mode: lighten; /* para que haga efecto de luz */
  transition: background 0.05s;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.centred{
  justify-content: center;
  text-align: center;
}
</style>
