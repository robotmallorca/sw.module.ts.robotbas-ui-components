<script setup lang="ts">
import { ref } from 'vue'

const notifyMe = ref(true)
const compactMode = ref(false)
</script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <DemoCard label="SideBarLink">
        <SideBarLink label="Panel" link="#navigation" leading-icon="bi bi-speedometer2" />
        <SideBarLink label="Dispositivos" link="#navigation" leading-icon="bi bi-hdd-network" :badge="12" />
        <SideBarLink label="Alertas" link="#navigation" leading-icon="bi bi-bell" :badge="3" />
        <SideBarLink label="Ajustes" link="#navigation" leading-icon="bi bi-gear" />
      </DemoCard>
    </div>
    <div class="col-md-6">
      <DemoCard label="SideBarCheckbox">
        <div class="d-flex flex-column gap-2">
          <SideBarCheckbox v-model="notifyMe" :submenu="0" text="Notificaciones" element-id="cb-notify" />
          <SideBarCheckbox v-model="compactMode" :submenu="1" text="Modo compacto" element-id="cb-compact" />
        </div>
      </DemoCard>
    </div>
  </div>
</template>
