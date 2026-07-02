// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { computed } from 'vue'
import { useFieldGroup, fieldGroupInjectionKey } from '../../src/runtime/composables/useFieldGroup'
import { withSetup } from './_helpers'

describe('useFieldGroup', () => {
  it('falls back to the prop size and no orientation without a group', () => {
    const { result } = withSetup(() => useFieldGroup({ size: 'lg' }))
    expect(result.size.value).toBe('lg')
    expect(result.orientation.value).toBeUndefined()
  })

  it('inherits size and orientation from the injected group', () => {
    const { result } = withSetup(
      () => useFieldGroup({ size: undefined }),
      [[fieldGroupInjectionKey, computed(() => ({ size: 'sm', orientation: 'horizontal' }))]],
    )
    expect(result.size.value).toBe('sm')
    expect(result.orientation.value).toBe('horizontal')
  })

  it('lets the prop size override the group size', () => {
    const { result } = withSetup(
      () => useFieldGroup({ size: 'xl' }),
      [[fieldGroupInjectionKey, computed(() => ({ size: 'sm', orientation: 'vertical' }))]],
    )
    expect(result.size.value).toBe('xl')
  })
})
