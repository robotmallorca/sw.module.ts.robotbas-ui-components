<script setup lang="ts">
import { ref } from 'vue'

const notifyMe = ref(true)
const compactMode = ref(false)

// Estado abierto/cerrado de los desplegables del sidebar. SideBarLink es
// "controlado": no guarda el estado, solo lo pinta (`open`) y avisa
// (`toggle-click`), así el consumidor decide si son excluyentes o no.
const settingsOpen = ref(true)
const devicesOpen = ref(false)
</script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <DemoCard label="SideBarLink">
        <SideBarLink label="Panel" link="#navigation" leading-icon="fas fa-gauge-high" />
        <SideBarLink label="Dispositivos" link="#navigation" leading-icon="fas fa-network-wired" :badge="12" />
        <SideBarLink label="Alertas" link="#navigation" leading-icon="fas fa-bell" :badge="3" />
        <SideBarLink label="Ajustes" link="#navigation" leading-icon="fas fa-gear" />
      </DemoCard>
    </div>
    <div class="col-md-6">
      <DemoCard label="SideBarLink — desplegables">
        <SideBarLink
          label="Settings"
          leading-icon="fas fa-gear"
          expandable
          :open="settingsOpen"
          @toggle-click="settingsOpen = !settingsOpen"
        />
        <template v-if="settingsOpen">
          <SideBarLink label="General" link="#navigation" leading-icon="fas fa-house" :submenu="1" />
          <SideBarLink label="Team" link="#navigation" leading-icon="fas fa-users" :submenu="1" />
          <SideBarLink label="Billing" link="#navigation" leading-icon="fas fa-credit-card" :submenu="1" :badge="2" />
        </template>

        <SideBarLink
          label="Dispositivos"
          leading-icon="fas fa-network-wired"
          expandable
          :open="devicesOpen"
          child-active
          @toggle-click="devicesOpen = !devicesOpen"
        />
        <template v-if="devicesOpen">
          <SideBarLink label="Sensores" link="#navigation" leading-icon="fas fa-temperature-half" :submenu="1" />
          <SideBarLink label="Actuadores" link="#navigation" :submenu="2" />
        </template>
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
