<script setup lang="ts">
// Shell de la web demo. Toda la estructura vive en componentes:
//  - layout en `components/` (TheSidebar, TheHero, TheFooter, DemoSection, DemoCard)
//  - una demo por componente en `demos/*.vue`
//  - el registro/orden/metadatos de secciones en `sections.ts`
import { ref } from 'vue'
import { sections } from './sections'

// La navegación lateral puede plegarse a modo "rail" (solo iconos).
const collapsed = ref(false)
</script>

<template>
  <RobotbasApp class="demo-root">
    <div class="demo-shell" :class="{ 'is-collapsed': collapsed }">
      <TheSidebar :sections="sections" v-model:collapsed="collapsed" />

      <div class="demo-content">
        <TheHero />

        <main class="demo-main container-xl">
          <DemoSection v-for="s in sections" :id="s.id" :key="s.id" :title="s.title" :icon="s.icon"
            :description="s.description">
            <component :is="s.component" />
          </DemoSection>
        </main>

        <TheFooter />
      </div>
    </div>
  </RobotbasApp>
</template>
