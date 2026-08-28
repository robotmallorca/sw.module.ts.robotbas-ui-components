<script lang="ts">
import type {
  ColDef,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  Theme,
} from 'ag-grid-community'

export interface RobotbasDataGridUI {
  root?: string
  top?: string
  title?: string
  wrapper?: string
  grid?: string
}

export interface RobotbasDataGridProps<Row = any> {
  /** Definición de las columnas de ag-grid. */
  columnDefs: ColDef<Row>[]
  rowData: Row[]
  /** Muestra el overlay de carga de ag-grid. */
  loading?: boolean
  /** Cabecera opcional sobre el grid. */
  title?: string
  /**
   * @defaultValue true
   */
  pagination?: boolean
  /**
   * @defaultValue 50
   */
  paginationPageSize?: number
  /** Se fusiona sobre el defaultColDef del wrapper. */
  defaultColDef?: ColDef<Row>
  /**
   * Altura del grid. ag-grid no se dimensiona solo: sin una altura real no
   * pinta ninguna fila.
   * @defaultValue '100%'
   */
  height?: string
  /**
   * @defaultValue 'No data available'
   */
  noDataLabel?: string
  /** Clave estable de cada fila. Sin ella, ag-grid recrea las filas al refrescar. */
  getRowId?: (params: GetRowIdParams<Row>) => string
  /** Sustituye el tema Robotbas por uno propio. */
  theme?: Theme
  class?: any
  ui?: RobotbasDataGridUI
}

export interface RobotbasDataGridEmits {
  'grid-ready': [event: GridReadyEvent]
}
</script>

<script setup lang="ts" generic="Row extends Record<string, any>">
import { computed, shallowRef } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import {
  CellStyleModule,
  ClientSideRowModelModule,
  DateFilterModule,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  RowStyleModule,
  TextFilterModule,
  ValidationModule,
} from 'ag-grid-community'
import { robotbasGridTheme } from '../utils/grid-theme'

// ag-grid v33+ es modular: sin registrar los módulos el grid se pinta en blanco
// y sin error. Se hace aquí, y no en un plugin del consumidor, para que montar
// el componente sea suficiente. El registro es aditivo, así que una app que ya
// tenga el suyo (RobotDesk) no entra en conflicto — siempre que haya una sola
// copia de ag-grid-community, que es lo que garantiza la peerDependency.
let modulesRegistered = false
function registerGridModules() {
  if (modulesRegistered) return
  ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TextFilterModule,
    NumberFilterModule,
    DateFilterModule,
    PaginationModule,
    RowStyleModule,
    CellStyleModule,
    // Convierte los grids en blanco por configuración inválida en un error de
    // consola. Fuera de desarrollo solo es peso.
    ...(import.meta.dev ? [ValidationModule] : []),
  ])
  modulesRegistered = true
}
registerGridModules()

const props = withDefaults(defineProps<RobotbasDataGridProps<Row>>(), {
  pagination: true,
  paginationPageSize: 50,
  height: '100%',
  noDataLabel: 'No data available',
})

const emit = defineEmits<RobotbasDataGridEmits>()

defineSlots<{
  'top'(): any
  'top-left'(): any
  'top-right'(): any
}>()

// No se usa createUiFn() aquí a propósito: devuelve funciones, no strings, y es
// justo lo que hace que los `:ui` de Combobox/Input/Select no casen con sus
// interfaces `...UI` y el typecheck del repo esté en rojo. Aquí las clases son
// strings de principio a fin.
const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ')

const gridApi = shallowRef<GridApi | null>(null)

const defaultColDef = computed<ColDef<Row>>(() => ({
  resizable: true,
  sortable: true,
  flex: 1,
  ...props.defaultColDef,
}))

// `paginationPageSize` tiene que estar entre las opciones del selector o ag-grid
// avisa por consola y lo ignora.
const paginationPageSizeSelector = computed(() =>
  [...new Set([10, 25, 50, 100, props.paginationPageSize])].sort((a, b) => a - b),
)

const hasTop = computed(() => !!props.title)

function onGridReady(event: GridReadyEvent) {
  gridApi.value = event.api
  emit('grid-ready', event)
}

defineExpose({ gridApi })
</script>

<template>
  <div data-slot="root" :class="cx('d-flex flex-column', props.ui?.root, props.class)">
    <div
      v-if="hasTop || $slots.top || $slots['top-left'] || $slots['top-right']"
      data-slot="top"
      :class="
        cx(
          'd-flex flex-wrap align-items-center justify-content-between gap-2 mb-2',
          props.ui?.top,
        )
      "
    >
      <slot name="top">
        <slot name="top-left">
          <h2
            v-if="title"
            data-slot="title"
            :class="cx('fs-5 fw-semibold mb-0', props.ui?.title)"
          >
            {{ title }}
          </h2>
        </slot>
        <slot name="top-right" />
      </slot>
    </div>

    <!--
      min-height: 0 es obligatorio, no cosmético: dentro de un contenedor flex un
      item no encoge por debajo de su contenido, así que sin esto el grid se sale
      de la pantalla en vez de scrollar por dentro.
    -->
    <div
      data-slot="wrapper"
      class="flex-grow-1"
      style="min-height: 0"
      :class="props.ui?.wrapper"
    >
      <ClientOnly>
        <AgGridVue
          data-slot="grid"
          :class="props.ui?.grid"
          :style="{ width: '100%', height: props.height }"
          :theme="props.theme ?? robotbasGridTheme"
          :column-defs="props.columnDefs"
          :row-data="props.rowData"
          :default-col-def="defaultColDef"
          :pagination="props.pagination"
          :pagination-page-size="props.paginationPageSize"
          :pagination-page-size-selector="paginationPageSizeSelector"
          :loading="props.loading"
          :get-row-id="props.getRowId"
          :overlay-no-rows-template="props.noDataLabel"
          @grid-ready="onGridReady"
        />
      </ClientOnly>
    </div>
  </div>
</template>
