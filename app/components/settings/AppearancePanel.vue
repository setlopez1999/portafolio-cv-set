<template>
  <div class="appearance-settings" :class="{ 'is-open': isOpen }">
    <button
      class="appearance-settings__trigger"
      type="button"
      aria-label="Abrir ajustes visuales"
      :aria-expanded="isOpen"
      aria-controls="appearance-panel"
      @click="isOpen = !isOpen"
    >
      <span class="appearance-settings__chevron" aria-hidden="true">⌄</span>
      <span class="appearance-settings__signal" aria-hidden="true"></span>
    </button>

    <aside v-if="isOpen" id="appearance-panel" class="appearance-settings__panel" aria-label="Ajustes visuales">
      <div class="appearance-settings__header">
        <div>
          <p class="eyebrow">Ajustes en vivo</p>
          <h2>Hazlo tuyo.</h2>
        </div>
        <button class="appearance-settings__close" type="button" aria-label="Cerrar ajustes visuales" @click="isOpen = false">×</button>
      </div>

      <div class="appearance-settings__field">
        <label for="theme-select">Paleta</label>
        <div class="palette-grid">
          <button
            v-for="key in themeKeys"
            :key="key"
            class="palette-option"
            :class="{ 'is-selected': themeKey === key }"
            type="button"
            :aria-pressed="themeKey === key"
            @click="themeKey = key"
          >
            <span class="palette-option__swatch" :data-palette="key" aria-hidden="true"></span>
            <span>{{ themeLabels[key] }}</span>
          </button>
        </div>
      </div>

      <div class="appearance-settings__field">
        <label for="font-select">Tipografía</label>
        <select id="font-select" v-model="fontKey">
          <option v-for="(font, key) in fontPresets" :key="key" :value="key">{{ font.label }}</option>
        </select>
      </div>

      <div class="appearance-settings__field">
        <div class="field-line">
          <label for="scale-range">Escala de texto</label>
          <output for="scale-range">{{ Math.round(typeScale * 100) }}%</output>
        </div>
        <input id="scale-range" v-model.number="typeScale" type="range" min="0.9" max="1.14" step="0.01" />
      </div>

      <label class="appearance-settings__toggle">
        <input v-model="motionEnabled" type="checkbox" />
        <span class="toggle-track" aria-hidden="true"><span></span></span>
        <span>Animaciones activas</span>
      </label>

      <button class="appearance-settings__reset" type="button" @click="reset">Restaurar ajustes</button>
      <p class="appearance-settings__note">Tus preferencias se guardan en este navegador.</p>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useAppearancePreferences } from '~/composables/useAppearancePreferences'

const {
  themeKey,
  fontKey,
  typeScale,
  motionEnabled,
  isOpen,
  themeLabels,
  fontPresets,
  themeKeys,
  reset,
} = useAppearancePreferences()
</script>

<style scoped>
.appearance-settings { position: fixed; top: 1.1rem; left: 1.1rem; z-index: 30; }
.appearance-settings__trigger { position: relative; display: grid; width: 2.9rem; height: 2.9rem; place-items: center; border: 1px solid var(--color-line); border-radius: 999px; background: rgba(5, 8, 7, 0.76); color: var(--color-primary); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); backdrop-filter: blur(14px); transition: transform 220ms var(--ease-out), border-color 220ms var(--ease-out), background 220ms var(--ease-out); }
.appearance-settings__trigger:hover { transform: translateY(-2px); border-color: var(--color-primary); background: var(--color-surface); }
.appearance-settings__chevron { transform: translateY(-0.1rem); font-size: 1.5rem; line-height: 1; transition: transform 240ms var(--ease-out); }
.is-open .appearance-settings__chevron { transform: rotate(180deg) translateY(0.08rem); }
.appearance-settings__signal { position: absolute; right: 0.42rem; bottom: 0.4rem; width: 0.34rem; height: 0.34rem; border-radius: 50%; background: var(--color-lamp); box-shadow: 0 0 10px var(--color-lamp); }
.appearance-settings__panel { width: min(350px, calc(100vw - 2rem)); margin-top: 0.7rem; padding: 1.2rem; border: 1px solid var(--color-line); border-radius: var(--radius-lg); background: color-mix(in srgb, var(--color-surface) 94%, transparent); box-shadow: var(--shadow-deep); backdrop-filter: blur(22px); animation: panel-in 300ms var(--ease-out) both; }
.appearance-settings__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.appearance-settings__header .eyebrow { margin-bottom: 0.5rem; }
.appearance-settings__header h2 { margin: 0; font-family: var(--font-display); font-size: 1.5rem; font-weight: 500; letter-spacing: -0.05em; }
.appearance-settings__close { width: 2rem; height: 2rem; border: 1px solid var(--color-line); border-radius: 50%; background: transparent; color: var(--color-text-muted); font-size: 1.35rem; line-height: 1; }
.appearance-settings__field { margin-top: 1.2rem; }
.appearance-settings__field > label, .field-line label { color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; }
.palette-grid { display: grid; gap: 0.45rem; margin-top: 0.55rem; }
.palette-option { display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 0.65rem; border: 1px solid transparent; border-radius: 0.7rem; background: rgba(255, 255, 255, 0.03); color: var(--color-text); font-size: 0.78rem; text-align: left; transition: border-color 180ms ease, background 180ms ease, transform 180ms ease; }
.palette-option:hover, .palette-option.is-selected { border-color: var(--color-primary); background: rgba(53, 242, 138, 0.08); transform: translateX(3px); }
.palette-option__swatch { width: 1.4rem; height: 1.4rem; flex: 0 0 auto; border-radius: 0.4rem; background: linear-gradient(135deg, #35f28a 10%, #0c1712 55%, #ffd27a 100%); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.22); }
.palette-option__swatch[data-palette="forest-luxe"] { background: linear-gradient(135deg, #42d392 10%, #17231c 55%, #d6a85d 100%); }
.palette-option__swatch[data-palette="neon-forest"] { background: linear-gradient(135deg, #00e676 10%, #06100b 55%, #ffe29a 100%); }
.palette-option__swatch[data-palette="carbon-green"] { background: linear-gradient(135deg, #00ff87 10%, #12151a 55%, #7cffcb 100%); }
select, input[type="range"] { width: 100%; margin-top: 0.55rem; }
select { padding: 0.65rem 0.7rem; border: 1px solid var(--color-line); border-radius: 0.65rem; background: var(--color-bg-elevated); color: var(--color-text); }
.field-line { display: flex; justify-content: space-between; gap: 1rem; }
.field-line output { color: var(--color-primary); font-family: var(--font-mono); font-size: 0.7rem; }
input[type="range"] { accent-color: var(--color-primary); }
.appearance-settings__toggle { display: flex; align-items: center; gap: 0.65rem; margin-top: 1.25rem; color: var(--color-text); font-size: 0.8rem; cursor: pointer; }
.appearance-settings__toggle input { position: absolute; opacity: 0; pointer-events: none; }
.toggle-track { position: relative; width: 2.1rem; height: 1.15rem; border-radius: 999px; background: var(--color-line); transition: background 180ms ease; }
.toggle-track span { position: absolute; top: 0.18rem; left: 0.18rem; width: 0.79rem; height: 0.79rem; border-radius: 50%; background: var(--color-text); transition: transform 180ms ease, background 180ms ease; }
.appearance-settings__toggle input:checked + .toggle-track { background: var(--color-primary-strong); }
.appearance-settings__toggle input:checked + .toggle-track span { transform: translateX(0.95rem); background: var(--color-bg); }
.appearance-settings__reset { width: 100%; margin-top: 1.2rem; padding: 0.65rem; border: 1px solid var(--color-line); border-radius: 0.65rem; background: transparent; color: var(--color-text-muted); font-size: 0.75rem; }
.appearance-settings__reset:hover { border-color: var(--color-primary); color: var(--color-text); }
.appearance-settings__note { margin: 0.75rem 0 0; color: var(--color-text-muted); font-size: 0.68rem; line-height: 1.5; }
@keyframes panel-in { from { opacity: 0; clip-path: inset(0 0 100% 0 round 1.5rem); transform: translateY(-0.5rem) scale(0.98); } to { opacity: 1; clip-path: inset(0 0 0 0 round 1.5rem); transform: translateY(0) scale(1); } }
@media (max-width: 560px) { .appearance-settings { top: 0.7rem; left: 0.7rem; } .appearance-settings__panel { padding: 1rem; } }
</style>
