// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ComponentRender from '../component-render'
import type { RobotbasPopoverProps, RobotbasPopoverSlots } from '../../src/runtime/components/RobotbasPopover.vue'
import RobotbasPopover from '../../src/runtime/components/RobotbasPopover.vue'

describe('RobotbasPopover', () => {
  const props = { open: true, portal: false }

  it.each([
    // Props
    ['with open', { props }],
    ['with arrow', { props: { ...props, arrow: true } }],
    ['with class', { props: { ...props, class: 'shadow-xl' } }],
    ['with ui', { props: { ...props, ui: { content: 'shadow-xl' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with anchor slot', { props, slots: { anchor: () => 'Anchor slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: RobotbasPopoverProps, slots?: Partial<RobotbasPopoverSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, RobotbasPopover)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(RobotbasPopover, {
      props: {
        open: true,
        portal: false,
        arrow: true

      },
      slots: {
        default: '<RobotbasInput />',
        content: () => 'Content Slot',
        anchor: '<RobotbasInput />'
      }
    })

    expect(await axe(wrapper.element, {
      rules: {
        // RekaUI does not handle nor check for aria-dialog-name in their tests either
        // https://github.com/unovue/reka-ui/blob/v2/packages/core/src/Popover/Popover.test.ts
        'aria-dialog-name': {
          enabled: false
        }
      }
    })).toHaveNoViolations()
  })
})
