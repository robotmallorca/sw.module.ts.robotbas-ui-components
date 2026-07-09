<script setup lang="ts">
// Barra de navegación LATERAL (rail izquierdo). Sustituye a la antigua barra
// superior con scroll horizontal: los enlaces se apilan en vertical usando el
// componente del módulo `SideBarLink` y se generan desde el registro de
// secciones (prop desde app.vue).
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { ShowcaseSection } from '../sections'

const props = defineProps<{
  sections: ShowcaseSection[]
  /** Modo "rail": solo iconos (v-model desde app.vue). */
  collapsed?: boolean
}>()

const emit = defineEmits<{ 'update:collapsed': [boolean] }>()

// Scroll-spy: resalta el enlace de la sección visible. SideBarLink solo se
// auto-activa por ruta y aquí navegamos por anclas (#id), así que marcamos la
// activa nosotros con la clase `is-active` sobre el envoltorio.
const activeId = ref<string>('')
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeId.value = entry.target.id
      }
    },
    // La sección cuenta como activa cuando su franja central cruza el viewport.
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
  )
  for (const s of props.sections) {
    const el = document.getElementById(s.id)
    if (el) observer.observe(el)
  }
})

onBeforeUnmount(() => observer?.disconnect())

// SideBarLink navega con NuxtLink, pero vue-router aborta la navegación a un
// hash de la MISMA página (el path no cambia), así que el enlace no desplazaba.
// Interceptamos el click en fase de captura (antes de que llegue al <a>),
// cancelamos la navegación y hacemos el scroll suave nosotros.
function go(id: string) {
  activeId.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  // Mantiene el deep-linking (#seccion) sin salto ni recarga.
  history.replaceState(null, '', `#${id}`)
}

function toggle() {
  emit('update:collapsed', !props.collapsed)
}
</script>

<template>
  <aside class="demo-sidebar">
    <div class="demo-sidebar__head">
      <a href="#top" class="demo-logo" aria-label="RobotBAS UI — inicio">
        <span class="demo-logo__mark"><RobotbasIcon name="bi bi-boxes" /></span>
        <span class="demo-logo__text">RobotBAS <span class="demo-logo__accent">UI</span></span>
      </a>
      <RobotbasButton
        label=""
        :ui="{ root: 'demo-sidebar__toggle-btn' }"
        :leading-icon="collapsed ? 'bi bi-chevron-double-right' : 'bi bi-chevron-double-left'"
        :aria-label="collapsed ? 'Expandir menú' : 'Contraer menú'"
        @click="toggle"
      />
    </div>

    <nav class="demo-sidebar__nav">
      <div
        v-for="s in sections"
        :key="s.id"
        class="demo-sidebar__item"
        :class="{ 'is-active': s.id === activeId }"
        @click.capture.stop.prevent="go(s.id)"
      >
        <SideBarLink :label="s.label" :link="`#${s.id}`" :leading-icon="s.icon" />
      </div>
    </nav>

    <div class="demo-sidebar__foot">
      <a
        class="demo-sidebar__link"
        href="https://github.com/robotmallorca/sw.module.ts.robotbas-ui-components"
        target="_blank"
        rel="noopener"
      >
        <RobotbasIcon name="bi bi-github" />
        <span class="text">Repositorio</span>
      </a>
    </div>
  </aside>
</template>
