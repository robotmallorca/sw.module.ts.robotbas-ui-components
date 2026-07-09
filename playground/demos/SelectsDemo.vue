<script setup lang="ts">
import { ref } from 'vue'

const selectValue = ref('active')
const comboboxValue = ref('')
const selectTreeValue = ref('')

const selectItems = [
  { label: 'Activo', value: 'active' },
  { label: 'En pausa', value: 'paused' },
  { label: 'Mantenimiento', value: 'maintenance' },
  { label: 'Desconectado', value: 'offline' },
]

const comboboxItems = [
  { label: 'Termostato', value: 'thermostat' },
  { label: 'Sensor de humedad', value: 'humidity' },
  { label: 'Controlador HVAC', value: 'hvac' },
  { label: 'Sensor de luz', value: 'light' },
  { label: 'Actuador de válvula', value: 'valve' },
]

const selectTreeItems = [
  {
    title: 'Instalación',
    children: [
      { title: 'Planta 1', children: [{ title: 'Termostato A' }, { title: 'Sensor de luz' }] },
      { title: 'Planta 2', children: [{ title: 'Controlador HVAC' }] },
    ],
  },
]
</script>

<template>
  <div class="row g-3">
    <div class="col-md-4">
      <DemoCard label="Select">
        <RobotbasSelect v-model="selectValue" :items="selectItems" 
          placeholder="Selecciona un estado" />
        <div class="small text-muted mt-2">Valor: <code>{{ selectValue }}</code></div>
      </DemoCard>
    </div>
    <div class="col-md-4">
      <DemoCard label="Combobox (con búsqueda)">
        <RobotbasCombobox v-model="comboboxValue" :items="comboboxItems" value-key="value"
           placeholder="Busca un dispositivo" />
        <div class="small text-muted mt-2">Valor: <code>{{ comboboxValue || '—' }}</code></div>
      </DemoCard>
    </div>
    <div class="col-md-4">
      <DemoCard label="SelectTree (jerárquico)">
        <RobotbasSelectTree v-model="selectTreeValue" :items="selectTreeItems" value-key="title"
           placeholder="Elige ubicación" />
        <div class="small text-muted mt-2">Valor: <code>{{ selectTreeValue || '—' }}</code></div>
      </DemoCard>
    </div>
  </div>
</template>
