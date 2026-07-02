<script setup lang="ts">
import { ref } from 'vue'

const load = ref(65)
</script>

<template>
  <div class="row g-3">
    <div class="col-md-6 col-lg-4">
      <RobotbasCard>
        <template #header>
          <div class="d-flex align-items-center justify-content-between">
            <span class="fw-semibold"><RobotbasIcon name="bi bi-cpu me-2 text-primary" />Controlador HVAC</span>
            <RobotbasBadge label="Activo" color-hex="#0f5132" background-color-hex="#d1e7dd" />
          </div>
        </template>
        <p class="mb-2 text-muted">Temperatura y humedad dentro de rango. Última lectura hace 2&nbsp;min.</p>
        <RobotbasProgress v-model="load" />
        <div class="small text-muted mt-2">Carga del sistema: {{ load }}%</div>
        <template #footer>
          <div class="d-flex gap-2">
            <RobotbasButton label="Detalles" :ui="{ root: 'btn btn-sm btn-primary' }" />
            <RobotbasButton label="Configurar" :ui="{ root: 'btn btn-sm btn-outline-secondary' }" />
          </div>
        </template>
      </RobotbasCard>
    </div>
    <div class="col-md-6 col-lg-4">
      <RobotbasCard>
        <template #header><span class="fw-semibold">Tarjeta simple</span></template>
        <p class="mb-0 text-muted">Una card sin pie de página, solo cabecera y cuerpo.</p>
      </RobotbasCard>
    </div>
    <div class="col-lg-4">
      <RobotbasCard>
        <div class="text-center py-3">
          <RobotbasIcon name="bi bi-graph-up-arrow fs-1 text-primary" />
          <div class="fs-3 fw-bold mt-2">1.284</div>
          <div class="text-muted">lecturas hoy</div>
        </div>
      </RobotbasCard>
    </div>
  </div>
</template>
