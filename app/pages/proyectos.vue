<template>
  <section>
    <h1>Mis Proyectos</h1>

    <div class="lista-proyectos">
      <div 
        v-for="proyecto in proyectos" 
        :key="proyecto.nombre" 
        class="card"
      >
        <h2>{{ proyecto.nombre }}</h2>
        <p>{{ proyecto.descripcion }}</p>
        <a :href="proyecto.link" target="_blank">Ver Proyecto</a>
      </div>
    </div>
  </section>
</template>

<script setup>
const proyectos = [
  {
    nombre: "Proyecto Android",
    descripcion: "App con login, sincronizacion y Room",
    link: "https://github.com/turepo/proyecto-android"
  },
  {
    nombre: "Dashboard JSP",
    descripcion: "Dashboard de ingresos con MySQL y Servlets",
    link: "https://github.com/turepo/dashboard"
  }
]
</script>
