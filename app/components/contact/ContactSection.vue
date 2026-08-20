<template>
  <section id="contacto" class="contact section-padding">
    <div class="section-wrap contact__inner">
      <div ref="copyRef" class="contact__copy">
        <p class="eyebrow">05 · Contacto</p>
        <h2 class="section-title">Hablemos de lo que sigue.</h2>
        <p class="muted-copy">Si tienes un producto, una idea o un problema que resolver, puedes escribirme y lo conversamos.</p>
      </div>

      <div class="contact__links">
        <a class="contact-link contact-link--primary" :href="`mailto:${site.email}`">
          <span>Email</span>
          <strong>{{ site.email }}</strong>
          <b>↗</b>
        </a>
        <a class="contact-link" :href="site.linkedin" target="_blank" rel="noreferrer">
          <span>LinkedIn</span>
          <strong>Perfil profesional</strong>
          <b>↗</b>
        </a>
        <a class="contact-link" :href="site.github" target="_blank" rel="noreferrer">
          <span>GitHub</span>
          <strong>Proyectos y código</strong>
          <b>↗</b>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { siteConfig as site } from '~/config/site'
const copyRef = ref<HTMLElement | null>(null)
</script>

<style scoped>
.contact { background: linear-gradient(180deg, transparent, rgba(53, 242, 138, 0.06)); }
.contact__inner { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.86fr); gap: clamp(2rem, 9vw, 8rem); align-items: end; }
.contact__copy { max-width: 620px; }
.contact__copy .muted-copy { max-width: 480px; margin-top: 1.25rem; }
.contact__links { display: grid; gap: 0.7rem; }
.contact-link { display: grid; grid-template-columns: 5rem 1fr auto; align-items: center; gap: 0.8rem; padding: 1rem; border: 1px solid var(--color-line); border-radius: var(--radius-sm); color: var(--color-text); text-decoration: none; transition: border-color 180ms var(--ease-out), background 180ms var(--ease-out), transform 180ms var(--ease-out); }
.contact-link:hover { border-color: var(--color-primary); background: rgba(53, 242, 138, 0.07); transform: translateX(4px); }
.contact-link span { color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; }
.contact-link strong { overflow: hidden; font-size: 0.9rem; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.contact-link b { color: var(--color-primary); font-size: 1.1rem; }
.contact-link--primary { border-color: rgba(53, 242, 138, 0.42); background: rgba(53, 242, 138, 0.08); }

@media (max-width: 760px) {
  .contact__inner { grid-template-columns: 1fr; gap: 2rem; }
}
</style>
