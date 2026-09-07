// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { h } from 'vue'
import { renderEach } from '../component-render'
import RobotbasSidebarFooter from '../../src/runtime/components/RobotbasSidebarFooter.vue'

const USER = { name: 'Ada Lovelace', subtitle: 'MASTER', avatarUrl: 'https://example.test/a.png', avatarAlt: 'ada' }

describe('RobotbasSidebarFooter', () => {
  renderEach(RobotbasSidebarFooter, [
    ['default', {}],
    ['with user', { props: USER }],
    ['compact', { props: { ...USER, compact: true } }],
    ['with separator', { props: { ...USER, separator: true } }],
    ['with compact separator', { props: { ...USER, separator: true, compact: true } }],
    ['with menu items', { props: USER, slots: { default: () => h('li', 'Logout') } }],
    ['with append slot', { props: USER, slots: { append: () => h('div', { class: 'overlay' }) } }],
  ])

  // Both apps hang a modal off the footer; a fragment root would break the
  // `wrapper.classes()` their own tests rely on.
  it('keeps a single root when the append slot is used', async () => {
    const wrapper = await mountSuspended(RobotbasSidebarFooter, {
      props: USER,
      slots: { append: () => h('div', { class: 'overlay' }) },
    })

    expect(wrapper.classes()).toContain('sidebar-footer')
    expect(wrapper.find('.sidebar-footer > .overlay').exists()).toBe(true)
  })

  it('renders the two user lines', async () => {
    const wrapper = await mountSuspended(RobotbasSidebarFooter, { props: USER })

    expect(wrapper.find('.text2').text()).toBe('Ada Lovelace')
    expect(wrapper.find('.supporting-text').text()).toBe('MASTER')
    expect(wrapper.find('img').attributes('src')).toBe(USER.avatarUrl)
  })

  it('always gives the avatar an alt, even with no user loaded yet', async () => {
    const wrapper = await mountSuspended(RobotbasSidebarFooter, {
      props: { avatarUrl: USER.avatarUrl },
    })

    expect(wrapper.find('img').attributes('alt')).toBe('')
  })

  describe('dropdown', () => {
    it('starts closed', async () => {
      const wrapper = await mountSuspended(RobotbasSidebarFooter, { props: USER })

      expect(wrapper.find('.dropdown-menu').classes()).not.toContain('show')
      expect(wrapper.find('.link-profile').attributes('aria-expanded')).toBe('false')
    })

    it('opens on click', async () => {
      const wrapper = await mountSuspended(RobotbasSidebarFooter, { props: USER })

      await wrapper.find('.link-profile').trigger('click')

      expect(wrapper.find('.dropdown-menu').classes()).toContain('show')
      expect(wrapper.find('.link-profile').attributes('aria-expanded')).toBe('true')
    })

    it('does not lean on Bootstrap\'s JS to open', async () => {
      const wrapper = await mountSuspended(RobotbasSidebarFooter, { props: USER })

      expect(wrapper.find('.link-profile').attributes('data-bs-toggle')).toBeUndefined()
    })

    it('closes through the slot prop', async () => {
      const wrapper = await mountSuspended(RobotbasSidebarFooter, {
        props: USER,
        slots: {
          default: ({ close }: { close: () => void }) =>
            h('li', [h('button', { class: 'item', onClick: close }, 'Profile')]),
        },
      })

      await wrapper.find('.link-profile').trigger('click')
      expect(wrapper.find('.dropdown-menu').classes()).toContain('show')

      await wrapper.find('.item').trigger('click')
      expect(wrapper.find('.dropdown-menu').classes()).not.toContain('show')
    })
  })

  describe('separator', () => {
    it('is off by default', async () => {
      const wrapper = await mountSuspended(RobotbasSidebarFooter, { props: USER })

      expect(wrapper.find('hr').exists()).toBe(false)
    })

    it('narrows in compact mode', async () => {
      const expanded = await mountSuspended(RobotbasSidebarFooter, {
        props: { ...USER, separator: true },
      })
      const compact = await mountSuspended(RobotbasSidebarFooter, {
        props: { ...USER, separator: true, compact: true },
      })

      expect(expanded.find('hr').attributes('width')).toBe('178')
      expect(compact.find('hr').attributes('width')).toBe('50')
    })
  })

  it('renders expanded by default', async () => {
    const wrapper = await mountSuspended(RobotbasSidebarFooter, { props: USER })

    expect(wrapper.find('.sidebar-footer').classes()).not.toContain('compact')
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(RobotbasSidebarFooter, { props: USER })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
