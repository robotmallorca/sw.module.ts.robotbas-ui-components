<script setup lang="ts">
const showcaseIcons = [
  'bi bi-house-door', 'bi bi-gear', 'bi bi-search', 'bi bi-bell',
  'bi bi-person-circle', 'bi bi-cloud-arrow-up', 'bi bi-graph-up-arrow',
  'bi bi-shield-check', 'bi bi-lightning-charge', 'bi bi-cpu',
  'bi bi-diagram-3', 'bi bi-sliders',
]
</script>

<template>
  <DemoCard>
    <div class="d-flex flex-wrap gap-4 fs-3 text-secondary">
      <RobotbasIcon v-for="ic in showcaseIcons" :key="ic" :name="ic" />
    </div>
  </DemoCard>
</template>
