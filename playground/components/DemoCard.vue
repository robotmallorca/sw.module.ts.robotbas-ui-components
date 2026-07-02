<script setup lang="ts">
// Tarjeta de demostración con etiqueta opcional. Las clases/estilos extra
// (p. ej. `class="d-flex"` o `style="max-width: 28rem"`) caen al div raíz.
defineProps<{ label?: string }>()
</script>

<template>
  <div class="demo-card">
    <div v-if="label" class="demo-card__label">{{ label }}</div>
    <slot />
  </div>
</template>
