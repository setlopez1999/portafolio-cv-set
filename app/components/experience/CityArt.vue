<template>
  <div class="city-art" aria-hidden="true">
    <svg
      v-if="useBuiltInSvg"
      ref="svgRef"
      class="city-art__svg city-art__svg--inline"
      viewBox="0 0 900 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g ref="lineGroup" stroke="white" stroke-opacity="0.82" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M54 385H842" />
        <path d="M83 385V248L150 214L211 248V385" />
        <path d="M117 385V276H180V385" />
        <path d="M242 385V176L294 145L343 176V385" />
        <path d="M269 385V211H316V385" />
        <path d="M367 385V229L409 190L455 229V385" />
        <path d="M391 385V260H433V385" />
        <path d="M493 385V126L556 89L622 126V385" />
        <path d="M523 385V157H588V385" />
        <path d="M662 385V198L707 165L758 198V385" />
        <path d="M690 385V226H736V385" />
        <path d="M104 248V215L137 193V232" />
        <path d="M265 176V135L294 113L322 135V176" />
        <path d="M512 126V73L556 42L602 73V126" />
        <path d="M680 198V156L708 135L741 156V198" />
        <path d="M54 410H842" />
        <path d="M92 430H785" stroke-opacity="0.3" />
        <path d="M151 385C151 356 169 336 188 336C207 336 225 356 225 385" />
        <path d="M442 385C442 350 465 327 489 327C513 327 536 350 536 385" />
        <path d="M610 385C610 356 629 340 648 340C667 340 686 356 686 385" />
        <path d="M190 410C206 391 222 388 238 410" />
        <path d="M560 410C576 391 592 388 608 410" />
      </g>
      <g ref="dotGroup" fill="white" fill-opacity="0.74">
        <circle cx="151" cy="257" r="2.5" />
        <circle cx="294" cy="189" r="2.5" />
        <circle cx="556" cy="138" r="2.5" />
        <circle cx="707" cy="209" r="2.5" />
      </g>
    </svg>

    <img
      v-else-if="!svgFailed"
      class="city-art__svg"
      :src="cityArt"
      alt=""
      @error="svgFailed = true"
    />

    <img
      v-if="svgFailed && fallbackSrc"
      class="city-art__fallback"
      :src="fallbackSrc"
      alt=""
      @error="fallbackSrc = ''"
    />

    <div v-if="svgFailed && !fallbackSrc" class="city-art__empty"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { siteConfig } from '~/config/site'
import { useReducedMotion } from '~/composables/useReducedMotion'

type Props = { revealed?: boolean }
const props = withDefaults(defineProps<Props>(), { revealed: false })
const config = useRuntimeConfig()
const svgRef = ref<SVGSVGElement | null>(null)
const lineGroup = ref<SVGGElement | null>(null)
const dotGroup = ref<SVGGElement | null>(null)
const svgFailed = ref(false)
const cityArt = computed(() => String(config.public.cityArt || siteConfig.cityArt))
const fallbackSrc = ref(String(config.public.cityArtFallback || siteConfig.cityArtFallback || ''))
const useBuiltInSvg = computed(() => !cityArt.value || cityArt.value === '/art/lima-lines.svg')
const { prefersReducedMotion } = useReducedMotion()

onMounted(async () => {
  await nextTick()
  if (!lineGroup.value || !dotGroup.value) return
  const paths = lineGroup.value.querySelectorAll('path')
  if (prefersReducedMotion.value) return
  gsap.set(paths, { strokeDasharray: (index, target) => target.getTotalLength(), strokeDashoffset: (index, target) => target.getTotalLength() })
  gsap.set(dotGroup.value, { opacity: 0 })
  gsap.to(paths, { strokeDashoffset: 0, duration: 1.8, stagger: 0.035, ease: 'power2.out', paused: true })
})

const reveal = () => {
  if (!lineGroup.value || !dotGroup.value || prefersReducedMotion.value) return
  const paths = lineGroup.value.querySelectorAll('path')
  gsap.to(paths, { strokeDashoffset: 0, duration: 1.8, stagger: 0.035, ease: 'power2.out' })
  gsap.to(dotGroup.value, { opacity: 1, duration: 0.8, delay: 1.1, ease: 'power2.out' })
}

watch(() => props.revealed, (value) => {
  if (value) reveal()
}, { immediate: true })
</script>

<style scoped>
.city-art {
  position: absolute;
  inset: auto 0 clamp(0.5rem, 4vw, 3rem);
  z-index: 0;
  width: min(900px, 94vw);
  height: auto;
  margin: auto;
  opacity: 0.48;
  pointer-events: none;
}

.city-art__svg,
.city-art__fallback {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.07));
}

.city-art__fallback {
  opacity: 0.78;
  mix-blend-mode: screen;
}

.city-art__empty {
  width: 100%;
  height: 200px;
  background: linear-gradient(180deg, transparent, rgba(53, 242, 138, 0.08));
}

@media (max-width: 680px) {
  .city-art {
    width: 125vw;
    inset-inline: -12vw;
    opacity: 0.34;
  }
}
</style>
