// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ComponentRender from '../component-render'
import RobotbasChip from '../../src/runtime/components/RobotbasChip.vue'
import type { RobotbasChipProps, RobotbasChipSlots } from '../../src/runtime/components/RobotbasChip.vue'
import type { RobotbasColorTheme } from '../../src/runtime/types/theme'

describe('Chip', () => {
  // const sizes = Object.keys(theme.variants.size) as any
  // const positions = Object.keys(theme.variants.position) as any

  it.each([
    // Props
    ['with text', { props: { text: 'Text' } }],
    ['with inset', { props: { inset: true } }],
    // ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    // ...positions.map((position: string) => [`with position ${position}`, { props: { position } }]),
    ['with color primary', { props: { color: 'primary' as RobotbasColorTheme } }],
    ['without show', { props: { show: false } }],
    ['with as', { props: { as: 'span' } }],
    ['with class', { props: { class: 'mx-auto' } }],
    ['with ui', { props: { ui: { base: 'text-muted' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with content slot', { slots: { content: () => 'Content slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: RobotbasChipProps & { show?: boolean }, slots?: Partial<RobotbasChipSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, RobotbasChip)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(RobotbasChip, {
      props: {
        text: 'Text'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
