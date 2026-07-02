<script setup lang="ts">
// Barra de navegación superior. Los enlaces se generan desde el registro de
// secciones (se le pasa como prop desde app.vue).
defineProps<{
  sections: { id: string, label: string }[]
}>()
</script>

<template>
  <nav class="demo-nav">
    <div class="container-xl d-flex align-items-center gap-3 py-2">
      <a href="#top" class="demo-nav__brand">
        <span class="demo-nav__logo"><RobotbasIcon name="bi bi-boxes" /></span>
        <span>RobotBAS UI</span>
      </a>
      <div class="demo-nav__links ms-auto d-none d-md-flex">
        <a v-for="s in sections" :key="s.id" :href="`#${s.id}`">{{ s.label }}</a>
      </div>
    </div>
  </nav>
</template>
