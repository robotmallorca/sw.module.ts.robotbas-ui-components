<script setup lang="ts">
// Shell de la web demo. Toda la estructura vive en componentes:
//  - layout en `components/` (TheNav, TheHero, TheFooter, DemoSection, DemoCard)
//  - una demo por componente en `demos/*.vue`
//  - el registro/orden/metadatos de secciones en `sections.ts`
import { sections } from './sections'
</script>

<template>
  <RobotbasApp class="demo-root">
    <TheNav :sections="sections" />
    <TheHero />

    <main class="container-xl">
      <DemoSection v-for="s in sections" :id="s.id" :key="s.id" :title="s.title" :icon="s.icon"
        :description="s.description">
        <component :is="s.component" />
      </DemoSection>
    </main>

    <TheFooter />
  </RobotbasApp>
</template>
