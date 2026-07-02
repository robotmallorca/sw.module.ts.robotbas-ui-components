<script setup lang="ts"></script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <DemoCard label="Por defecto">
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <RobotbasButton label="Guardar" leading-icon="bi bi-check-lg" />
          <RobotbasButton label="Nuevo" leading-icon="bi bi-plus-lg" />
          <RobotbasButton label="Notificaciones" trailing-icon="bi bi-bell" :badge="5" />
        </div>
      </DemoCard>
    </div>
    <div class="col-md-6">
      <DemoCard label="Variantes Bootstrap (ui.root)">
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <RobotbasButton label="Outline" leading-icon="bi bi-pencil" :ui="{ root: 'btn btn-outline-primary' }" />
          <RobotbasButton label="Éxito" leading-icon="bi bi-cloud-check" :ui="{ root: 'btn btn-success' }" />
          <RobotbasButton label="Peligro" leading-icon="bi bi-trash" :ui="{ root: 'btn btn-danger' }" />
          <RobotbasButton label="Sutil" :ui="{ root: 'btn btn-light' }" />
        </div>
      </DemoCard>
    </div>
  </div>
</template>
