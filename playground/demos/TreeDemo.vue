<script setup lang="ts">
const treeItems = [
  {
    title: 'Instalación',
    icon: 'fas fa-building',
    children: [
      {
        title: 'Planta 1',
        icon: 'fas fa-sitemap',
        children: [
          { title: 'Termostato A', icon: 'fas fa-temperature-half' },
          { title: 'Sensor de luz', icon: 'fas fa-sun' },
        ],
      },
      { title: 'Planta 2', icon: 'fas fa-sitemap', children: [{ title: 'Controlador HVAC', icon: 'fas fa-fan' }] },
    ],
  },
]
</script>

<template>
  <DemoCard style="max-width: 28rem;">
    <RobotbasTree title="Topología" :items="treeItems" :default-expanded="['Instalación', 'Planta 1']">
      <template #item-icon="{ item, hasChildren, isExpanded }">
        <RobotbasIcon v-if="hasChildren" :name="'me-2 ' + (isExpanded ? 'fas fa-folder-open' : 'fas fa-folder')" />
        <RobotbasIcon v-else :name="'me-2 ' + (item.value.icon || 'fas fa-file')" />
      </template>
    </RobotbasTree>
  </DemoCard>
</template>
