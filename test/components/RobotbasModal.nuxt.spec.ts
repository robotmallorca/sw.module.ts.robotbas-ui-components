// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RobotbasModal from '../../src/runtime/components/RobotbasModal.vue'

describe('RobotbasModal', () => {
  it('renders the trigger without crashing', async () => {
    const wrapper = await mountSuspended(RobotbasModal, {
      slots: { default: () => 'Open modal' },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Open modal')
  })

  it('match snapshot (closed)', async () => {
    const wrapper = await mountSuspended(RobotbasModal, {
      slots: { default: () => 'Open modal' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('teleports the content to the document when open', async () => {
    await mountSuspended(RobotbasModal, {
      props: { open: true },
      slots: { body: () => 'Modal body content' },
    })
    expect(document.body.innerHTML).toContain('Modal body content')
  })
})
