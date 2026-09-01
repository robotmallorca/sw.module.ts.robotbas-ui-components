// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { themeBalham } from 'ag-grid-community'
import type { ColDef } from 'ag-grid-community'
import { renderEach } from '../component-render'
import RobotbasDataGrid from '../../src/runtime/components/RobotbasDataGrid.vue'

interface Entry {
  id: number
  username: string
  action: string
}

const columnDefs: ColDef<Entry>[] = [
  { headerName: 'User', field: 'username', filter: 'agTextColumnFilter' },
  { headerName: 'Action', field: 'action' },
]

const rowData: Entry[] = [
  { id: 1, username: 'ana', action: 'login' },
  { id: 2, username: 'marc', action: 'edit user' },
  { id: 3, username: 'joana', action: 'change password' },
]

const base = { columnDefs, rowData }

describe('RobotbasDataGrid', () => {
  renderEach(RobotbasDataGrid, [
    // Props
    ['with columns and rows', { props: base }],
    ['with title', { props: { ...base, title: 'Audit logs' } }],
    ['with no rows', { props: { columnDefs, rowData: [] } }],
    ['with class', { props: { ...base, class: 'shadow-sm' } }],
    ['with ui', { props: { ...base, ui: { wrapper: 'border' } } }],
    // Slots
    ['with top-right slot', { props: base, slots: { 'top-right': () => 'Top right' } }],
    ['with top slot', { props: base, slots: { top: () => 'Whole top' } }],
  ])

  it('renders the title in the top bar', async () => {
    const wrapper = await mountSuspended(RobotbasDataGrid, {
      props: { ...base, title: 'Audit logs' },
    })

    expect(wrapper.find('[data-slot="title"]').text()).toBe('Audit logs')
  })

  it('omits the top bar when there is no title and no slot', async () => {
    const wrapper = await mountSuspended(RobotbasDataGrid, { props: base })

    expect(wrapper.find('[data-slot="top"]').exists()).toBe(false)
  })

  it('merges the given defaultColDef over the wrapper defaults', async () => {
    const wrapper = await mountSuspended(RobotbasDataGrid, {
      props: { ...base, defaultColDef: { flex: 2, filter: true } },
    })

    const grid = wrapper.findComponent({ name: 'AgGridVue' })
    expect(grid.props('defaultColDef')).toMatchObject({
      resizable: true,
      sortable: true,
      flex: 2,
      filter: true,
    })
  })

  it('paginates by 50 rows unless told otherwise', async () => {
    const wrapper = await mountSuspended(RobotbasDataGrid, { props: base })

    const grid = wrapper.findComponent({ name: 'AgGridVue' })
    expect(grid.props('pagination')).toBe(true)
    expect(grid.props('paginationPageSize')).toBe(50)
  })

  // Un tamaño de página fuera del selector hace que ag-grid avise por consola y
  // lo ignore, así que el wrapper lo añade a la lista.
  it('adds a custom page size to the page size selector', async () => {
    const wrapper = await mountSuspended(RobotbasDataGrid, {
      props: { ...base, paginationPageSize: 20 },
    })

    const grid = wrapper.findComponent({ name: 'AgGridVue' })
    expect(grid.props('paginationPageSizeSelector')).toEqual([10, 20, 25, 50, 100])
  })

  // Un `height: 100%` deja de resolver en cuanto un ancestro saca su altura de
  // un min-height, y el grid se queda en 0px sin dar ningún error: se ve la
  // cabecera y debajo nada.
  it('fills its container by flex, never with a percentage height', async () => {
    const wrapper = await mountSuspended(RobotbasDataGrid, { props: base })

    const grid = wrapper.find('[data-slot="grid"]')
    const style = grid.attributes('style') ?? ''

    expect(style).not.toContain('height: 100%')
    // El shorthand `flex` lo expande el navegador al serializar.
    expect(style).toContain('flex-grow: 1')
    expect(style).toContain('min-height: 0')
  })

  it('keeps a minimum height so it can never render invisible', async () => {
    const wrapper = await mountSuspended(RobotbasDataGrid, { props: base })

    expect(wrapper.find('[data-slot="wrapper"]').attributes('style')).toContain(
      'min-height: 320px',
    )
  })

  it('uses an explicit height as given', async () => {
    const wrapper = await mountSuspended(RobotbasDataGrid, {
      props: { ...base, height: '360px' },
    })

    expect(wrapper.find('[data-slot="grid"]').attributes('style')).toContain(
      'height: 360px',
    )
  })

  it('applies the Robotbas theme by default and honours an override', async () => {
    const themed = await mountSuspended(RobotbasDataGrid, { props: base })
    expect(themed.findComponent({ name: 'AgGridVue' }).props('theme')).toBeTruthy()

    const overridden = await mountSuspended(RobotbasDataGrid, {
      props: { ...base, theme: themeBalham },
    })
    expect(overridden.findComponent({ name: 'AgGridVue' }).props('theme')).toBe(themeBalham)
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(RobotbasDataGrid, {
      props: { ...base, title: 'Audit logs' },
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
