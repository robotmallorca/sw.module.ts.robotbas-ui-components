// @vitest-environment nuxt
import { describe, it, expect, afterEach } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { h } from 'vue'
import { renderEach } from '../component-render'
import RobotbasSidebar from '../../src/runtime/components/RobotbasSidebar.vue'
import RobotbasSidebarFooter from '../../src/runtime/components/RobotbasSidebarFooter.vue'

const ORIGINAL_WIDTH = window.innerWidth

function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true, writable: true })
}

describe('RobotbasSidebar', () => {
  afterEach(() => {
    setViewportWidth(ORIGINAL_WIDTH)
  })

  renderEach(RobotbasSidebar, [
    ['default', {}],
    ['with logo', { props: { logo: '/logo.svg', logoAlt: 'RobotBas' } }],
    ['compact', { props: { compact: true, breakpoint: false as const } }],
    ['with compact logo', { props: { compact: true, breakpoint: false as const, compactLogo: '/icon.svg', ui: { compactLogo: 'sidebar-logo-compact' } } }],
    ['with toggle icon', { props: { toggleIcon: 'robotbas-icon-light icon-chevrons-left' } }],
    ['without separator', { props: { separator: false } }],
    ['with ui', { props: { ui: { body: 'min-vh-100', separator: 'sidebar-separator' } } }],
    ['with menu slot', { slots: { default: () => 'Menu slot' } }],
    ['with footer slot', { slots: { footer: () => 'Footer slot' } }],
  ])

  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(RobotbasSidebar)

    expect(wrapper.find('.sidebar-nav-robot').exists()).toBe(true)
    expect(wrapper.find('#menu').exists()).toBe(true)
  })

  describe('logo', () => {
    it('swaps to the compact source when there is one', async () => {
      const wrapper = await mountSuspended(RobotbasSidebar, {
        props: { logo: '/logo.svg', compactLogo: '/icon.svg', compact: true, breakpoint: false },
      })

      expect(wrapper.find('.sidebar-header img').attributes('src')).toBe('/icon.svg')
    })

    it('hides the logo in compact mode when no compact source is given', async () => {
      const wrapper = await mountSuspended(RobotbasSidebar, {
        props: { logo: '/logo.svg', compact: true, breakpoint: false },
      })

      expect(wrapper.find('.sidebar-header img').exists()).toBe(false)
    })
  })

  describe('collapse control', () => {
    it('draws a CSS chevron, depending on no icon pack', async () => {
      const wrapper = await mountSuspended(RobotbasSidebar)

      expect(wrapper.find('.sidebar-toggle-caret').exists()).toBe(true)
      expect(wrapper.html()).not.toContain('icon-chevrons')
    })

    it('uses the icon classes it is given', async () => {
      const wrapper = await mountSuspended(RobotbasSidebar, {
        props: { toggleIcon: 'robotbas-icon-light icon-chevrons-left' },
      })

      expect(wrapper.find('.sidebar-icon-compact').classes()).toContain('icon-chevrons-left')
      expect(wrapper.find('.sidebar-toggle-caret').exists()).toBe(false)
    })

    it('keeps the same icon in both states unless a compact one is given', async () => {
      const wrapper = await mountSuspended(RobotbasSidebar, {
        props: { toggleIcon: 'icon-chevrons-left', compact: true, breakpoint: false },
      })

      expect(wrapper.find('.sidebar-icon-compact').classes()).toContain('icon-chevrons-left')
    })

    it('flips to the compact icon when one is given', async () => {
      const wrapper = await mountSuspended(RobotbasSidebar, {
        props: {
          toggleIcon: 'icon-chevrons-left',
          compactToggleIcon: 'icon-chevrons-right',
          compact: true,
          breakpoint: false,
        },
      })

      expect(wrapper.find('.sidebar-icon-compact').classes()).toContain('icon-chevrons-right')
    })

    it('toggles the model on click', async () => {
      const wrapper = await mountSuspended(RobotbasSidebar, {
        props: { compact: false, breakpoint: false },
      })

      await wrapper.find('.sidebar-icon-compact').trigger('click')

      expect(wrapper.emitted('update:compact')?.at(-1)).toEqual([true])
    })

    it('labels itself for screen readers in both states', async () => {
      const wrapper = await mountSuspended(RobotbasSidebar, {
        props: { compact: true, breakpoint: false, expandLabel: 'Expand' },
      })

      expect(wrapper.find('.sidebar-icon-compact').attributes('aria-label')).toBe('Expand')
    })
  })

  describe('breakpoint', () => {
    it('collapses on mount below the threshold', async () => {
      setViewportWidth(500)
      const wrapper = await mountSuspended(RobotbasSidebar, { props: { compact: false } })

      expect(wrapper.emitted('update:compact')?.at(-1)).toEqual([true])
      expect(wrapper.find('.sidebar-nav-robot').classes()).toContain('compact')
    })

    it('stays expanded above the threshold', async () => {
      setViewportWidth(1200)
      const wrapper = await mountSuspended(RobotbasSidebar, { props: { compact: false } })

      expect(wrapper.find('.sidebar-nav-robot').classes()).not.toContain('compact')
    })

    it('reacts to a resize', async () => {
      setViewportWidth(1200)
      const wrapper = await mountSuspended(RobotbasSidebar, { props: { compact: false } })

      setViewportWidth(500)
      window.dispatchEvent(new Event('resize'))
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.sidebar-nav-robot').classes()).toContain('compact')
    })

    it('leaves the state alone when disabled', async () => {
      setViewportWidth(500)
      const wrapper = await mountSuspended(RobotbasSidebar, {
        props: { compact: false, breakpoint: false },
      })

      expect(wrapper.emitted('update:compact')).toBeFalsy()
      expect(wrapper.find('.sidebar-nav-robot').classes()).not.toContain('compact')
    })

    it('stops listening once unmounted', async () => {
      setViewportWidth(1200)
      const wrapper = await mountSuspended(RobotbasSidebar, { props: { compact: false } })
      wrapper.unmount()

      setViewportWidth(500)
      // Would throw on a detached component if the listener were still bound.
      expect(() => window.dispatchEvent(new Event('resize'))).not.toThrow()
    })
  })

  it('lets the body classes be swapped for a full-height rail', async () => {
    const wrapper = await mountSuspended(RobotbasSidebar, {
      props: { ui: { body: 'min-vh-100' } },
    })

    const body = wrapper.find('.d-flex.flex-column')
    expect(body.classes()).toContain('min-vh-100')
    expect(body.classes()).not.toContain('flex-grow-1')
  })

  // `inject` would not do: slot content resolves it against the component that
  // owns the markup, not against the one rendering the `<slot/>`.
  it('exposes the compact state to the footer slot', async () => {
    const wrapper = await mountSuspended(RobotbasSidebar, {
      props: { compact: true, breakpoint: false },
      slots: {
        footer: ({ compact }: { compact: boolean }) =>
          h(RobotbasSidebarFooter, { name: 'Ada', compact }),
      },
    })

    expect(wrapper.find('.sidebar-footer').classes()).toContain('compact')
  })

  it('exposes it to the menu slot too', async () => {
    const wrapper = await mountSuspended(RobotbasSidebar, {
      props: { compact: true, breakpoint: false },
      slots: {
        default: ({ compact }: { compact: boolean }) => h('span', { class: 'probe' }, String(compact)),
      },
    })

    expect(wrapper.find('.probe').text()).toBe('true')
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(RobotbasSidebar, {
      props: { logo: '/logo.svg', logoAlt: 'RobotBas' },
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
