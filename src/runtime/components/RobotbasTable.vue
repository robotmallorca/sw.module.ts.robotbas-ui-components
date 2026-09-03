<script lang="ts">
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
  /** Estilo en línea de la cabecera. */
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
  table?: string
  thead?: string
  th?: string
  tbody?: string
  tr?: string
  td?: string
  sortIcon?: string
  empty?: string
  loading?: string
  pagination?: string
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
  /** Filas compactas (`.table-sm`). */
  dense?: boolean
  /** Deja que el texto de las celdas fluya en varias líneas. */
  wrapCells?: boolean
  /** Icono de columna ordenable sin orden activo. */
  sortIcon?: string
  /** Icono de orden ascendente. */
  sortAscIcon?: string
  /** Icono de orden descendente. */
  sortDescIcon?: string
  class?: any
  ui?: RobotbasTableUI
}

export interface RobotbasTableEmits {
  'update:pagination': [value: RobotbasTablePagination]
}
</script>

<script setup lang="ts" generic="Row extends Record<string, any>">
import { computed, ref, watch } from 'vue'
import RobotbasIcon from './RobotbasIcon.vue'

const props = withDefaults(defineProps<RobotbasTableProps<Row>>(), {
  rowKey: 'id',
  noDataLabel: 'No data available',
  loadingLabel: 'Loading...',
  sortIcon: 'fas fa-sort',
  sortAscIcon: 'fas fa-sort-up',
  sortDescIcon: 'fas fa-sort-down',
})

const emit = defineEmits<RobotbasTableEmits>()

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

// No se usa createUiFn() aquí a propósito: devuelve funciones, no strings, y es
// justo lo que hace que los `:ui` de Combobox/Input/Select no casen con sus
// interfaces `...UI` y el typecheck del repo esté en rojo. Aquí las clases son
// strings de principio a fin.
const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ')

// ---------------------------------------------------------------------------
// Estado de orden y paginación
// ---------------------------------------------------------------------------
const sortBy = ref<string | null>(props.pagination?.sortBy ?? null)
const descending = ref<boolean>(props.pagination?.descending ?? false)
const page = ref<number>(props.pagination?.page ?? 1)

const rowsPerPage = computed(() => props.pagination?.rowsPerPage ?? 0)

watch(
  () => props.pagination,
  (value) => {
    if (!value) return
    if (value.sortBy !== undefined) sortBy.value = value.sortBy
    if (value.descending !== undefined) descending.value = value.descending
    if (value.page !== undefined) page.value = value.page
  },
)

function publishPagination() {
  emit('update:pagination', {
    sortBy: sortBy.value,
    descending: descending.value,
    rowsPerPage: rowsPerPage.value,
    page: page.value,
  })
}

// ---------------------------------------------------------------------------
// Acceso a los valores
// ---------------------------------------------------------------------------
function rawValue(row: Row, column: RobotbasTableColumn<Row>): unknown {
  return typeof column.field === 'function'
    ? column.field(row)
    : row[column.field]
}

/** Valor tal y como se ve. Es también lo que se ordena y se filtra. */
function displayValue(row: Row, column: RobotbasTableColumn<Row>): string {
  const value = rawValue(row, column)
  if (column.format) return column.format(value, row)
  return value === null || value === undefined ? '' : String(value)
}

function rowKeyOf(row: Row, index: number): string | number {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  const value = row[props.rowKey]
  return value === undefined ? index : value
}

// ---------------------------------------------------------------------------
// Filtrado -> orden -> paginación
// ---------------------------------------------------------------------------
const filtered = computed(() => {
  const needle = props.filter?.trim().toLowerCase()
  if (!needle) return props.rows
  return props.rows.filter((row) =>
    props.columns.some((column) =>
      displayValue(row, column).toLowerCase().includes(needle),
    ),
  )
})

const sorted = computed(() => {
  const column = props.columns.find((c) => c.name === sortBy.value)
  if (!column) return filtered.value

  const direction = descending.value ? -1 : 1
  // Copia: Array.sort muta, y `rows` es una prop.
  return [...filtered.value].sort((a, b) => {
    const left = rawValue(a, column)
    const right = rawValue(b, column)

    if (left === right) return 0
    if (left === null || left === undefined) return 1
    if (right === null || right === undefined) return -1

    if (typeof left === 'number' && typeof right === 'number') {
      return (left - right) * direction
    }
    return (
      String(left).localeCompare(String(right), undefined, { numeric: true }) *
      direction
    )
  })
})

const pageCount = computed(() =>
  rowsPerPage.value > 0
    ? Math.max(1, Math.ceil(sorted.value.length / rowsPerPage.value))
    : 1,
)

// Si el filtro reduce el total, la página actual puede quedar fuera de rango.
watch([pageCount, () => props.filter], () => {
  if (page.value > pageCount.value) page.value = pageCount.value
})

const visibleRows = computed(() => {
  if (rowsPerPage.value <= 0) return sorted.value
  const start = (page.value - 1) * rowsPerPage.value
  return sorted.value.slice(start, start + rowsPerPage.value)
})

const firstIndex = computed(() =>
  sorted.value.length === 0 ? 0 : (page.value - 1) * rowsPerPage.value + 1,
)
const lastIndex = computed(() =>
  rowsPerPage.value <= 0
    ? sorted.value.length
    : Math.min(page.value * rowsPerPage.value, sorted.value.length),
)

// ---------------------------------------------------------------------------
// Interacción
// ---------------------------------------------------------------------------
function toggleSort(column: RobotbasTableColumn<Row>) {
  if (!column.sortable) return
  if (sortBy.value === column.name) {
    descending.value = !descending.value
  } else {
    sortBy.value = column.name
    descending.value = false
  }
  page.value = 1
  publishPagination()
}

function goToPage(next: number) {
  const target = Math.min(Math.max(1, next), pageCount.value)
  if (target === page.value) return
  page.value = target
  publishPagination()
}

function sortIconFor(column: RobotbasTableColumn<Row>) {
  if (sortBy.value !== column.name) return props.sortIcon
  return descending.value ? props.sortDescIcon : props.sortAscIcon
}

/** Valor de aria-sort de la cabecera. */
function ariaSortFor(column: RobotbasTableColumn<Row>) {
  if (!column.sortable) return undefined
  if (sortBy.value !== column.name) return 'none'
  return descending.value ? 'descending' : 'ascending'
}

const alignClass = (column: RobotbasTableColumn<Row>) =>
  column.align === 'right'
    ? 'text-end'
    : column.align === 'center'
      ? 'text-center'
      : 'text-start'

const hasTop = computed(() => !!props.title)
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

    <div
      data-slot="wrapper"
      :class="cx('table-responsive', props.ui?.wrapper)"
    >
      <table
        data-slot="table"
        :class="
          cx(
            'table table-hover align-middle mb-0',
            dense && 'table-sm',
            props.ui?.table,
          )
        "
      >
        <thead data-slot="thead" :class="props.ui?.thead">
          <tr>
            <th
              v-for="column in columns"
              :key="column.name"
              scope="col"
              :aria-sort="ariaSortFor(column)"
              :style="column.headerStyle"
              data-slot="th"
              :class="
                cx(
                  alignClass(column),
                  column.sortable && 'user-select-none',
                  column.headerClasses,
                  props.ui?.th,
                )
              "
            >
              <button
                v-if="column.sortable"
                type="button"
                class="btn btn-link p-0 border-0 text-decoration-none fw-semibold text-reset d-inline-flex align-items-center gap-1"
                @click="toggleSort(column)"
              >
                {{ column.label }}
                <RobotbasIcon
                  :name="sortIconFor(column)"
                  data-slot="sortIcon"
                  :class="
                    cx(
                      'small',
                      sortBy !== column.name && 'opacity-50',
                      props.ui?.sortIcon,
                    )
                  "
                />
              </button>
              <template v-else>{{ column.label }}</template>
            </th>
          </tr>
        </thead>

        <tbody data-slot="tbody" :class="props.ui?.tbody">
          <tr v-if="loading">
            <td
              :colspan="columns.length"
              data-slot="loading"
              :class="cx('text-center text-secondary py-4', props.ui?.loading)"
            >
              <slot name="loading">
                <span
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                {{ loadingLabel }}
              </slot>
            </td>
          </tr>

          <tr v-else-if="visibleRows.length === 0">
            <td
              :colspan="columns.length"
              data-slot="empty"
              :class="cx('text-center text-secondary py-4', props.ui?.empty)"
            >
              <slot name="no-data">{{ noDataLabel }}</slot>
            </td>
          </tr>

          <!--
            El bucle va dentro de un <template v-else> y no como `v-for` +
            `v-else` en el propio <tr>: en el mismo elemento, v-if tiene
            prioridad sobre v-for en Vue 3 y la regla vue/no-use-v-if-with-v-for
            lo rechaza.
          -->
          <template v-else>
            <tr
              v-for="(row, index) in visibleRows"
              :key="rowKeyOf(row, index)"
              data-slot="tr"
              :class="props.ui?.tr"
            >
              <td
                v-for="column in columns"
                :key="column.name"
                :style="column.style"
                data-slot="td"
                :class="
                  cx(
                    alignClass(column),
                    !wrapCells && 'text-nowrap',
                    column.classes,
                    props.ui?.td,
                  )
                "
              >
                <slot
                  :name="`body-cell-${column.name}`"
                  :row="row"
                  :value="rawValue(row, column)"
                  :column="column"
                >
                  {{ displayValue(row, column) }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div
      v-if="rowsPerPage > 0 && pageCount > 1"
      data-slot="pagination"
      :class="
        cx(
          'd-flex align-items-center justify-content-end gap-2 mt-2 small text-secondary',
          props.ui?.pagination,
        )
      "
    >
      <span>{{ firstIndex }}&ndash;{{ lastIndex }} of {{ sorted.length }}</span>
      <div class="btn-group btn-group-sm">
        <button
          type="button"
          class="btn btn-outline-secondary"
          :disabled="page <= 1"
          aria-label="Previous page"
          @click="goToPage(page - 1)"
        >
          <RobotbasIcon name="fas fa-chevron-left" />
        </button>
        <button
          type="button"
          class="btn btn-outline-secondary"
          :disabled="page >= pageCount"
          aria-label="Next page"
          @click="goToPage(page + 1)"
        >
          <RobotbasIcon name="fas fa-chevron-right" />
        </button>
      </div>
    </div>
  </div>
</template>
