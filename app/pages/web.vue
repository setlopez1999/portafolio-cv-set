<script setup lang="ts">
import Webitem from '~/components/web/WebItem.vue';

</script>

<template>
  <div class="page">
    <header>
        <h1>He trabajado en el desarrollo de diferentes paginas webs utilizando la tecnologia Three js en su respectivo renderer.</h1>
    </header>
    <body>
        <!-- Cada tecnologia con su renderer de manejo 3d -->
        <p>
          En Vue con Tres js
          En React con Three React Fiber
          En Svelte con Svelte Three js
          En Angular con Angular-Three js
          ODIO TODO DE MI.
        </p>
        <Webitem 
        position="left" 
        titulo="BlockBlast" 
        texto="Desarrolle un juego tipo pinball donde use la lib tres js para el entorno 3d"
        gifanimado="URL del gift"/>

        <Webitem 
        position="rigth" 
        titulo="Presentacion de proyectos con su modelo 3d" 
        texto="Desarrolle un sitio web con react para presentar mis proyectos en 3d usando react three fiber"
        gifanimado="URL del gift"/>
    </body>
  </div>
</template>