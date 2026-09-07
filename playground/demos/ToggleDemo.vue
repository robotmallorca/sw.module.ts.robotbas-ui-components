<script setup lang="ts">
import { ref } from 'vue'

const toggleView = ref('grid')
</script>

<template>
  <DemoCard>
    <RobotbasToggleGroup v-model="toggleView">
      <RobotbasToggleGroupItemButton value="grid" label="Cuadrícula" leading-icon="fas fa-table-cells-large"
        :ui="{ root: 'btn btn-outline-primary' }" />
      <RobotbasToggleGroupItemButton value="list" label="Lista" leading-icon="fas fa-list-ul"
        :ui="{ root: 'btn btn-outline-primary' }" />
      <RobotbasToggleGroupItemButton value="map" label="Mapa" leading-icon="fas fa-location-dot"
        :ui="{ root: 'btn btn-outline-primary' }" />
    </RobotbasToggleGroup>
    <div class="small text-muted mt-2">Vista actual: <code>{{ toggleView }}</code></div>
  </DemoCard>
</template>
