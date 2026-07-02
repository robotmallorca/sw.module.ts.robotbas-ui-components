<script setup lang="ts"></script>

<template>
  <DemoCard>
    <div class="d-flex flex-wrap gap-2 align-items-center">
      <RobotbasBadge label="Por defecto" />
      <RobotbasBadge label="Online" leading-icon="bi bi-circle-fill" />
      <RobotbasBadge label="12 avisos" trailing-icon="bi bi-arrow-right" />
      <RobotbasBadge label="Éxito" color-hex="#0f5132" background-color-hex="#d1e7dd" />
      <RobotbasBadge label="Aviso" color-hex="#664d03" background-color-hex="#fff3cd" />
      <RobotbasBadge label="Error" color-hex="#842029" background-color-hex="#f8d7da" />
    </div>
  </DemoCard>
</template>
