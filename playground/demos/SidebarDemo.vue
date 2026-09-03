<script setup lang="ts">
import { ref } from 'vue'

// Los dos raíles de la demo se controlan por separado para poder enseñar el
// estado expandido y el compacto a la vez. `breakpoint: false` desactiva el
// auto-colapso: aquí el sidebar vive dentro de una tarjeta, no del viewport.
const compact = ref(false)
const compactAlways = ref(true)

const alertsOpen = ref(false)
</script>

<template>
  <div class="row g-3">
    <div class="col-lg-7">
      <DemoCard label="RobotbasSidebar — con RobotbasSidebarFooter">
        <div class="demo-sidebar-frame">
          <RobotbasSidebar
            v-model:compact="compact"
            :breakpoint="false"
            logo-alt="RobotBAS"
            :ui="{ separator: 'demo-sidebar-separator' }"
          >
            <template #logo="{ compact: isCompact }">
              <span class="demo-rail-brand">
                <RobotbasIcon name="fas fa-cubes" />
                <span v-if="!isCompact">RobotBAS</span>
              </span>
            </template>

            <SideBarLink label="Panel" link="#sidebar" leading-icon="fas fa-gauge-high" />
            <SideBarLink label="Dispositivos" link="#sidebar" leading-icon="fas fa-network-wired" :badge="12" />
            <SideBarLink
              label="Alertas"
              leading-icon="fas fa-bell"
              expandable
              :open="alertsOpen"
              @toggle-click="alertsOpen = !alertsOpen"
            />
            <template v-if="alertsOpen">
              <SideBarLink label="Activas" link="#sidebar" :submenu="1" :badge="3" />
              <SideBarLink label="Histórico" link="#sidebar" :submenu="1" />
            </template>
            <SideBarLink label="Ajustes" link="#sidebar" leading-icon="fas fa-gear" />

            <!-- El estado compacto NO se inyecta: viaja por el slot prop. -->
            <template #footer="{ compact: isCompact }">
              <RobotbasSidebarFooter
                :compact="isCompact"
                name="Ada Lovelace"
                subtitle="MASTER"
                avatar-url="https://ui-avatars.com/api/?background=0d6efd&color=fff&name=Ada+Lovelace"
                avatar-alt="Ada Lovelace"
              >
                <template #default="{ close }">
                  <li>
                    <button type="button" class="dropdown-item" @click="close">
                      <i class="fas fa-user-cog" /> Perfil
                    </button>
                  </li>
                  <li>
                    <button type="button" class="dropdown-item" @click="close">
                      <i class="fas fa-comment-dots" /> Feedback
                    </button>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <button type="button" class="dropdown-item text-danger" @click="close">
                      <i class="fas fa-sign-out-alt" /> Salir
                    </button>
                  </li>
                </template>
              </RobotbasSidebarFooter>
            </template>
          </RobotbasSidebar>
        </div>

        <div class="mt-3">
          <RobotbasButton
            :label="compact ? 'Expandir' : 'Contraer'"
            :leading-icon="compact ? 'fas fa-angles-right' : 'fas fa-angles-left'"
            @click="compact = !compact"
          />
        </div>
      </DemoCard>
    </div>

    <div class="col-lg-5">
      <DemoCard label="Modo compacto — solo iconos">
        <div class="demo-sidebar-frame">
          <RobotbasSidebar
            v-model:compact="compactAlways"
            :breakpoint="false"
            toggle-icon="fas fa-angles-left"
            compact-toggle-icon="fas fa-angles-right"
          >
            <SideBarLink label="Panel" link="#sidebar" leading-icon="fas fa-gauge-high" />
            <SideBarLink label="Dispositivos" link="#sidebar" leading-icon="fas fa-network-wired" :badge="12" />
            <SideBarLink label="Ajustes" link="#sidebar" leading-icon="fas fa-gear" />
          </RobotbasSidebar>
        </div>
      </DemoCard>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* El rail está pensado para ocupar el alto de la ventana; dentro de la demo se
   le pone un marco con alto fijo para que no desborde la tarjeta. */
.demo-sidebar-frame {
  height: 420px;
  overflow: hidden;
  border: 1px solid var(--bs-border-color);
  border-radius: 8px;
  display: flex;
}

.demo-sidebar-frame :deep(.sidebar-nav-robot) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.demo-sidebar-frame :deep(.demo-sidebar-separator) {
  align-self: stretch;
  margin: 1rem 16px;
  border-top: 1px solid var(--bs-border-color);
  opacity: 1;
}

.demo-rail-brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-weight: 600;
}
</style>
