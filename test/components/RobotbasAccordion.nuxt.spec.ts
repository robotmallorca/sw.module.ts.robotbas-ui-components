// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RobotbasAccordion from '../../src/runtime/components/RobotbasAccordion.vue'

const items = [
  { label: 'First', content: 'First body' },
  { label: 'Second', content: 'Second body' },
]

describe('RobotbasAccordion', () => {
  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(RobotbasAccordion, { props: { items } })
    expect(wrapper.exists()).toBe(true)
  })

  it('match snapshot', async () => {
    const wrapper = await mountSuspended(RobotbasAccordion, { props: { items } })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders a trigger per item with its label', async () => {
    const wrapper = await mountSuspended(RobotbasAccordion, { props: { items } })
    expect(wrapper.text()).toContain('First')
    expect(wrapper.text()).toContain('Second')
  })

  it('renders the default slot instead of the label', async () => {
    const wrapper = await mountSuspended(RobotbasAccordion, {
      props: { items },
      slots: { default: () => 'Custom trigger' },
    })
    expect(wrapper.text()).toContain('Custom trigger')
  })
})
