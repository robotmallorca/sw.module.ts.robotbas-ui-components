// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ComponentRender from '../component-render'
import type { RobotbasProgressProps, RobotbasProgressSlots } from '../../src/runtime/components/RobotbasProgress.vue'
import RobotbasProgress from '../../src/runtime/components/RobotbasProgress.vue'

describe('Progress', () => {
  // const sizes = Object.keys(theme.variants.size) as any
  // const orientations = Object.keys(theme.variants.orientation) as any
  // const animations = Object.keys(theme.variants.animation) as any
  const max = ['Waiting...', 'Cloning...', 'Migrating...', 'Deploying...', 'Done!']

  it.each([
    // Props
    ['with modelValue', { props: { modelValue: 50 } }],
    ['with status', { props: { modelValue: 50, status: true } }],
    ['with status inverted', { props: { modelValue: 50, status: true, inverted: true } }],
    ['with max', { props: { modelValue: 2, status: true, max } }],
    ['with max inverted', { props: { modelValue: 2, status: true, inverted: true, max } }],
    // ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    // ...orientations.map((orientation: string) => [`with orientation ${orientation}`, { props: { orientation } }]),
    // ...animations.map((animation: string) => [`with animation ${animation}`, { props: { animation } }]),
    ['with color neutral', { props: { color: 'neutral', modelValue: 50 } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'w-48' } }],
    ['with ui', { props: { ui: { base: 'bg-default' } } }],
    // Slots
    ['with status slot', { slots: { status: () => 'Status slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: RobotbasProgressProps, slots?: Partial<RobotbasProgressSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, RobotbasProgress)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(RobotbasProgress, {
      props: {
        modelValue: 75,
        status: true
      }
    })

    expect(await axe(wrapper.element, {
      rules: { region: { enabled: false } }
    })).toHaveNoViolations()
  })
})
