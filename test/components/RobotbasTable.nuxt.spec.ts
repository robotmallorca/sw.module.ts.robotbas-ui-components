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

/** Texto de la primera columna, en el orden en que se pinta. */
function namesOf(wrapper: { findAll: (s: string) => Array<{ text: () => string }> }) {
  return wrapper.findAll('tbody tr td:first-child').map(td => td.text())
}

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
    ['with ui', { props: { ...base, ui: { table: 'table-striped' } } }],
    // Slots
    ['with top-right slot', { props: base, slots: { 'top-right': () => 'Top right' } }],
    ['with no-data slot', { props: { rows: [], columns }, slots: { 'no-data': () => 'Nothing here' } }],
  ])

  it('renders one row per record', async () => {
    const wrapper = await mountSuspended(RobotbasTable, { props: base })

    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })

  it('renders the formatted value when a column defines format', async () => {
    const wrapper = await mountSuspended(RobotbasTable, {
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
    const wrapper = await mountSuspended(RobotbasTable, {
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
    const wrapper = await mountSuspended(RobotbasTable, { props: base })
    const nameHeader = wrapper.findAll('thead button')[0]!

    await nameHeader.trigger('click')
    expect(namesOf(wrapper)).toEqual(['Alpha', 'Beta', 'Gamma'])

    await nameHeader.trigger('click')
    expect(namesOf(wrapper)).toEqual(['Gamma', 'Beta', 'Alpha'])
  })

  it('sorts numbers numerically, not lexicographically', async () => {
    const wrapper = await mountSuspended(RobotbasTable, { props: base })

    // 3, 7, 10 — como texto el orden sería 10, 3, 7.
    await wrapper.findAll('thead button')[1]!.trigger('click')
    expect(namesOf(wrapper)).toEqual(['Alpha', 'Gamma', 'Beta'])
  })

  it('honours the initial sort coming from pagination', async () => {
    const wrapper = await mountSuspended(RobotbasTable, {
      props: { ...base, pagination: { sortBy: 'name', descending: true } },
    })

    expect(namesOf(wrapper)).toEqual(['Gamma', 'Beta', 'Alpha'])
  })

  it('emits update:pagination when sorting changes', async () => {
    const wrapper = await mountSuspended(RobotbasTable, { props: base })

    await wrapper.findAll('thead button')[0]!.trigger('click')

    const emitted = wrapper.emitted('update:pagination')
    expect(emitted).toHaveLength(1)
    expect(emitted![0]![0]).toMatchObject({ sortBy: 'name', descending: false })
  })

  it('does not make non-sortable columns clickable', async () => {
    const wrapper = await mountSuspended(RobotbasTable, { props: base })

    // name y qty son ordenables; status no.
    expect(wrapper.findAll('thead button')).toHaveLength(2)
  })

  it('exposes the sort direction through aria-sort', async () => {
    const wrapper = await mountSuspended(RobotbasTable, { props: base })
    const headers = wrapper.findAll('thead th')

    expect(headers[0]!.attributes('aria-sort')).toBe('none')
    expect(headers[2]!.attributes('aria-sort')).toBeUndefined()

    await wrapper.findAll('thead button')[0]!.trigger('click')
    expect(wrapper.findAll('thead th')[0]!.attributes('aria-sort')).toBe('ascending')
  })

  it('filters case-insensitively across every column', async () => {
    const wrapper = await mountSuspended(RobotbasTable, {
      props: { ...base, filter: 'UNSEEN' },
    })

    expect(namesOf(wrapper)).toEqual(['Alpha'])
  })

  it('filters on the formatted value, not the raw one', async () => {
    const wrapper = await mountSuspended(RobotbasTable, {
      props: {
        rows,
        columns: [
          { name: 'qty', label: 'Qty', field: 'qty', format: (v: number) => `${v} units` },
        ],
        filter: 'units',
      },
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })

  it('shows the empty state when the filter matches nothing', async () => {
    const wrapper = await mountSuspended(RobotbasTable, {
      props: { ...base, filter: 'nothing matches this', noDataLabel: 'No feedback tickets' },
    })

    expect(wrapper.text()).toContain('No feedback tickets')
  })

  it('paginates and moves between pages', async () => {
    const wrapper = await mountSuspended(RobotbasTable, {
      props: { ...base, pagination: { rowsPerPage: 2 } },
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)

    const next = wrapper.find('[data-slot="pagination"] button:last-child')
    await next.trigger('click')

    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
  })

  it('hides the pager when everything fits on one page', async () => {
    const wrapper = await mountSuspended(RobotbasTable, {
      props: { ...base, pagination: { rowsPerPage: 50 } },
    })

    expect(wrapper.find('[data-slot="pagination"]').exists()).toBe(false)
  })

  it('does not mutate the rows prop when sorting', async () => {
    const original = [...rows]
    const wrapper = await mountSuspended(RobotbasTable, { props: base })

    await wrapper.findAll('thead button')[0]!.trigger('click')

    expect(rows).toEqual(original)
  })

  it('renders a custom cell through the body-cell-<name> slot', async () => {
    const wrapper = await mountSuspended(RobotbasTable, {
      props: base,
      slots: {
        'body-cell-status': ({ value }: { value: unknown }) => `[${value}]`,
      },
    })

    expect(wrapper.text()).toContain('[seen]')
  })

  it('shows the loading state instead of the rows', async () => {
    const wrapper = await mountSuspended(RobotbasTable, {
      props: { ...base, loading: true, loadingLabel: 'Loading tickets' },
    })

    expect(wrapper.text()).toContain('Loading tickets')
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(RobotbasTable, {
      props: { ...base, title: 'Feedback' },
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
