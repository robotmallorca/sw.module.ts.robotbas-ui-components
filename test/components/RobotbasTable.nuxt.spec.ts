// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import RobotbasTable from '../../src/runtime/components/RobotbasTable.vue'

interface Ticket {
  id: number
  name: string
  qty: number
  status: string
}

const columns = [
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'qty', label: 'Qty', field: 'qty', sortable: true, align: 'right' as const },
  { name: 'status', label: 'Status', field: 'status' },
]

const rows: Ticket[] = [
  { id: 1, name: 'Beta', qty: 10, status: 'seen' },
  { id: 2, name: 'Alpha', qty: 3, status: 'unseen' },
  { id: 3, name: 'Gamma', qty: 7, status: 'hidden' },
]

const base = { rows, columns }

type Wrapper = Awaited<ReturnType<typeof mountSuspended>>

/**
 * ag-grid crea las filas de forma asíncrona y las coloca con `transform`, no en
 * el orden del DOM, así que hay que esperarlas y leer su `row-index`.
 */
const settle = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms))

async function mountTable(options: Parameters<typeof mountSuspended>[1] = {}) {
  const wrapper = await mountSuspended(RobotbasTable, options)
  await settle()
  return wrapper
}

/** Texto de la primera columna, en el orden en que se ve. */
function namesOf(wrapper: Wrapper) {
  return wrapper
    .findAll('.ag-row')
    .map(row => ({
      index: Number(row.attributes('row-index')),
      text: row.find('[aria-colindex="1"]').text(),
    }))
    .sort((a, b) => a.index - b.index)
    .map(row => row.text)
}

const dataRows = (wrapper: Wrapper) => wrapper.findAll('.ag-row')

const headerLabels = (wrapper: Wrapper) => wrapper.findAll('.ag-header-cell-label')

const gridOf = (wrapper: Wrapper) => wrapper.findComponent({ name: 'AgGridVue' })

describe('RobotbasTable', () => {
  renderEach(RobotbasTable, [
    // Props
    ['with rows and columns', { props: base }],
    ['with title', { props: { ...base, title: 'Feedback' } }],
    ['with dense', { props: { ...base, dense: true } }],
    ['with wrapCells', { props: { ...base, wrapCells: true } }],
    ['with loading', { props: { ...base, loading: true } }],
    ['with no rows', { props: { rows: [], columns } }],
    ['with filter', { props: { ...base, filter: 'alpha' } }],
    ['with pagination', { props: { ...base, pagination: { rowsPerPage: 2 } } }],
    ['with class', { props: { ...base, class: 'shadow-sm' } }],
    ['with ui', { props: { ...base, ui: { wrapper: 'border' } } }],
    // Slots
    ['with top-right slot', { props: base, slots: { 'top-right': () => 'Top right' } }],
    ['with no-data slot', { props: { rows: [], columns }, slots: { 'no-data': () => 'Nothing here' } }],
  ])

  it('renders one row per record', async () => {
    const wrapper = await mountTable({ props: base })

    expect(dataRows(wrapper)).toHaveLength(3)
  })

  it('renders the formatted value when a column defines format', async () => {
    const wrapper = await mountTable({
      props: {
        rows,
        columns: [
          { name: 'qty', label: 'Qty', field: 'qty', format: (v: number) => `${v} units` },
        ],
      },
    })

    expect(wrapper.text()).toContain('10 units')
  })

  it('resolves a function field', async () => {
    const wrapper = await mountTable({
      props: {
        rows,
        columns: [
          { name: 'both', label: 'Both', field: (row: Ticket) => `${row.name}/${row.qty}` },
        ],
      },
    })

    expect(wrapper.text()).toContain('Beta/10')
  })

  it('sorts ascending on the first header click and descending on the second', async () => {
    const wrapper = await mountTable({ props: base })
    const nameHeader = headerLabels(wrapper)[0]!

    await nameHeader.trigger('click')
    expect(namesOf(wrapper)).toEqual(['Alpha', 'Beta', 'Gamma'])

    await nameHeader.trigger('click')
    expect(namesOf(wrapper)).toEqual(['Gamma', 'Beta', 'Alpha'])
  })

  it('sorts numbers numerically, not lexicographically', async () => {
    const wrapper = await mountTable({ props: base })

    // 3, 7, 10 — como texto el orden sería 10, 3, 7.
    await headerLabels(wrapper)[1]!.trigger('click')
    expect(namesOf(wrapper)).toEqual(['Alpha', 'Gamma', 'Beta'])
  })

  it('honours the initial sort coming from pagination', async () => {
    const wrapper = await mountTable({
      props: { ...base, pagination: { sortBy: 'name', descending: true } },
    })

    expect(namesOf(wrapper)).toEqual(['Gamma', 'Beta', 'Alpha'])
  })

  // ag-grid despacha sus eventos por su propia cola, así que el emit no ha
  // salido todavía cuando el click termina.
  it('emits update:pagination when sorting changes', async () => {
    const wrapper = await mountTable({ props: base })

    await headerLabels(wrapper)[0]!.trigger('click')
    await settle()

    const emitted = wrapper.emitted('update:pagination')
    expect(emitted).toHaveLength(1)
    expect(emitted![0]![0]).toMatchObject({ sortBy: 'name', descending: false })
  })

  // El estado que piden las props se aplica sobre el grid, y eso dispara sus
  // eventos: publicarlo sería avisar al consumidor de lo que él mismo pidió.
  it('does not emit for the state the props already asked for', async () => {
    const wrapper = await mountTable({
      props: { ...base, pagination: { sortBy: 'name', descending: true, rowsPerPage: 2 } },
    })

    expect(wrapper.emitted('update:pagination')).toBeUndefined()
  })

  it('does not make non-sortable columns clickable', async () => {
    const wrapper = await mountTable({ props: base })
    const headers = wrapper.findAll('.ag-header-cell')

    // name y qty son ordenables; status no.
    expect(headers[0]!.classes()).toContain('ag-header-cell-sortable')
    expect(headers[1]!.classes()).toContain('ag-header-cell-sortable')
    expect(headers[2]!.classes()).not.toContain('ag-header-cell-sortable')
  })

  it('exposes the sort direction through aria-sort', async () => {
    const wrapper = await mountTable({ props: base })
    const headers = wrapper.findAll('.ag-header-cell')

    expect(headers[0]!.attributes('aria-sort')).toBe('none')
    expect(headers[2]!.attributes('aria-sort')).toBeUndefined()

    await headerLabels(wrapper)[0]!.trigger('click')
    expect(wrapper.findAll('.ag-header-cell')[0]!.attributes('aria-sort')).toBe('ascending')
  })

  it('filters case-insensitively across every column', async () => {
    const wrapper = await mountTable({ props: { ...base, filter: 'UNSEEN' } })

    expect(namesOf(wrapper)).toEqual(['Alpha'])
  })

  it('filters on the formatted value, not the raw one', async () => {
    const wrapper = await mountTable({
      props: {
        rows,
        columns: [
          { name: 'qty', label: 'Qty', field: 'qty', format: (v: number) => `${v} units` },
        ],
        filter: 'units',
      },
    })

    expect(dataRows(wrapper)).toHaveLength(3)
  })

  it('shows the empty state when the filter matches nothing', async () => {
    const wrapper = await mountTable({
      props: { ...base, filter: 'nothing matches this', noDataLabel: 'No feedback tickets' },
    })

    expect(wrapper.text()).toContain('No feedback tickets')
  })

  it('paginates and moves between pages', async () => {
    const wrapper = await mountTable({
      props: { ...base, pagination: { rowsPerPage: 2 } },
    })

    expect(dataRows(wrapper)).toHaveLength(2)

    await wrapper.find('.ag-paging-button[data-ref="btNext"]').trigger('click')
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(dataRows(wrapper)).toHaveLength(1)
  })

  it('does not mutate the rows prop when sorting', async () => {
    const original = [...rows]
    const wrapper = await mountTable({ props: base })

    await headerLabels(wrapper)[0]!.trigger('click')

    expect(rows).toEqual(original)
  })

  it('renders a custom cell through the body-cell-<name> slot', async () => {
    const wrapper = await mountTable({
      props: base,
      slots: {
        'body-cell-status': ({ value }: { value: unknown }) => `[${value}]`,
      },
    })

    expect(wrapper.text()).toContain('[seen]')
  })

  it('hands the slot the row, the raw value and the column', async () => {
    const seen: Array<Record<string, unknown>> = []
    await mountTable({
      props: base,
      slots: {
        'body-cell-status': (slotProps: Record<string, unknown>) => {
          seen.push(slotProps)
          return 'x'
        },
      },
    })

    expect(seen[0]).toMatchObject({
      row: expect.objectContaining({ name: expect.any(String) }),
      value: expect.any(String),
      column: expect.objectContaining({ name: 'status' }),
    })
  })

  it('shows the loading state instead of the rows', async () => {
    const wrapper = await mountTable({
      props: { ...base, loading: true, loadingLabel: 'Loading tickets' },
    })

    expect(wrapper.text()).toContain('Loading tickets')
    expect(dataRows(wrapper)).toHaveLength(0)
  })

  // Un `width` en el `style` de la columna no puede quedarse en CSS: ag-grid
  // escribe el ancho que él calcula en el style del div de cada celda.
  it('turns a declared width into the width of the column', async () => {
    const wrapper = await mountTable({
      props: {
        rows,
        columns: [
          { name: 'name', label: 'Name', field: 'name', style: 'width: 90px' },
          { name: 'qty', label: 'Qty', field: 'qty' },
        ],
      },
    })

    const [fixed, flexible] = gridOf(wrapper).props('columnDefs') as Array<Record<string, unknown>>
    expect(fixed).toMatchObject({ width: 90, flex: undefined })
    expect(flexible).toMatchObject({ flex: 1 })
  })

  it('grows with its content instead of needing a height', async () => {
    // Un alto fijo dejaría la tabla recortada dentro de una página cualquiera,
    // que es como se usaba la tabla semántica.
    const wrapper = await mountTable({ props: base })

    expect(gridOf(wrapper).props('domLayout')).toBe('autoHeight')
  })

  it('keeps the given icons for sorting and paging', async () => {
    const wrapper = await mountTable({
      props: { ...base, sortAscIcon: 'bi bi-caret-up', nextPageIcon: 'bi bi-caret-right' },
    })

    const icons = gridOf(wrapper).props('icons') as Record<string, string>
    expect(icons.sortAscending).toContain('bi bi-caret-up')
    expect(icons.next).toContain('bi bi-caret-right')
  })

  it('renders the title in the top bar', async () => {
    const wrapper = await mountTable({ props: { ...base, title: 'Feedback' } })

    expect(wrapper.find('[data-slot="title"]').text()).toBe('Feedback')
  })

  it('omits the top bar when there is no title and no slot', async () => {
    const wrapper = await mountTable({ props: base })

    expect(wrapper.find('[data-slot="top"]').exists()).toBe(false)
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountTable({ props: { ...base, title: 'Feedback' } })

    expect(await axe(wrapper.element, {
      rules: {
        // "ARIA hidden element must not be focusable or contain focusable
        // elements (aria-hidden-focus)"

        // Fix all of the following:
        //   Focusable content should have tabindex="-1" or be removed from the DOM

        // Es el panel de paginación de ag-grid, que cuando no hay paginación se
        // queda en el DOM con aria-hidden y sus botones dentro. Lo tapa su
        // propia clase `ag-hidden`, y vitest no aplica CSS.
        'aria-hidden-focus': { enabled: false },
      },
    })).toHaveNoViolations()
  })
})
