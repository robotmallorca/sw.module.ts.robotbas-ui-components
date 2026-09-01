<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ColDef } from 'ag-grid-community'

interface AuditEntry {
  id: number
  timestamp: string
  username: string
  action: string
  application: string | null
}

const ACTIONS = ['login', 'change password request', 'change password', 'edit user']

const rows: AuditEntry[] = [
  { id: 1, timestamp: '2026-01-12T09:24:00Z', username: 'ana@robotbas.com', action: 'login', application: 'robotdesk' },
  { id: 2, timestamp: '2026-01-11T17:02:00Z', username: 'marc@robotbas.com', action: 'edit user', application: null },
  { id: 3, timestamp: '2026-01-10T11:45:00Z', username: 'joana@robotbas.com', action: 'change password', application: null },
  { id: 4, timestamp: '2026-01-09T08:10:00Z', username: 'pau@robotbas.com', action: 'login', application: 'robotsetup' },
  { id: 5, timestamp: '2026-01-08T14:30:00Z', username: 'ana@robotbas.com', action: 'change password request', application: null },
  { id: 6, timestamp: '2026-01-07T10:05:00Z', username: 'marc@robotbas.com', action: 'login', application: 'robotdesk' },
]

const columns: ColDef<AuditEntry>[] = [
  {
    headerName: 'Fecha',
    field: 'timestamp',
    sort: 'desc',
    valueFormatter: (params) =>
      params.value ? new Date(params.value).toLocaleString() : '',
  },
  { headerName: 'Usuario', field: 'username', filter: 'agTextColumnFilter' },
  { headerName: 'Acción', field: 'action' },
  {
    headerName: 'Aplicación',
    field: 'application',
    valueFormatter: (params) => params.value ?? '—',
  },
]

const actionFilter = ref('all')
const loading = ref(false)

const filteredRows = computed(() =>
  actionFilter.value === 'all'
    ? rows
    : rows.filter((row) => row.action === actionFilter.value),
)

function simulateLoading() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1200)
}
</script>

<template>
  <div class="row g-3">
    <div class="col-12">
      <DemoCard label="DataGrid (ag-grid con el tema Robotbas)">
        <RobotbasDataGrid
          :column-defs="columns"
          :row-data="filteredRows"
          :loading="loading"
          :pagination-page-size="10"
          title="Audit logs"
          height="360px"
          no-data-label="No hay entradas"
        >
          <template #top-right>
            <div class="d-flex align-items-center gap-2">
              <RobotbasButton
                label="Simular carga"
                leading-icon="bi bi-arrow-repeat"
                :ui="{ root: 'btn btn-outline-secondary btn-sm' }"
                @click="simulateLoading"
              />
              <select v-model="actionFilter" class="form-select form-select-sm" style="width: auto">
                <option value="all">Todas las acciones</option>
                <option v-for="action in ACTIONS" :key="action" :value="action">
                  {{ action }}
                </option>
              </select>
            </div>
          </template>
        </RobotbasDataGrid>

        <div class="small text-muted mt-2">
          Los módulos de ag-grid los registra el propio componente · pincha las
          cabeceras para ordenar · la columna <em>Usuario</em> lleva filtro de
          texto propio de ag-grid, y el desplegable filtra las filas desde fuera.
        </div>
      </DemoCard>
    </div>
  </div>
</template>
