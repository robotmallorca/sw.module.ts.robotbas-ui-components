<script setup lang="ts">
const tabItems = [
  { label: 'Resumen', icon: 'bi bi-grid-1x2', content: 'Vista general del sistema con métricas en tiempo real de todos los dispositivos conectados.' },
  { label: 'Dispositivos', icon: 'bi bi-hdd-network', badge: 12, content: 'Listado de los 12 controladores activos en la instalación.' },
  { label: 'Alertas', icon: 'bi bi-exclamation-triangle', badge: 3, content: 'Tres incidencias requieren tu atención en este momento.' },
]
</script>

<template>
  <DemoCard>
    <RobotbasTabs :items="tabItems" :ui="{ trailingBadge: 'ms-2' }" />
  </DemoCard>
</template>
