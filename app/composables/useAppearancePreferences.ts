import { computed, onMounted, ref, watch } from 'vue'
import { getThemeTokens, themePresets } from '~/config/theme'

export type FontPreset = 'sora' | 'space-grotesk' | 'manrope'

export const fontPresets: Record<FontPreset, { label: string; display: string; body: string }> = {
  sora: {
    label: 'Sora + Manrope',
    display: 'Sora, sans-serif',
    body: 'Manrope, sans-serif',
  },
  'space-grotesk': {
    label: 'Space Grotesk + Inter',
    display: 'Space Grotesk, sans-serif',
    body: 'Inter, sans-serif',
  },
  manrope: {
    label: 'Manrope + IBM Plex Sans',
    display: 'Manrope, sans-serif',
    body: 'IBM Plex Sans, sans-serif',
  },
}

export const themeLabels: Record<string, string> = {
  'emerald-night': 'Emerald Night',
  'forest-luxe': 'Forest Luxe',
  'neon-forest': 'Neon Forest',
  'carbon-green': 'Carbon Green',
}

const storageKey = 'set-carlos-appearance'
const themeKey = ref('emerald-night')
const fontKey = ref<FontPreset>('sora')
const typeScale = ref(1)
const motionEnabled = ref(true)
const isOpen = ref(false)
const hydrated = ref(false)

const applyPreferences = () => {
  if (!import.meta.client) return
  const root = document.documentElement
  const theme = getThemeTokens(themeKey.value)
  const font = fontPresets[fontKey.value]

  root.dataset.theme = themeKey.value
  root.classList.toggle('motion-off', !motionEnabled.value)
  root.style.setProperty('--type-scale', String(typeScale.value))
  root.style.setProperty('--motion-enabled', motionEnabled.value ? '1' : '0')
  root.style.setProperty('--font-display', font.display)
  root.style.setProperty('--font-body', font.body)
  root.style.setProperty('--color-bg', theme.bg)
  root.style.setProperty('--color-bg-elevated', theme.bgElevated)
  root.style.setProperty('--color-surface', theme.surface)
  root.style.setProperty('--color-surface-strong', theme.surfaceStrong)
  root.style.setProperty('--color-primary', theme.primary)
  root.style.setProperty('--color-primary-strong', theme.primaryStrong)
  root.style.setProperty('--color-primary-soft', theme.primarySoft)
  root.style.setProperty('--color-text', theme.text)
  root.style.setProperty('--color-text-muted', theme.textMuted)
  root.style.setProperty('--color-line', theme.line)
  root.style.setProperty('--color-lamp', theme.lamp)
  root.style.setProperty('--color-lamp-glow', theme.lampGlow)
  root.style.setProperty('--shadow-deep', `0 28px 80px ${theme.shadow}`)
}

const savePreferences = () => {
  if (!import.meta.client) return
  localStorage.setItem(storageKey, JSON.stringify({
    theme: themeKey.value,
    font: fontKey.value,
    scale: typeScale.value,
    motion: motionEnabled.value,
  }))
}

export const useAppearancePreferences = () => {
  onMounted(() => {
    if (hydrated.value) return
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}')
      if (typeof saved.theme === 'string' && themePresets[saved.theme]) themeKey.value = saved.theme
      if (typeof saved.font === 'string' && saved.font in fontPresets) fontKey.value = saved.font as FontPreset
      if (typeof saved.scale === 'number') typeScale.value = Math.min(1.14, Math.max(0.9, saved.scale))
      if (typeof saved.motion === 'boolean') motionEnabled.value = saved.motion
    } catch {
      // Si las preferencias están corruptas, se mantienen los valores predeterminados.
    }
    hydrated.value = true
    applyPreferences()
  })

  watch([themeKey, fontKey, typeScale, motionEnabled], () => {
    applyPreferences()
    savePreferences()
  })

  const reset = () => {
    themeKey.value = 'emerald-night'
    fontKey.value = 'sora'
    typeScale.value = 1
    motionEnabled.value = true
  }

  return {
    themeKey,
    fontKey,
    typeScale,
    motionEnabled,
    isOpen,
    themeLabels,
    fontPresets,
    themeKeys: computed(() => Object.keys(themeLabels)),
    applyPreferences,
    reset,
  }
}
