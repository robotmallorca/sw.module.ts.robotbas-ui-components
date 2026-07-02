<script setup lang="ts"></script>

<template>
  <DemoCard>
    <div class="d-flex flex-wrap gap-2">
      <RobotbasModal title="Confirmar acción" description="Esta operación reiniciará el controlador seleccionado."
        :close="false" :ui="{ dialog: 'modal-dialog modal-dialog-centered' }">
        <RobotbasButton label="Abrir Modal" leading-icon="bi bi-window" />
        <template #body>
          <p class="text-muted mb-0">
            El dispositivo estará inaccesible durante unos segundos mientras se reinicia.
            ¿Deseas continuar?
          </p>
        </template>
        <template #footer="{ close }">
          <RobotbasButton label="Cancelar" :ui="{ root: 'btn btn-light' }" @click="close" />
          <RobotbasButton label="Sí, reiniciar" :ui="{ root: 'btn btn-primary' }" @click="close" />
        </template>
      </RobotbasModal>

      <RobotbasPopover :arrow="true">
        <RobotbasButton label="Abrir Popover" leading-icon="bi bi-chat-square-text"
          :ui="{ root: 'btn btn-outline-primary' }" />
        <template #content>
          <div class="popover-body-demo">
            <div class="fw-semibold mb-1">Estado del enlace</div>
            <p class="small text-muted mb-0">Señal estable · latencia 24&nbsp;ms · última sincronización correcta.</p>
          </div>
        </template>
      </RobotbasPopover>
    </div>
  </DemoCard>
</template>
