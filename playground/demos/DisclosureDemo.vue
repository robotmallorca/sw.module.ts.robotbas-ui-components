<script setup lang="ts">
import { ref } from 'vue'

const collapsibleOpen = ref(false)

const accordionItems = [
  { label: '¿Qué es @robotbas/ui?', icon: 'bi bi-box-seam', content: 'Una librería de componentes Vue (Robotbas*) empaquetada como módulo Nuxt y distribuida como fuente, compartida entre las webapps de RobotBAS.' },
  { label: '¿Cómo se integra?', icon: 'bi bi-plug', content: 'Se registra como módulo en nuxt.config. Los componentes se auto-importan y el consumidor inyecta sus variables SCSS de marca.' },
  { label: '¿Sobre qué está construido?', icon: 'bi bi-layers', content: 'Sobre reka-ui para la accesibilidad y el comportamiento, con estilado basado en Bootstrap 5 y tokens SCSS.' },
]
</script>

<template>
  <div class="row g-3">
    <div class="col-lg-7">
      <DemoCard label="Accordion">
        <RobotbasAccordion :items="accordionItems" trailing-icon="bi bi-chevron-down" />
      </DemoCard>
    </div>
    <div class="col-lg-5">
      <DemoCard label="Collapsible">
        <RobotbasCollapsible v-model:open="collapsibleOpen">
          <RobotbasButton
            label=""
            :ui="{ root: 'btn btn-outline-primary w-100 d-flex justify-content-between align-items-center' }">
            <span>Detalles técnicos</span>
            <template #trailing>
              <RobotbasIcon :name="collapsibleOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" />
            </template>
          </RobotbasButton>
          <template #content>
            <div class="pt-3 text-muted small">
              Contenido que aparece y desaparece con animación accesible gestionada
              por reka-ui. Ideal para paneles de ajustes avanzados.
            </div>
          </template>
        </RobotbasCollapsible>
      </DemoCard>
    </div>
  </div>
</template>
