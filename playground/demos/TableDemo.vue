<script setup lang="ts">
import { ref } from 'vue'
import type { RobotbasTableColumn } from '../../src/runtime/components/RobotbasTable.vue'

interface Ticket {
  id: number
  type: 'bug' | 'improvement' | 'feature'
  title: string
  user: string
  createdAt: string
  status: 'unseen' | 'seen' | 'hidden'
}

const TYPE_COLORS: Record<string, string> = {
  bug: '#E21118',
  improvement: '#30A46C',
  feature: '#4394DF',
}

const rows: Ticket[] = [
  { id: 1, type: 'bug', title: 'El logo no carga en Safari', user: 'ana@robotbas.com', createdAt: '2026-01-12T09:24:00Z', status: 'unseen' },
  { id: 2, type: 'feature', title: 'Exportar la lista a CSV', user: 'marc@robotbas.com', createdAt: '2026-01-11T17:02:00Z', status: 'seen' },
  { id: 3, type: 'improvement', title: 'Recordar el filtro entre visitas', user: 'joana@robotbas.com', createdAt: '2026-01-10T11:45:00Z', status: 'seen' },
  { id: 4, type: 'bug', title: 'Doble scroll en pantallas estrechas', user: 'pau@robotbas.com', createdAt: '2026-01-09T08:10:00Z', status: 'unseen' },
  { id: 5, type: 'feature', title: 'Atajos de teclado', user: 'ana@robotbas.com', createdAt: '2026-01-08T14:30:00Z', status: 'hidden' },
  { id: 6, type: 'improvement', title: 'Mensajes de error más claros', user: 'marc@robotbas.com', createdAt: '2026-01-07T10:05:00Z', status: 'seen' },
]

const columns: RobotbasTableColumn<Ticket>[] = [
  { name: 'type', label: 'Tipo', field: 'type', sortable: true, style: 'width: 130px' },
  { name: 'title', label: 'Título', field: 'title', sortable: true },
  { name: 'user', label: 'Usuario', field: 'user', sortable: true },
  {
    name: 'createdAt',
    label: 'Creado',
    field: 'createdAt',
    sortable: true,
    format: (v: string) => new Date(v).toLocaleDateString(),
    style: 'width: 120px',
  },
  { name: 'status', label: 'Estado', field: 'status', sortable: true, align: 'right', style: 'width: 110px' },
]

const filter = ref('')
const loading = ref(false)

function simulateLoading() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1200)
}
</script>

<template>
  <div class="row g-3">
    <div class="col-12">
      <DemoCard label="Table (orden, filtro, paginación y celdas a medida)">
        <RobotbasTable
          :rows="rows"
          :columns="columns"
          row-key="id"
          title="Feedback"
          dense
          :filter="filter"
          :loading="loading"
          :pagination="{ sortBy: 'createdAt', descending: true, rowsPerPage: 4 }"
          no-data-label="No hay tickets"
        >
          <template #top-right>
            <div class="d-flex align-items-center gap-2">
              <RobotbasButton
                label="Simular carga"
                leading-icon="fas fa-arrows-rotate"
                :ui="{ root: 'btn btn-outline-secondary btn-sm' }"
                @click="simulateLoading"
              />
              <RobotbasInput
                v-model="filter"
                placeholder="Buscar"
                trailing-icon="fas fa-magnifying-glass"
                :ui="{ root: 'input-group input-group-sm', base: 'form-control', trailing: 'input-group-text' }"
              />
            </div>
          </template>

          <template #body-cell-type="{ value }">
            <RobotbasBadge
              :label="String(value)"
              :background-color-hex="TYPE_COLORS[String(value)]"
              class="text-uppercase"
            />
          </template>

          <template #body-cell-status="{ value }">
            <span class="badge text-bg-light border">{{ value }}</span>
          </template>
        </RobotbasTable>

        <div class="small text-muted mt-2">
          Pincha las cabeceras para ordenar · escribe para filtrar sobre el valor
          <em>mostrado</em> · la paginación aparece sola al pasar de 4 filas.
        </div>
      </DemoCard>
    </div>
  </div>
</template>
