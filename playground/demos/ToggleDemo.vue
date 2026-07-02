<script setup lang="ts">
import { ref } from 'vue'

const toggleView = ref('grid')
</script>

<template>
  <DemoCard>
    <RobotbasToggleGroup v-model="toggleView">
      <RobotbasToggleGroupItemButton value="grid" label="Cuadrícula" leading-icon="bi bi-grid-3x3-gap"
        :ui="{ root: 'btn btn-outline-primary' }" />
      <RobotbasToggleGroupItemButton value="list" label="Lista" leading-icon="bi bi-list-ul"
        :ui="{ root: 'btn btn-outline-primary' }" />
      <RobotbasToggleGroupItemButton value="map" label="Mapa" leading-icon="bi bi-geo-alt"
        :ui="{ root: 'btn btn-outline-primary' }" />
    </RobotbasToggleGroup>
    <div class="small text-muted mt-2">Vista actual: <code>{{ toggleView }}</code></div>
  </DemoCard>
</template>
