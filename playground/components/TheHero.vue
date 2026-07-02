<script setup lang="ts">
import { componentInventory } from '../data/components'

// Desplaza suavemente a una sección. Guardado para cliente: durante el
// prerender SSR `document` no existe, y así el handler nunca falla.
function scrollToSection(id: string) {
  if (typeof document === 'undefined') return
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header id="top" class="demo-hero">
    <div class="container-xl">
      <span class="demo-hero__eyebrow"><RobotbasIcon name="bi bi-stars" /> Design System · RobotBAS</span>
      <h1 class="demo-hero__title mt-3">
        Componentes <span class="grad">Robotbas*</span><br>listos para tus webapps
      </h1>
      <p class="demo-hero__lead mt-3">
        Una biblioteca Vue accesible construida sobre <strong>reka-ui</strong> y
        <strong>Bootstrap&nbsp;5</strong>, distribuida como módulo Nuxt. Explora abajo
        cada componente en vivo.
      </p>
      <div class="d-flex flex-wrap gap-4 mt-4">
        <div class="demo-stat"><strong>{{ componentInventory.length }}</strong><br><span>componentes</span></div>
        <div class="demo-stat"><strong>Vue 3</strong><br><span>+ Nuxt module</span></div>
        <div class="demo-stat"><strong>A11y</strong><br><span>reka-ui</span></div>
        <div class="demo-stat"><strong>SCSS</strong><br><span>tokens de marca</span></div>
      </div>
      <div class="d-flex flex-wrap gap-2 mt-4">
        <RobotbasButton label="Ver componentes" leading-icon="bi bi-arrow-down-circle"
          @click="scrollToSection('tokens')" />
        <a class="btn btn-outline-secondary" href="https://github.com/robotmallorca/sw.module.ts.robotbas-ui-components"
          target="_blank" rel="noopener"><RobotbasIcon name="bi bi-github me-1" /> Repositorio</a>
      </div>
    </div>
  </header>
</template>
