<template>
  <section id="inicio" ref="heroRef" class="lamp-hero" :class="{ 'is-lit': isLit }">
    <div class="lamp-hero__grain" aria-hidden="true"></div>
    <div ref="beamRef" class="lamp-hero__beam" aria-hidden="true"></div>
    <div class="lamp-hero__aurora" aria-hidden="true"></div>

    <div ref="lampRef" class="lamp" :class="{ 'is-pulling': isPulling }">
      <div class="lamp__shade" aria-hidden="true"><span></span></div>
      <div ref="cordRef" class="lamp__cord" :style="{ '--pull-distance': `${pullDistance}px` }" aria-hidden="true"></div>
      <button
        ref="handleRef"
        class="lamp__handle"
        type="button"
        aria-label="Jalar la lámpara para encender la presentación"
        @pointerdown="startPull"
        @keydown.enter.prevent="ignite"
        @keydown.space.prevent="ignite"
      >
        <span></span>
      </button>
    </div>

    <CityArt :revealed="isLit" />

    <div ref="contentRef" class="lamp-hero__content section-wrap">
      <div class="profile-orbit" :class="{ 'profile-orbit--lit': isLit }">
        <div class="profile-orbit__ring"></div>
        <div class="profile-orbit__photo">
          <img v-if="profileImage" :src="profileImage" :alt="`Foto de ${site.name}`" />
          <span v-else aria-hidden="true">SC</span>
        </div>
      </div>

      <div ref="copyRef" class="lamp-hero__copy" :class="{ 'copy--revealed': isLit }">
        <p class="eyebrow">{{ site.hero.eyebrow }}</p>
        <h1 class="display-title">{{ site.name }}</h1>
        <p class="hero-role">{{ site.role }}</p>
        <p class="hero-role-detail">{{ site.roleDetail }}</p>
        <p class="hero-description">{{ site.hero.description }}</p>
        <div class="hero-actions">
          <button class="button button--primary" type="button" @click="scrollTo('trayectoria')">{{ site.hero.ctaLabel }}</button>
          <a class="button button--ghost" :href="cvUrl" target="_blank" rel="noreferrer">{{ site.hero.cvLabel }}</a>
        </div>
      </div>
    </div>

    <button class="scroll-hint" type="button" aria-label="Bajar a la trayectoria" @click="scrollTo('trayectoria')">
      <span>Desliza para entrar</span>
      <span class="scroll-hint__arrow">↓</span>
    </button>

    <p v-if="!isLit" class="lamp-hero__instruction">Jala la lámpara para encender la escena</p>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import CityArt from './CityArt.vue'
import { siteConfig } from '~/config/site'
import { useReducedMotion } from '~/composables/useReducedMotion'

const site = siteConfig
const runtime = useRuntimeConfig()
const heroRef = ref<HTMLElement | null>(null)
const beamRef = ref<HTMLElement | null>(null)
const lampRef = ref<HTMLElement | null>(null)
const cordRef = ref<HTMLElement | null>(null)
const handleRef = ref<HTMLButtonElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const copyRef = ref<HTMLElement | null>(null)
const isLit = ref(false)
const isPulling = ref(false)
const pullDistance = ref(0)
const startY = ref(0)
const profileImage = computed(() => String(runtime.public.profileImage || site.profileImage || ''))
const cvUrl = computed(() => String(runtime.public.cvUrl || site.cvUrl))
const { prefersReducedMotion } = useReducedMotion()

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const resetPull = () => {
  if (!isPulling.value) return
  isPulling.value = false
  pullDistance.value = 0
  gsap.to(cordRef.value, { y: 0, duration: 0.45, ease: 'elastic.out(1, 0.45)' })
  gsap.to(handleRef.value, { y: 0, duration: 0.45, ease: 'elastic.out(1, 0.45)' })
  window.removeEventListener('pointermove', movePull)
  window.removeEventListener('pointerup', endPull)
}

const startPull = (event: PointerEvent) => {
  if (isLit.value) return
  isPulling.value = true
  startY.value = event.clientY
  handleRef.value?.setPointerCapture?.(event.pointerId)
  window.addEventListener('pointermove', movePull)
  window.addEventListener('pointerup', endPull)
}

const movePull = (event: PointerEvent) => {
  if (!isPulling.value || isLit.value) return
  const distance = Math.max(0, Math.min(126, event.clientY - startY.value))
  pullDistance.value = distance
  gsap.set(cordRef.value, { y: distance })
  gsap.set(handleRef.value, { y: distance })
}

const endPull = () => {
  if (pullDistance.value > 58) ignite()
  else resetPull()
}

const ignite = () => {
  if (isLit.value) return
  isLit.value = true
  isPulling.value = false
  window.removeEventListener('pointermove', movePull)
  window.removeEventListener('pointerup', endPull)

  if (prefersReducedMotion.value) {
    if (beamRef.value) beamRef.value.style.opacity = '1'
    if (copyRef.value) copyRef.value.classList.add('copy--revealed')
    return
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.to(cordRef.value, { y: 18, duration: 0.16, ease: 'power2.in' })
    .to(cordRef.value, { y: 0, duration: 0.62, ease: 'elastic.out(1, 0.38)' })
    .to(handleRef.value, { y: 4, duration: 0.16 }, '<')
    .to(handleRef.value, { y: 0, duration: 0.62, ease: 'elastic.out(1, 0.38)' }, '<0.16')
    .to(beamRef.value, { opacity: 1, scale: 1, duration: 0.8 }, '-=0.32')
    .to(contentRef.value, { opacity: 1, y: 0, duration: 0.7 }, '-=0.55')
    .fromTo(copyRef.value?.children ?? [], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.48, stagger: 0.06 }, '-=0.4')
}

onMounted(() => {
  if (prefersReducedMotion.value) {
    isLit.value = true
    return
  }
  gsap.set(contentRef.value, { opacity: 0.64, y: 8 })
  gsap.set(beamRef.value, { opacity: 0, scale: 0.84 })
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', movePull)
  window.removeEventListener('pointerup', endPull)
})
</script>

<style scoped>
.lamp-hero {
  position: relative;
  display: grid;
  min-height: min(920px, 100svh);
  overflow: hidden;
  isolation: isolate;
  place-items: center;
  background: #050807;
}

.lamp-hero__grain,
.lamp-hero__aurora,
.lamp-hero__beam {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.lamp-hero__grain {
  z-index: 1;
  opacity: 0.12;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.32'/%3E%3C/svg%3E");
  mix-blend-mode: soft-light;
}

.lamp-hero__aurora {
  z-index: -1;
  background: radial-gradient(circle at 50% 48%, rgba(53, 242, 138, 0.1), transparent 28rem);
}

.lamp-hero__beam {
  z-index: 0;
  transform-origin: 50% 12%;
  background: radial-gradient(ellipse at 50% 36%, var(--color-lamp-glow), transparent 38%);
  filter: blur(18px);
}

.lamp-hero__content {
  position: relative;
  z-index: 3;
  display: grid;
  justify-items: center;
  gap: 1.4rem;
  padding-top: 5rem;
  padding-bottom: 7rem;
  text-align: center;
  transition: opacity 400ms var(--ease-out);
}

.profile-orbit {
  position: relative;
  display: grid;
  width: clamp(150px, 24vw, 240px);
  aspect-ratio: 1;
  place-items: center;
  border-radius: 50%;
  opacity: 0.84;
  transform: scale(0.94);
  transition: opacity 900ms var(--ease-out), transform 900ms var(--ease-out), filter 900ms var(--ease-out);
}

.profile-orbit--lit {
  opacity: 1;
  filter: drop-shadow(0 0 30px var(--color-lamp-glow));
  transform: scale(1);
}

.profile-orbit__ring,
.profile-orbit__photo {
  position: absolute;
  border-radius: 50%;
}

.profile-orbit__ring {
  inset: -0.7rem;
  border: 1px solid rgba(255, 210, 122, 0.7);
  box-shadow: 0 0 32px rgba(255, 210, 122, 0.25), inset 0 0 32px rgba(255, 210, 122, 0.08);
}

.profile-orbit__photo {
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: radial-gradient(circle at 50% 28%, #456655, #101a14 56%, #050807 100%);
  color: var(--color-primary-soft);
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 600;
  letter-spacing: -0.1em;
}

.profile-orbit__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lamp-hero__copy {
  max-width: 780px;
  opacity: 0;
  transition: opacity 700ms var(--ease-out);
}

.lamp-hero__copy.copy--revealed {
  opacity: 1;
}

.hero-role,
.hero-role-detail,
.hero-description {
  margin: 0.7rem auto 0;
}

.hero-role {
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 3vw, 2rem);
}

.hero-role-detail {
  color: var(--color-primary-soft);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero-description {
  max-width: 560px;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.7rem;
}

.button {
  display: inline-flex;
  min-height: 2.9rem;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.15rem;
  border: 1px solid transparent;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 180ms var(--ease-out), background 180ms var(--ease-out), border-color 180ms var(--ease-out);
}

.button:hover { transform: translateY(-2px); }
.button:active { transform: scale(0.97); }
.button--primary { background: var(--color-primary); color: var(--color-bg); font-weight: 700; }
.button--ghost { border-color: var(--color-line); color: var(--color-text); background: rgba(255, 255, 255, 0.04); }
.button--ghost:hover { border-color: var(--color-primary); background: rgba(53, 242, 138, 0.08); }

.lamp {
  position: absolute;
  top: 0;
  right: clamp(1.2rem, 11vw, 9rem);
  z-index: 5;
  width: 3.7rem;
  height: 14rem;
}

.lamp__shade {
  position: absolute;
  top: 0;
  left: 50%;
  width: 5.5rem;
  height: 3.6rem;
  transform: translateX(-50%);
  border: 1px solid rgba(255, 255, 255, 0.17);
  border-top: 0;
  border-radius: 0 0 3rem 3rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 210, 122, 0.11));
  box-shadow: 0 0 22px rgba(255, 210, 122, 0.12);
}

.lamp__shade span {
  position: absolute;
  right: 1.45rem;
  bottom: -0.2rem;
  left: 1.45rem;
  height: 0.25rem;
  border-radius: 999px;
  background: var(--color-lamp);
  box-shadow: 0 0 24px var(--color-lamp);
}

.lamp__cord {
  position: absolute;
  top: 3.25rem;
  left: 50%;
  width: 2px;
  height: 7.3rem;
  transform: translateX(-50%);
  transform-origin: top center;
  background: linear-gradient(var(--color-text-muted), rgba(158, 181, 166, 0.35));
}

.lamp__handle {
  position: absolute;
  top: 10.2rem;
  left: 50%;
  display: grid;
  width: 1.8rem;
  height: 2.6rem;
  padding: 0;
  place-items: center;
  transform: translateX(-50%);
  border: 1px solid rgba(255, 210, 122, 0.55);
  border-radius: 1rem;
  background: var(--color-lamp);
  box-shadow: 0 0 22px rgba(255, 210, 122, 0.4);
}

.lamp__handle span {
  width: 0.4rem;
  height: 1.2rem;
  border-radius: 999px;
  background: #8d6631;
}

.lamp__handle:hover { box-shadow: 0 0 36px rgba(255, 210, 122, 0.72); }
.lamp__handle:active { cursor: grabbing; }

.scroll-hint {
  position: absolute;
  bottom: 1.3rem;
  left: 50%;
  z-index: 4;
  display: grid;
  gap: 0.35rem;
  justify-items: center;
  padding: 0.5rem;
  transform: translateX(-50%);
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.scroll-hint__arrow {
  color: var(--color-primary);
  font-size: 1.2rem;
  animation: float 1.6s ease-in-out infinite;
}

.lamp-hero__instruction {
  position: absolute;
  right: 1.5rem;
  bottom: 2rem;
  z-index: 4;
  margin: 0;
  color: rgba(232, 255, 241, 0.58);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
}

@keyframes float {
  50% { transform: translateY(0.3rem); }
}

@media (max-width: 680px) {
  .lamp {
    right: 1rem;
    transform: scale(0.82);
    transform-origin: top right;
  }

  .lamp-hero__instruction {
    right: 0.6rem;
    bottom: 5rem;
    font-size: 0.52rem;
  }
}
</style>
