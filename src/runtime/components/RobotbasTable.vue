<script lang="ts">
import type { Theme } from 'ag-grid-community'

export interface RobotbasTableColumn<Row = any> {
  /** Identificador único. También nombra el slot `body-cell-<name>`. */
  name: string
  /** Texto de la cabecera. */
  label: string
  /** Clave de la fila, o función que extrae el valor. */
  field: string | ((row: Row) => unknown)
  /** Permite ordenar pinchando la cabecera. */
  sortable?: boolean
  /**
   * @defaultValue 'left'
   */
  align?: 'left' | 'center' | 'right'
  /** Formatea el valor para mostrarlo. También es lo que se filtra. */
  format?: (value: any, row: Row) => string
  /** Estilo en línea de las celdas de la columna. */
  style?: string | Record<string, string>
  /** Estilo en línea de la cabecera. Su `width` se trata igual que el de `style`. */
  headerStyle?: string | Record<string, string>
  /** Clases extra de las celdas. */
  classes?: string
  /** Clases extra de la cabecera. */
  headerClasses?: string
}

export interface RobotbasTablePagination {
  /** `name` de la columna por la que se ordena, o null. */
  sortBy?: string | null
  descending?: boolean
  /** 0 desactiva la paginación. */
  rowsPerPage?: number
  /** Página actual, base 1. */
  page?: number
}

export interface RobotbasTableUI {
  root?: string
  top?: string
  title?: string
  wrapper?: string
  /** Clases del propio grid. */
  table?: string
  /** Clases de cada cabecera. */
  th?: string
  /** Clases de cada fila. */
  tr?: string
  /** Clases de cada celda. */
  td?: string
  /** Clases del estado vacío. */
  empty?: string
  /** Clases del estado de carga. */
  loading?: string
}

export interface RobotbasTableProps<Row = any> {
  rows: Row[]
  columns: RobotbasTableColumn<Row>[]
  /** Clave estable de cada fila. Con string se toma esa propiedad. */
  rowKey?: string | ((row: Row) => string | number)
  loading?: boolean
  /** Filtro de texto, insensible a mayúsculas, sobre el valor MOSTRADO. */
  filter?: string
  pagination?: RobotbasTablePagination
  /**
   * @defaultValue 'No data available'
   */
  noDataLabel?: string
  /**
   * @defaultValue 'Loading...'
   */
  loadingLabel?: string
  title?: string
  /** Filas compactas. */
  dense?: boolean
  /** Deja que el texto de las celdas fluya en varias líneas. */
  wrapCells?: boolean
  /** Icono de columna ordenable sin orden activo. */
  sortIcon?: string
  /** Icono de orden ascendente. */
  sortAscIcon?: string
  /** Icono de orden descendente. */
  sortDescIcon?: string
  /** Icono del botón "página anterior" de la paginación. */
  prevPageIcon?: string
  /** Icono del botón "página siguiente" de la paginación. */
  nextPageIcon?: string
  /** Tema de ag-grid. Por defecto el de RobotBAS. */
  theme?: Theme
  class?: any
  ui?: RobotbasTableUI
}

export interface RobotbasTableEmits {
  'update:pagination': [value: RobotbasTablePagination]
}
</script>

<script setup lang="ts" generic="Row extends Record<string, any>">
import { computed, defineComponent, h, nextTick, shallowRef, useSlots, watch } from 'vue'
import type { PropType } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  ModuleRegistry,
  PaginationModule,
  QuickFilterModule,
  RowAutoHeightModule,
  RowStyleModule,
  ValidationModule,
  type ColDef,
  type GetRowIdParams,
  type GridApi,
  type GridReadyEvent,
  type ICellRendererParams,
} from 'ag-grid-community'
import { robotbasGridTheme } from '../utils/grid-theme'

let modulesRegistered = false
function registerGridModules() {
  if (modulesRegistered) return

  ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    QuickFilterModule,
    PaginationModule,
    RowStyleModule,
    CellStyleModule,
    RowAutoHeightModule,
    ColumnApiModule,
    ...(import.meta.dev ? [ValidationModule] : []),
  ])
  modulesRegistered = true
}
registerGridModules()

const props = withDefaults(defineProps<RobotbasTableProps<Row>>(), {
  rowKey: 'id',
  noDataLabel: 'No data available',
  loadingLabel: 'Loading...',
  sortIcon: 'fas fa-sort',
  sortAscIcon: 'fas fa-sort-up',
  sortDescIcon: 'fas fa-sort-down',
  prevPageIcon: 'fas fa-chevron-left',
  nextPageIcon: 'fas fa-chevron-right',
})

const emit = defineEmits<RobotbasTableEmits>()

const slots = useSlots()

defineSlots<{
  'top'(): any
  'top-left'(): any
  'top-right'(): any
  'no-data'(): any
  'loading'(): any
  [key: `body-cell-${string}`]: (props: {
    row: Row
    value: unknown
    column: RobotbasTableColumn<Row>
  }) => any
}>()

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ')

const gridApi = shallowRef<GridApi<Row> | null>(null)

// ---------------------------------------------------------------------------
// Estilos declarados por columna
// ---------------------------------------------------------------------------
function parseStyle(
  style?: string | Record<string, string>,
): Record<string, string> | undefined {
  if (!style) return undefined
  if (typeof style !== 'string') return style

  const parsed: Record<string, string> = {}
  for (const declaration of style.split(';')) {
    const [property, ...rest] = declaration.split(':')
    if (!property || rest.length === 0) continue
    const name = property.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    parsed[name] = rest.join(':').trim()
  }
  return parsed
}

function pixelWidth(value?: string): number | undefined {
  if (!value) return undefined
  const match = /^(\d+(?:\.\d+)?)px$/.exec(value.trim())
  return match ? Number(match[1]) : undefined
}

const ALIGN_CLASS = {
  left: 'rb-table-cell-left',
  center: 'rb-table-cell-center',
  right: 'rb-table-cell-right',
} as const

const alignOf = (column: RobotbasTableColumn<Row>) => column.align ?? 'left'

// ---------------------------------------------------------------------------
// Celdas de slot
// ---------------------------------------------------------------------------
const columnByName = computed(() =>
  Object.fromEntries(props.columns.map(column => [column.name, column])),
)

const SlotCell = defineComponent({
  name: 'RobotbasTableSlotCell',
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<Row>>,
      required: true,
    },
  },
  setup(cellProps) {
    return () => {
      const column = columnByName.value[cellProps.params.colDef?.colId ?? '']
      if (!column) return null
      return slots[`body-cell-${column.name}`]?.({
        row: cellProps.params.data as Row,
        value: cellProps.params.value,
        column,
      })
    }
  },
})

const NoRowsOverlay = defineComponent({
  name: 'RobotbasTableNoRowsOverlay',
  setup() {
    return () =>
      h(
        'span',
        { 'data-slot': 'empty', 'class': cx('text-secondary', props.ui?.empty) },
        slots['no-data']?.() ?? props.noDataLabel,
      )
  },
})

const LoadingOverlay = defineComponent({
  name: 'RobotbasTableLoadingOverlay',
  setup() {
    return () =>
      h(
        'span',
        { 'data-slot': 'loading', 'class': cx('text-secondary', props.ui?.loading) },
        slots.loading?.() ?? [
          h('span', {
            'class': 'spinner-border spinner-border-sm me-2',
            'role': 'status',
            'aria-hidden': 'true',
          }),
          props.loadingLabel,
        ],
      )
  },
})

// ---------------------------------------------------------------------------
// Columnas
// ---------------------------------------------------------------------------
const columnDefs = computed<ColDef<Row>[]>(() =>
  props.columns.map((column) => {
    const cellStyle = parseStyle(column.style)
    const headerStyle = parseStyle(column.headerStyle)
    const width = pixelWidth(cellStyle?.width ?? headerStyle?.width)
    const align = alignOf(column)

    const formatValue = column.format
      ? (params: { value: any, data?: Row }) =>
          column.format!(params.value, params.data as Row)
      : undefined

    return {
      colId: column.name,
      headerName: column.label,
      field: (typeof column.field === 'string'
        ? column.field
        : undefined) as ColDef<Row>['field'],
      valueGetter:
        typeof column.field === 'function'
          ? params => (column.field as (row: Row) => unknown)(params.data as Row)
          : undefined,
      valueFormatter: formatValue,
      getQuickFilterText: formatValue,
      sortable: !!column.sortable,
      unSortIcon: !!column.sortable,
      cellClass: cx(ALIGN_CLASS[align], column.classes, props.ui?.td),
      headerClass: cx(ALIGN_CLASS[align], column.headerClasses, props.ui?.th),
      cellStyle: cellStyle,
      ...(width === undefined ? { flex: 1 } : { width, flex: undefined }),
      cellRenderer: slots[`body-cell-${column.name}`] ? SlotCell : undefined,
    }
  }),
)

const defaultColDef = computed<ColDef<Row>>(() => ({
  resizable: true,
  sortable: false,
  wrapText: props.wrapCells,
  autoHeight: props.wrapCells,
}))

// ---------------------------------------------------------------------------
// Orden y paginación
// ---------------------------------------------------------------------------
const rowsPerPage = computed(() => props.pagination?.rowsPerPage ?? 0)
const paginated = computed(() => rowsPerPage.value > 0)

const displayedRows = computed(() => (props.loading ? [] : props.rows))

const showPagingPanel = computed(() => paginated.value)

const icons = computed(() => ({
  sortAscending: `<i class="${props.sortAscIcon}"></i>`,
  sortDescending: `<i class="${props.sortDescIcon}"></i>`,
  sortUnSort: `<i class="${props.sortIcon} opacity-50"></i>`,
  previous: `<i class="${props.prevPageIcon}"></i>`,
  next: `<i class="${props.nextPageIcon}"></i>`,
}))

const getRowId = computed(() =>
  typeof props.rowKey === 'function'
    ? (params: GetRowIdParams<Row>) => String((props.rowKey as (row: Row) => unknown)(params.data))
    : (params: GetRowIdParams<Row>) => String(params.data[props.rowKey as string]),
)

let lastPublished = ''

function seedPublished() {
  lastPublished = JSON.stringify({
    sortBy: props.pagination?.sortBy ?? null,
    descending: props.pagination?.descending ?? false,
    rowsPerPage: rowsPerPage.value,
    page: props.pagination?.page ?? 1,
  })
}

function applyRequestedSort() {
  const api = gridApi.value
  if (!api) return

  const sortBy = props.pagination?.sortBy ?? null
  seedPublished()
  api.applyColumnState({
    state: props.columns.map(column => ({
      colId: column.name,
      sort:
        sortBy === column.name
          ? props.pagination?.descending
            ? ('desc' as const)
            : ('asc' as const)
          : null,
    })),
  })
}

function onGridReady(event: GridReadyEvent<Row>) {
  gridApi.value = event.api
  applyRequestedSort()
  if (props.pagination?.page && props.pagination.page > 1) {
    event.api.paginationGoToPage(props.pagination.page - 1)
  }
}

watch(
  () => [props.pagination?.sortBy, props.pagination?.descending],
  () => applyRequestedSort(),
)

watch(
  () => props.pagination?.page,
  (page) => {
    if (!page || !gridApi.value) return
    seedPublished()
    gridApi.value.paginationGoToPage(page - 1)
  },
)

function currentPagination(): RobotbasTablePagination {
  const api = gridApi.value
  const sorted = api
    ?.getColumnState()
    .find(state => state.sort !== null && state.sort !== undefined)

  return {
    sortBy: sorted?.colId ?? null,
    descending: sorted?.sort === 'desc',
    rowsPerPage: rowsPerPage.value,
    page: api ? api.paginationGetCurrentPage() + 1 : 1,
  }
}

function publishPagination() {
  const value = currentPagination()
  const fingerprint = JSON.stringify(value)
  if (fingerprint === lastPublished) return
  lastPublished = fingerprint
  emit('update:pagination', value)
}

function onSortChanged() {
  gridApi.value?.paginationGoToFirstPage()
  void nextTick(publishPagination)
}

function onPaginationChanged() {
  void nextTick(publishPagination)
}

function onModelUpdated() {
  const api = gridApi.value
  if (!api) return
  if (api.getDisplayedRowCount() === 0) api.showNoRowsOverlay()
  else api.hideOverlay()
}

const hasTop = computed(() => !!props.title)

defineExpose({ gridApi })
</script>

<template>
  <div data-slot="root" :class="cx(props.ui?.root, props.class)">
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

    <div data-slot="wrapper" :class="props.ui?.wrapper">
      <ClientOnly>
        <AgGridVue
          data-slot="table"
          class="rb-table"
          :class="props.ui?.table"
          style="width: 100%"
          :theme="props.theme ?? robotbasGridTheme"
          :column-defs="columnDefs"
          :default-col-def="defaultColDef"
          :row-data="displayedRows"
          :get-row-id="getRowId"
          :quick-filter-text="props.filter"
          :loading="props.loading"
          :icons="icons"
          :pagination="paginated"
          :pagination-page-size="paginated ? rowsPerPage : undefined"
          :suppress-pagination-panel="!showPagingPanel"
          :row-height="!wrapCells && dense ? 30 : undefined"
          :no-rows-overlay-component="NoRowsOverlay"
          :loading-overlay-component="LoadingOverlay"
          dom-layout="autoHeight"
          @grid-ready="onGridReady"
          @sort-changed="onSortChanged"
          @pagination-changed="onPaginationChanged"
          @model-updated="onModelUpdated"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<style>
.rb-table .rb-table-cell-center {
  justify-content: center;
  text-align: center;
}

.rb-table .rb-table-cell-right {
  justify-content: flex-end;
  text-align: right;
}

.rb-table .ag-header-cell.rb-table-cell-center .ag-header-cell-label {
  justify-content: center;
}

.rb-table .ag-header-cell.rb-table-cell-right .ag-header-cell-label {
  justify-content: flex-end;
}

.rb-table .ag-cell-wrap-text {
  word-break: break-word;
}

</style>
