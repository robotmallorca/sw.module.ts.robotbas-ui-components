<script setup lang="ts">
const treeItems = [
  {
    title: 'Instalación',
    icon: 'bi bi-building',
    children: [
      {
        title: 'Planta 1',
        icon: 'bi bi-diagram-2',
        children: [
          { title: 'Termostato A', icon: 'bi bi-thermometer-half' },
          { title: 'Sensor de luz', icon: 'bi bi-brightness-high' },
        ],
      },
      { title: 'Planta 2', icon: 'bi bi-diagram-2', children: [{ title: 'Controlador HVAC', icon: 'bi bi-fan' }] },
    ],
  },
]
</script>

<template>
  <DemoCard style="max-width: 28rem;">
    <RobotbasTree title="Topología" :items="treeItems" :default-expanded="['Instalación', 'Planta 1']">
      <template #item-icon="{ item, hasChildren, isExpanded }">
        <RobotbasIcon v-if="hasChildren" :name="'me-2 ' + (isExpanded ? 'bi bi-folder2-open' : 'bi bi-folder2')" />
        <RobotbasIcon v-else :name="'me-2 ' + (item.value.icon || 'bi bi-file-earmark')" />
      </template>
    </RobotbasTree>
  </DemoCard>
</template>
