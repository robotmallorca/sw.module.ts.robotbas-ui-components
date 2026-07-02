<script setup lang="ts">
import { ref } from 'vue'

const progress = ref(65)
const stepLabels = ['Pedido', 'Preparando', 'Enviado', 'Entregado']
</script>

<template>
  <div class="row g-3">
    <div class="col-lg-7">
      <DemoCard label="Continuo">
        <RobotbasProgress v-model="progress" />
        <div class="d-flex align-items-center gap-3 mt-3">
          <input v-model.number="progress" type="range" min="0" max="100" class="form-range flex-grow-1">
          <RobotbasBadge :label="progress + '%'" />
        </div>
      </DemoCard>
    </div>
    <div class="col-lg-5">
      <DemoCard label="Por pasos">
        <RobotbasProgress :model-value="2" :max="stepLabels" />
      </DemoCard>
    </div>
  </div>
</template>
