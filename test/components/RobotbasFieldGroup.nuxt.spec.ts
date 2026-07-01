// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ComponentRender from '../component-render'
import RobotbasFieldGroup, { type RobotbasFieldGroupProps, type RobotbasFieldGroupSlots } from '../../src/runtime/components/RobotbasFieldGroup.vue'
import RobotbasInput from '../../src/runtime/components/RobotbasInput.vue'
import RobotbasButton from '../../src/runtime/components/RobotbasButton.vue'
import type { RobotbasUiOrientation } from '../../src/runtime/types/theme'

describe('FieldGroup', () => {
  // const sizes = Object.keys(buttonTheme.variants.size) as any

  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'absolute' } }],
    // Slots
    ['with default slot', {
      slots: {
        default: () => ({
          components: { RobotbasInput, RobotbasButton },
          template: () => `<RobotbasInput /> <RobotbasButton> Click me! </RobotbasButton>`
        })
      }
    }],
    ['orientation vertical with default slot', {
      props: { orientation: 'vertical' as RobotbasUiOrientation },
      slots: {
        default: () => ({
          components: { RobotbasInput, RobotbasButton },
          template: () => `<RobotbasInput /> <RobotbasButton> Click me! </RobotbasButton>`
        })
      }
    }],
    // ...sizes.map((size: string) =>
    //   [`with size ${size}`, {
    //     props: { size },
    //     slots: {
    //       default: {
    //         components: { RobotbasInput, RobotbasButton },
    //         template: `<UInput /> <UButton> Click me! </UButton>`
    //       }
    //     }
    //   }]
    // )
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: RobotbasFieldGroupProps, slots?: Partial<RobotbasFieldGroupSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, RobotbasFieldGroup)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(RobotbasFieldGroup, {
      slots: {
        default: {
          template: () => `<RobotbasInput /> <RobotbasButton> Click me! </RobotbasButton>`
        }
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
