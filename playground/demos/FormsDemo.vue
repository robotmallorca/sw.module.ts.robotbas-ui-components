<script setup lang="ts">
import { ref } from 'vue'

const inputText = ref('')
const inputEmail = ref('')
const inputPassword = ref('')
const iteratorValue = ref(1)
const iteratorLabels = ['Muy bajo', 'Bajo', 'Medio', 'Alto', 'Máximo']
</script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <DemoCard label="Inputs">
        <div class="d-flex flex-column gap-3">
          <RobotbasInput v-model="inputText" placeholder="Texto simple" :ui="{ base: 'form-control' }" />
          <RobotbasInput v-model="inputPassword" type="password" placeholder="Contraseña"
            :ui="{ base: 'form-control' }" />
          <RobotbasInput model-value="Deshabilitado" disabled :ui="{ base: 'form-control' }" />
        </div>
      </DemoCard>
    </div>
    <div class="col-md-6">
      <DemoCard label="FormField (label, ayuda, error)">
        <div class="d-flex flex-column gap-3">
          <RobotbasFormField label="Correo electrónico" help="No lo compartiremos con nadie."
            :ui="{ label: 'form-label fw-semibold mb-1', help: 'form-text', container: 'mt-0' }">
            <RobotbasInput v-model="inputEmail" type="email" placeholder="tu@empresa.com"
              :ui="{ base: 'form-control' }" />
          </RobotbasFormField>
          <RobotbasFormField label="Nombre" :error="inputText ? false : 'Este campo es obligatorio'"
            :ui="{ label: 'form-label fw-semibold mb-1', error: 'text-danger small mt-1' }">
            <RobotbasInput v-model="inputText" placeholder="Escribe para validar" :ui="{ base: 'form-control' }" />
          </RobotbasFormField>
        </div>
      </DemoCard>
    </div>
    <div class="col-md-6">
      <DemoCard label="InputIterator (selector cíclico)">
        <RobotbasInputIterator v-model="iteratorValue" :values-labels="iteratorLabels" leading-as="button"
          trailing-as="button" iteration-mode="rotation" leading-icon="bi bi-dash-lg" trailing-icon="bi bi-plus-lg"
          :ui="{ root: 'input-group', leading: 'btn btn-outline-secondary', base: 'form-control text-center bg-white', trailing: 'btn btn-outline-secondary' }" />
        <div class="small text-muted mt-2">Índice <code>{{ iteratorValue }}</code> · toca − / +</div>
      </DemoCard>
    </div>
    <div class="col-md-6">
      <DemoCard label="FieldGroup (controles agrupados)">
        <RobotbasFieldGroup class="btn-group">
          <RobotbasButton label="Día" :ui="{ root: 'btn btn-outline-primary' }" />
          <RobotbasButton label="Semana" :ui="{ root: 'btn btn-outline-primary' }" />
          <RobotbasButton label="Mes" :ui="{ root: 'btn btn-outline-primary' }" />
        </RobotbasFieldGroup>
        <div class="small text-muted mt-2">Comparte orientación y tamaño con los hijos.</div>
      </DemoCard>
    </div>
  </div>
</template>
