// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import RobotbasCard from '../../src/runtime/components/RobotbasCard.vue'

describe('RobotbasCard', () => {
  // const variants = Object.keys(theme.variants.variant) as any

  // `renderEach` (helper compartido) monta cada caso y hace snapshot automáticamente.
  renderEach(RobotbasCard, [
    // Props
    ['with as', { props: { as: 'section' } }],
    // ...variants.map((variant: string) => [`with variant ${variant}`, { props: { variant } }]),
    ['with class', { props: { class: 'rounded-xl' } }],
    ['with ui', { props: { ui: { body: 'font-bold' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with header slot', { slots: { header: () => 'Header slot' } }],
    ['with footer slot', { slots: { footer: () => 'Footer slot' } }],
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(RobotbasCard)

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
