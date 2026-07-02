// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useComponentIcons } from '../../src/runtime/composables/useComponentIcons'

describe('useComponentIcons', () => {
  it('marks leading when leadingIcon is set', () => {
    const { isLeading, leadingIconName } = useComponentIcons(() => ({ leadingIcon: 'i-left' }))
    expect(isLeading.value).toBe(true)
    expect(leadingIconName.value).toBe('i-left')
  })

  it('marks trailing when trailingIcon is set', () => {
    const { isTrailing, trailingIconName } = useComponentIcons(() => ({ trailingIcon: 'i-right' }))
    expect(isTrailing.value).toBe(true)
    expect(trailingIconName.value).toBe('i-right')
  })

  it('places a bare icon on the leading side by default', () => {
    const { isLeading, isTrailing, leadingIconName } = useComponentIcons(() => ({ icon: 'i-star' }))
    expect(isLeading.value).toBe(true)
    expect(isTrailing.value).toBe(false)
    expect(leadingIconName.value).toBe('i-star')
  })

  it('places the icon on the trailing side when trailing is requested', () => {
    const { isLeading, isTrailing, trailingIconName } = useComponentIcons(() => ({ icon: 'i-star', trailing: true }))
    expect(isLeading.value).toBe(false)
    expect(isTrailing.value).toBe(true)
    expect(trailingIconName.value).toBe('i-star')
  })

  it('shows the loading icon on the leading side while loading', () => {
    const { isLeading, leadingIconName } = useComponentIcons(() => ({ loading: true, loadingIcon: 'i-spin' }))
    expect(isLeading.value).toBe(true)
    expect(leadingIconName.value).toBe('i-spin')
  })

  it('shows the loading icon on the trailing side when trailing is requested', () => {
    const { isTrailing, trailingIconName } = useComponentIcons(() => ({ loading: true, trailing: true, loadingIcon: 'i-spin' }))
    expect(isTrailing.value).toBe(true)
    expect(trailingIconName.value).toBe('i-spin')
  })

  it('is reactive to prop changes', () => {
    const props = ref<{ leadingIcon?: string }>({})
    const { isLeading } = useComponentIcons(props)
    expect(isLeading.value).toBe(false)
    props.value = { leadingIcon: 'i-left' }
    expect(isLeading.value).toBe(true)
  })
})
