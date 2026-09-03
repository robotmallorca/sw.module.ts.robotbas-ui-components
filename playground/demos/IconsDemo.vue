<script setup lang="ts">
const showcaseIcons = [
  'fas fa-house', 'fas fa-gear', 'fas fa-magnifying-glass', 'fas fa-bell',
  'fas fa-circle-user', 'fas fa-cloud-arrow-up', 'fas fa-arrow-trend-up',
  'fas fa-shield-halved', 'fas fa-bolt', 'fas fa-microchip',
  'fas fa-sitemap', 'fas fa-sliders',
]
</script>

<template>
  <DemoCard>
    <div class="d-flex flex-wrap gap-4 fs-3 text-secondary">
      <RobotbasIcon v-for="ic in showcaseIcons" :key="ic" :name="ic" />
    </div>
  </DemoCard>
</template>
