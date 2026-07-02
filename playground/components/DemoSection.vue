<script setup lang="ts">
// Envoltorio de sección: cabecera consistente (icono + título + descripción)
// y el contenido del demo vía slot. Lo usa app.vue para renderizar cada entrada
// del registro `sections.ts`.
defineProps<{
  id: string
  title: string
  /** Clase(s) del icono Bootstrap del encabezado, p. ej. 'bi bi-award'. */
  icon: string
  description?: string
}>()
</script>

<template>
  <section :id="id" class="demo-section">
    <h2 class="demo-section__title">
      <RobotbasIcon :name="`${icon} text-primary`" /> {{ title }}
    </h2>
    <p v-if="description" class="demo-section__desc">{{ description }}</p>
    <slot />
  </section>
</template>
