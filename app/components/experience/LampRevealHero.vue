<template>
  <section id="inicio" ref="heroRef" class="lamp-hero" :class="{ 'is-lit': isLit }">
    <div class="lamp-hero__grain" aria-hidden="true"></div>
    <div ref="beamRef" class="lamp-hero__beam" aria-hidden="true"></div>
    <div ref="ambientRef" class="lamp-hero__ambient" aria-hidden="true"></div>
    <div ref="particlesRef" class="lamp-hero__particles" aria-hidden="true">
      <span v-for="particle in 8" :key="particle"></span>
    </div>
      <div class="lamp-hero__aurora" aria-hidden="true"></div>

    <svg style="width:0;height:0;position:absolute;" aria-hidden="true">
      <defs>
        <linearGradient id="rope-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--color-text-muted)" />
          <stop offset="100%" stop-color="rgba(158, 181, 166, 0.35)" />
        </linearGradient>
      </defs>
    </svg>

    <div ref="lampRef" class="lamp" :class="{ 'is-pulling': isPulling }">
      <div class="lamp__shade" aria-hidden="true"><span></span></div>
      <svg class="lamp__rope" :style="ropeStyle" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path class="lamp__rope-path" :d="ropePath" />
      </svg>
      <button
        ref="handleRef"
        class="lamp__handle"
        :style="handleStyle"
        type="button"
        aria-label="Jalar la lámpara para encender la presentación"
        @pointerdown="startPull"
        @pointermove="movePull"
        @pointerup="endPull"
        @pointercancel="cancelPull"
        @click="handleClick"
        @dragstart.prevent
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
const ambientRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const lampRef = ref<HTMLElement | null>(null)
const handleRef = ref<HTMLButtonElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const copyRef = ref<HTMLElement | null>(null)
const isLit = ref(false)
const isPulling = ref(false)
const pullDistance = ref(0)
const sway = ref(0)
const targetPull = ref(0)
const targetSway = ref(0)
const startX = ref(0)
const startY = ref(0)
const lastX = ref(0)
const lastY = ref(0)
const lastMoveTime = ref(0)
const pullVelocity = ref(0)
const swayVelocity = ref(0)
const physicsFrame = ref<number | null>(null)
const suppressClick = ref(false)
const profileImage = computed(() => String(runtime.public.profileImage || site.profileImage || ''))
const cvUrl = computed(() => String(runtime.public.cvUrl || site.cvUrl))
const { prefersReducedMotion } = useReducedMotion()
const maxPullDistance = 132
const ropePath = computed(() => {
  const bend = sway.value * 0.82
  const midpoint = 50 + sway.value * 0.46
  return `M 50 0 C ${50 + bend * 0.22} 28 ${midpoint} 62 ${50 + bend} 100`
})
const ropeStyle = computed<Record<string, string>>(() => ({ '--pull-distance': `${pullDistance.value}px` }))
const handleStyle = computed<Record<string, string>>(() => ({
  '--handle-y': `${pullDistance.value}px`,
  '--handle-rotation': `${sway.value}deg`,
}))

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const stopPhysics = () => {
  if (physicsFrame.value !== null) cancelAnimationFrame(physicsFrame.value)
  physicsFrame.value = null
}

const runSpring = () => {
  stopPhysics()
  let previous = performance.now()
  const tick = (now: number) => {
    const delta = Math.min(0.032, Math.max(0.001, (now - previous) / 1000))
    previous = now
    const pullError = targetPull.value - pullDistance.value
    const swayError = targetSway.value - sway.value
    pullVelocity.value += pullError * 260 * delta
    pullVelocity.value *= Math.exp(-24 * delta)
    swayVelocity.value += swayError * 190 * delta
    swayVelocity.value *= Math.exp(-18 * delta)
    pullDistance.value = Math.max(0, Math.min(maxPullDistance, pullDistance.value + pullVelocity.value * delta))
    sway.value += swayVelocity.value * delta

    const settled = Math.abs(targetPull.value - pullDistance.value) < 0.08
      && Math.abs(pullVelocity.value) < 0.08
      && Math.abs(targetSway.value - sway.value) < 0.08
      && Math.abs(swayVelocity.value) < 0.08

    if (settled && !isPulling.value) {
      pullDistance.value = targetPull.value
      sway.value = targetSway.value
      physicsFrame.value = null
      return
    }
    physicsFrame.value = requestAnimationFrame(tick)
  }
  physicsFrame.value = requestAnimationFrame(tick)
}

const removePointerListeners = () => {
  window.removeEventListener('pointermove', movePull)
  window.removeEventListener('pointerup', endPull)
  window.removeEventListener('pointercancel', cancelPull)
}

const resetPull = () => {
  isPulling.value = false
  targetPull.value = 0
  targetSway.value = 0
  pullVelocity.value = 0
  swayVelocity.value = 0
  removePointerListeners()
  runSpring()
}

const startPull = (event: PointerEvent) => {
  if (isLit.value) return
  event.preventDefault()
  isPulling.value = true
  suppressClick.value = false
  startX.value = event.clientX
  startY.value = event.clientY
  lastX.value = event.clientX
  lastY.value = event.clientY
  lastMoveTime.value = performance.now()
  pullVelocity.value = 0
  swayVelocity.value = 0
  stopPhysics()
  handleRef.value?.setPointerCapture?.(event.pointerId)
  window.addEventListener('pointermove', movePull, { passive: false })
  window.addEventListener('pointerup', endPull)
  window.addEventListener('pointercancel', cancelPull)
}

const movePull = (event: PointerEvent) => {
  if (!isPulling.value || isLit.value) return
  event.preventDefault()
  const now = performance.now()
  const elapsed = Math.max(0.008, (now - lastMoveTime.value) / 1000)
  const distance = Math.max(0, Math.min(maxPullDistance, event.clientY - startY.value))
  const deltaX = event.clientX - lastX.value
  const deltaY = event.clientY - lastY.value
  pullVelocity.value = deltaY / elapsed
  pullDistance.value = distance
  targetPull.value = distance
  targetSway.value = Math.max(-18, Math.min(18, deltaX * 0.42 + pullVelocity.value * 0.012))
  sway.value = targetSway.value
  if (Math.abs(event.clientY - startY.value) > 5 || Math.abs(event.clientX - startX.value) > 5) suppressClick.value = true
  lastX.value = event.clientX
  lastY.value = event.clientY
  lastMoveTime.value = now
}

const endPull = () => {
  if (!isPulling.value) return
  isPulling.value = false
  removePointerListeners()
  if (pullDistance.value > 58) ignite()
  else resetPull()
}

const cancelPull = () => {
  if (!isPulling.value) return
  isPulling.value = false
  removePointerListeners()
  resetPull()
}

const handleClick = () => {
  if (suppressClick.value) {
    suppressClick.value = false
    return
  }
  ignite()
}

const ignite = () => {
  if (isLit.value) return
  isLit.value = true
  isPulling.value = false
  targetPull.value = 0
  targetSway.value = 0
  removePointerListeners()
  if (prefersReducedMotion.value) {
    stopPhysics()
    pullDistance.value = 0
    sway.value = 0
  } else {
    runSpring()
  }

  if (prefersReducedMotion.value) {
    if (beamRef.value) beamRef.value.style.opacity = '1'
    if (ambientRef.value) ambientRef.value.style.opacity = '1'
    if (particlesRef.value) particlesRef.value.style.opacity = '1'
    if (contentRef.value) contentRef.value.style.opacity = '1'
    if (copyRef.value) copyRef.value.classList.add('copy--revealed')
    return
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.to([beamRef.value, ambientRef.value], { opacity: 1, scale: 1.08, duration: 0.9, ease: 'power2.out' })
    .fromTo(particlesRef.value?.children ?? [], { opacity: 0, scale: 0, y: 20 }, { opacity: 0.9, scale: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'back.out(2)' }, '-=0.7')
    .to(contentRef.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .fromTo(copyRef.value?.children ?? [], { opacity: 0, y: 22, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.58, stagger: 0.08, ease: 'power3.out' }, '-=0.46')
}

onMounted(() => {
  if (prefersReducedMotion.value) {
    isLit.value = true
    return
  }
  gsap.set(contentRef.value, { opacity: 0, y: 22 })
  gsap.set([beamRef.value, ambientRef.value, particlesRef.value], { opacity: 0, scale: 0.78 })
  pullDistance.value = 0
  sway.value = 0
})

onBeforeUnmount(() => {
  removePointerListeners()
  stopPhysics()
})
</script>

<style scoped>
.lamp-hero {
  position: relative;
  display: grid;
  min-height: min(920px, 100svh);
  overflow: hidden;
  isolation: isolate;
  place-items: stretch;
  background: #050807;
}

.lamp-hero__grain,
.lamp-hero__aurora,
.lamp-hero__beam {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.lamp-hero__ambient,
.lamp-hero__particles,
.lamp-hero__ambient {
  z-index: 0;
  opacity: 0;
  background: radial-gradient(ellipse at 50% 28%, rgba(255, 218, 139, 0.42), rgba(53, 242, 138, 0.08) 30%, transparent 68%);
  mix-blend-mode: screen;
  filter: blur(26px);
}

.lamp-hero__particles { z-index: 2; opacity: 0; }
.lamp-hero__particles span { position: absolute; width: 0.34rem; height: 0.34rem; border-radius: 50%; background: var(--color-lamp); box-shadow: 0 0 18px var(--color-lamp); }
.lamp-hero__particles span:nth-child(1) { left: 23%; top: 34%; }
.lamp-hero__particles span:nth-child(2) { left: 34%; top: 25%; width: 0.18rem; height: 0.18rem; }
.lamp-hero__particles span:nth-child(3) { left: 68%; top: 31%; }
.lamp-hero__particles span:nth-child(4) { left: 76%; top: 43%; width: 0.18rem; height: 0.18rem; }
.lamp-hero__particles span:nth-child(5) { left: 17%; top: 53%; width: 0.2rem; height: 0.2rem; }
.lamp-hero__particles span:nth-child(6) { left: 83%; top: 58%; }
.lamp-hero__particles span:nth-child(7) { left: 29%; top: 67%; width: 0.16rem; height: 0.16rem; }
.lamp-hero__particles span:nth-child(8) { left: 72%; top: 72%; width: 0.2rem; height: 0.2rem; }

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
  grid-template-columns: minmax(190px, 0.6fr) minmax(0, 1.4fr);
  align-items: center;
  gap: clamp(2rem, 7vw, 7rem);
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  padding-top: 5rem;
  padding-bottom: 7rem;
  text-align: left;
  transition: opacity 400ms var(--ease-out);
}

.profile-orbit {
  position: relative;
  display: grid;
  width: clamp(180px, 23vw, 280px);
  aspect-ratio: 1;
  place-items: center;
  justify-self: start;
  border-radius: 50%;
  opacity: 0.84;
  transform: translateX(clamp(0rem, 2vw, 2rem)) scale(0.94);
  transition: opacity 900ms var(--ease-out), transform 900ms var(--ease-out), filter 900ms var(--ease-out);
}

.profile-orbit--lit {
  opacity: 1;
  filter: drop-shadow(0 0 30px var(--color-lamp-glow));
  transform: translateX(clamp(0rem, 2vw, 2rem)) scale(1);
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
  display: block;
  object-fit: cover;
  object-position: center 26%;
  transform: scale(1.04) translateZ(0);
}

.profile-orbit::after {
  position: absolute;
  right: 0;
  bottom: -2rem;
  content: '01 / PROFILE';
  color: var(--color-primary-soft);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.12em;
}

.profile-orbit__photo::after {
  position: absolute;
  inset: 0;
  content: '';
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.14), transparent 40%, rgba(5, 8, 7, 0.2));
  pointer-events: none;
}

.lamp-hero__copy {
  max-width: 680px;
  opacity: 0;
  transition: opacity 700ms var(--ease-out);
}

.lamp-hero__copy.copy--revealed {
  opacity: 1;
}

.hero-role,
.hero-role-detail,
.hero-description {
  margin: 0.7rem 0 0;
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
  justify-content: flex-start;
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

.lamp__rope {
  position: absolute;
  top: 3.25rem;
  left: 50%;
  width: 100px;
  height: calc(7.3rem + var(--pull-distance, 0px));
  transform: translateX(-50%);
  pointer-events: none;
  overflow: visible;
}

.lamp__rope-path {
  fill: none;
  stroke: url(#rope-gradient);
  stroke-width: 2.5;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
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
  transform: translate(-50%, var(--handle-y, 0px)) rotate(var(--handle-rotation, 0deg));
  transform-origin: top center;
  border: 1px solid rgba(255, 210, 122, 0.55);
  border-radius: 1rem;
  background: var(--color-lamp);
  box-shadow: 0 0 22px rgba(255, 210, 122, 0.4);
  touch-action: none;
  user-select: none;
  will-change: transform;
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

@media (max-width: 760px) {
  .lamp-hero__content {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 2.8rem;
    width: min(100% - 2rem, 560px);
    text-align: center;
  }

  .profile-orbit,
  .profile-orbit--lit {
    justify-self: center;
    transform: scale(0.94);
  }

  .profile-orbit--lit { transform: scale(1); }

  .lamp-hero__copy { max-width: 560px; }
  .hero-role,
  .hero-role-detail,
  .hero-description { margin-inline: auto; }
  .hero-actions { justify-content: center; }

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
