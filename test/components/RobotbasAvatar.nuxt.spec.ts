// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ComponentRender from '../component-render'
import type { RobotbasAvatarProps, RobotbasAvatarSlots } from '../../src/runtime/types'
import RobotbasAvatar from '../../src/runtime/components/RobotbasAvatar.vue'

describe('Avatar', () => {
  // const sizes = Object.keys(theme.variants.size) as any

  it.each([
    // Props
    ['with src', { props: { src: 'https://github.com/benjamincanac.png' } }],
    ['with alt', { props: { alt: 'Benjamin Canac' } }],
    ['with text', { props: { text: '+1' } }],
    ['with icon', { props: { icon: 'i-lucide-image' } }],
    ['with chip', { props: { chip: { text: '1' } } }],
    // ...sizes.map((size: string) => [`with size ${size}`, { props: { src: 'https://github.com/benjamincanac.png', size } }]),
    ['with as', { props: { as: 'section' } }],
    ['with as (object)', { props: { src: 'https://github.com/benjamincanac.png', as: { root: 'section', img: 'p' } } }],
    ['with as (partial object)', { props: { src: 'https://github.com/benjamincanac.png', as: { img: 'p' } } }],
    ['with class', { props: { class: 'bg-default' } }],
    ['with ui', { props: { ui: { fallback: 'font-bold' } } }],
    // Slots
    ['with default slot', { slots: { default: () => '🇫🇷' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: RobotbasAvatarProps, slots?: RobotbasAvatarSlots }) => {
    const html = await ComponentRender(nameOrHtml, options, RobotbasAvatar)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(RobotbasAvatar, {
      props: {
        alt: 'Benjamin Canac',
        src: 'https://github.com/benjamincanac.png'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
