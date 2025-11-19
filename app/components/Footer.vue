<template>
  <footer class="footer">
    <p>{{ copyright }}</p>
  </footer>
</template>

<script setup>
defineProps({
  copyright: String
})
</script>

<style scoped>
.footer {
  margin-top: 80px;
  text-align: center;
  padding: 20px 0;
  opacity: 0.5;
}
</style>
