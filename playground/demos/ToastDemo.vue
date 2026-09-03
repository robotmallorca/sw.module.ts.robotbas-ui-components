<script setup lang="ts">
// `useToast` se auto-importa (el módulo registra los composables del runtime).
// Nota: el Toaster del runtime aún está a medio terminar (los toasts se montan
// fuera del viewport en portal), así que les damos posición fija vía la prop `ui`.
const toast = useToast()
let toastSeq = 0

function showToast() {
  const variants = [
    { title: 'Guardado correctamente', description: 'Los cambios se han aplicado.', icon: 'fas fa-circle-check', accent: 'text-success' },
    { title: 'Sincronización completa', description: 'Todos los dispositivos están al día.', icon: 'fas fa-arrows-rotate', accent: 'text-primary' },
    { title: 'Atención', description: 'Un controlador requiere revisión.', icon: 'fas fa-triangle-exclamation', accent: 'text-warning' },
  ]
  const v = variants[toastSeq++ % variants.length]
  toast.add({
    title: v.title,
    description: v.description,
    icon: v.icon,
    close: false,
    progress: false,
    ui: {
      root: 'robotbas-toast-demo',
      wrapper: 'flex-grow-1',
      leading: `robotbas-toast-demo__icon ${v.accent}`,
      title: 'fw-semibold',
      description: 'text-muted small mb-0',
    },
  })
}
</script>

<template>
  <DemoCard>
    <div class="d-flex flex-wrap align-items-center gap-3">
      <RobotbasButton label="Mostrar notificación" leading-icon="fas fa-bell" @click="showToast" />
      <span class="small text-muted">El Toaster del runtime es WIP; aquí posicionamos los toasts vía la
        prop <code>ui</code>.</span>
    </div>
  </DemoCard>
</template>
