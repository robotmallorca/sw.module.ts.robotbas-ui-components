<script setup lang="ts">
const tabItems = [
  { label: 'Resumen', icon: 'fas fa-table-columns', content: 'Vista general del sistema con métricas en tiempo real de todos los dispositivos conectados.' },
  { label: 'Dispositivos', icon: 'fas fa-network-wired', badge: 12, content: 'Listado de los 12 controladores activos en la instalación.' },
  { label: 'Alertas', icon: 'fas fa-triangle-exclamation', badge: 3, content: 'Tres incidencias requieren tu atención en este momento.' },
]
</script>

<template>
  <DemoCard>
    <RobotbasTabs :items="tabItems" :ui="{ trailingBadge: 'ms-2' }" />
  </DemoCard>
</template>
