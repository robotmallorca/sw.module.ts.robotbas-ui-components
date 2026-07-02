// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RobotbasCollapsible from '../../src/runtime/components/RobotbasCollapsible.vue'

describe('RobotbasCollapsible', () => {
  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(RobotbasCollapsible, {
      slots: { default: () => 'Toggle', content: () => 'Hidden content' },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('match snapshot', async () => {
    const wrapper = await mountSuspended(RobotbasCollapsible, {
      props: { defaultOpen: true },
      slots: { default: () => 'Toggle', content: () => 'Hidden content' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders the trigger slot', async () => {
    const wrapper = await mountSuspended(RobotbasCollapsible, {
      slots: { default: () => 'Toggle', content: () => 'Hidden content' },
    })
    expect(wrapper.text()).toContain('Toggle')
  })

  it('renders the content when open by default', async () => {
    const wrapper = await mountSuspended(RobotbasCollapsible, {
      props: { defaultOpen: true },
      slots: { default: () => 'Toggle', content: () => 'Hidden content' },
    })
    expect(wrapper.text()).toContain('Hidden content')
  })
})
