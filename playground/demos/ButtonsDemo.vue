<script setup lang="ts"></script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <DemoCard label="Por defecto">
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <RobotbasButton label="Guardar" leading-icon="fas fa-check" />
          <RobotbasButton label="Nuevo" leading-icon="fas fa-plus" />
          <RobotbasButton label="Notificaciones" trailing-icon="fas fa-bell" :badge="5" />
        </div>
      </DemoCard>
    </div>
    <div class="col-md-6">
      <DemoCard label="Variantes Bootstrap (ui.root)">
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <RobotbasButton label="Outline" leading-icon="fas fa-pencil" :ui="{ root: 'btn btn-outline-primary' }" />
          <RobotbasButton label="Éxito" leading-icon="fas fa-cloud-arrow-up" :ui="{ root: 'btn btn-success' }" />
          <RobotbasButton label="Peligro" leading-icon="fas fa-trash" :ui="{ root: 'btn btn-danger' }" />
          <RobotbasButton label="Sutil" :ui="{ root: 'btn btn-light' }" />
        </div>
      </DemoCard>
    </div>
  </div>
</template>
