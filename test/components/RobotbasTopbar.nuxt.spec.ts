// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { h } from 'vue'
import { renderEach } from '../component-render'
import RobotbasTopbar from '../../src/runtime/components/RobotbasTopbar.vue'

describe('RobotbasTopbar', () => {
  renderEach(RobotbasTopbar, [
    ['default', {}],
    ['with a plain title', { props: { title: 'Audit Logs' } }],
    ['with a breadcrumb title', { props: { title: ['Hotel Miramar', 'Rooms'] } }],
    ['with an icon', { props: { title: 'Rooms' }, slots: { icon: () => h('i', { class: 'robotbas-icon-light icon-bed' }) } }],
    ['with a trailing slot', { props: { title: 'Rooms' }, slots: { trailing: () => '@RobotAccount - v1.2.3' } }],
    ['with ui', { props: { title: 'Rooms', ui: { root: 'shadow-sm' } } }],
  ])

  it('renders a single title with no separator', async () => {
    const wrapper = await mountSuspended(RobotbasTopbar, { props: { title: 'Audit Logs' } })

    expect(wrapper.find('.title-text').text()).toBe('Audit Logs')
    expect(wrapper.find('.title-separator').exists()).toBe(false)
  })

  it('joins the parts of a breadcrumb', async () => {
    const wrapper = await mountSuspended(RobotbasTopbar, {
      props: { title: ['Hotel Miramar', 'Rooms', '101'] },
    })

    expect(wrapper.findAll('.title-text').map((t) => t.text())).toEqual([
      'Hotel Miramar',
      'Rooms',
      '101',
    ])
    // One fewer separator than segments: they go BETWEEN the parts.
    expect(wrapper.findAll('.title-separator')).toHaveLength(2)
  })

  // A title built from data that has not loaded yet would otherwise open with a
  // stray "/".
  it('drops empty segments instead of leaving a dangling separator', async () => {
    const wrapper = await mountSuspended(RobotbasTopbar, {
      props: { title: ['', 'Rooms'] },
    })

    expect(wrapper.findAll('.title-text')).toHaveLength(1)
    expect(wrapper.find('.title-separator').exists()).toBe(false)
  })

  it('renders nothing in the title area when there is no title', async () => {
    const wrapper = await mountSuspended(RobotbasTopbar)

    expect(wrapper.find('.title-text').exists()).toBe(false)
    expect(wrapper.find('.robot-top-bar').exists()).toBe(true)
  })

  it('keeps the icon box even when the slot is empty, so titles line up', async () => {
    const wrapper = await mountSuspended(RobotbasTopbar, { props: { title: 'Rooms' } })

    expect(wrapper.find('.icons-nav-robot').exists()).toBe(true)
  })

  it('puts the trailing slot on the right', async () => {
    const wrapper = await mountSuspended(RobotbasTopbar, {
      props: { title: 'Rooms' },
      slots: { trailing: () => h('span', { class: 'version' }, 'v1.2.3') },
    })

    expect(wrapper.find('.top-bar-trailing .version').text()).toBe('v1.2.3')
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(RobotbasTopbar, { props: { title: 'Audit Logs' } })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
