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
  columnDefs: ColDef<Row>[]
  rowData: Row[]
  loading?: boolean
  title?: string
  /**
   * @defaultValue true
   */
  pagination?: boolean
  /**
   * @defaultValue 50
   */
  paginationPageSize?: number
  defaultColDef?: ColDef<Row>
  height?: StringIterator
  minHeight?: string
  /**
   * @defaultValue 'No data available'
   */
  noDataLabel?: string
  getRowId?: (params: GetRowIdParams<Row>) => string
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
    ...(import.meta.dev ? [ValidationModule] : []),
  ])
  modulesRegistered = true
}
registerGridModules()

const props = withDefaults(defineProps<RobotbasDataGridProps<Row>>(), {
  pagination: true,
  paginationPageSize: 50,
  minHeight: '320px',
  noDataLabel: 'No data available',
})

const emit = defineEmits<RobotbasDataGridEmits>()

defineSlots<{
  'top'(): any
  'top-left'(): any
  'top-right'(): any
}>()

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ')

const gridApi = shallowRef<GridApi | null>(null)

const defaultColDef = computed<ColDef<Row>>(() => ({
  resizable: true,
  sortable: true,
  flex: 1,
  ...props.defaultColDef,
}))

const paginationPageSizeSelector = computed(() =>
  [...new Set([10, 25, 50, 100, props.paginationPageSize])].sort((a, b) => a - b),
)

const hasTop = computed(() => !!props.title)

const wrapperStyle = computed(() => ({
  minHeight: props.height ? undefined : props.minHeight,
}))

const gridStyle = computed(() =>
  props.height
    ? { width: '100%', height: props.height }
    : { width: '100%', flex: '1 1 0%', minHeight: 0 },
)

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

    <div
      data-slot="wrapper"
      :class="cx('flex-grow-1 d-flex flex-column', props.ui?.wrapper)"
      :style="wrapperStyle"
    >
      <ClientOnly>
        <AgGridVue
          data-slot="grid"
          :class="props.ui?.grid"
          :style="gridStyle"
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
