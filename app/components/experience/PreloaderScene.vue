<template>
  <Transition name="preloader">
    <div v-if="visible" class="preloader" role="status" aria-label="Cargando portafolio">
      <div class="preloader__mark" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>Preparando el espacio</p>
      <div class="preloader__bar" aria-hidden="true"><span :style="{ width: `${progress}%` }"></span></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const visible = ref(true)
const progress = ref(0)

onMounted(() => {
  const started = performance.now()
  const duration = 850

  const tick = (now: number) => {
    const elapsed = Math.min(now - started, duration)
    progress.value = Math.round((elapsed / duration) * 100)
    if (elapsed < duration) requestAnimationFrame(tick)
    else window.setTimeout(() => { visible.value = false }, 180)
  }

  requestAnimationFrame(tick)
})
</script>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 1rem;
  background: #050807;
  color: var(--color-text);
}

.preloader p {
  margin: 0;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.preloader__mark {
  display: flex;
  align-items: end;
  gap: 0.4rem;
  height: 2.6rem;
}

.preloader__mark span {
  width: 0.35rem;
  border-radius: 999px;
  background: var(--color-primary);
  animation: pulse 0.85s ease-in-out infinite alternate;
}

.preloader__mark span:nth-child(1) { height: 1rem; animation-delay: -0.18s; }
.preloader__mark span:nth-child(2) { height: 2rem; animation-delay: -0.36s; }
.preloader__mark span:nth-child(3) { height: 1.4rem; animation-delay: -0.54s; }

.preloader__bar {
  width: min(180px, 60vw);
  height: 2px;
  overflow: hidden;
  background: var(--color-line);
}

.preloader__bar span {
  display: block;
  height: 100%;
  background: var(--color-primary);
  transition: width 80ms linear;
}

.preloader-enter-active,
.preloader-leave-active { transition: opacity 420ms var(--ease-out); }
.preloader-enter-from,
.preloader-leave-to { opacity: 0; }

@keyframes pulse {
  to { transform: translateY(-0.5rem); opacity: 0.45; }
}
</style>
