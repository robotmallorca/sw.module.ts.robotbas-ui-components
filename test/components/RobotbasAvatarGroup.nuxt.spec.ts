// @vitest-environment nuxt
import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ComponentRender from '../component-render'
import RobotbasAvatarGroup, { type RobotbasAvatarGroupProps, type RobotbasAvatarGroupSlots } from '../../src/runtime/components/RobotbasAvatarGroup.vue'
import RobotbasAvatar from '../../src/runtime/components/RobotbasAvatar.vue'

const AvatarGroupWrapper = defineComponent({
  components: {
    UAvatar: RobotbasAvatar,
    UAvatarGroup: RobotbasAvatarGroup
  },
  template: `<UAvatarGroup>
  <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
  <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
  <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
</UAvatarGroup>`
})

describe('AvatarGroup', () => {
  // const sizes = Object.keys(theme.variants.size) as any

  it.each([
    // Props
    ['with max', { props: { max: 2 } }],
    // ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ['with as', { props: { as: 'span' } }],
    ['with class', { props: { class: 'justify-start' } }],
    ['with ui', { props: { ui: { base: 'rounded-lg' } } }],
    // Slots
    ['with default slot', {}]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: RobotbasAvatarGroupProps, slots?: Partial<RobotbasAvatarGroupSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, AvatarGroupWrapper)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(AvatarGroupWrapper, {
      props: {
        max: 2
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
