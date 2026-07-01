// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { computed } from 'vue'
import { useAvatarGroup, avatarGroupInjectionKey } from '../../src/runtime/composables/useAvatarGroup'
import { withSetup } from './_helpers'

describe('useAvatarGroup', () => {
  it('uses the prop size when there is no parent group', () => {
    const { result } = withSetup(() => useAvatarGroup({ size: 'lg' }))
    expect(result.size.value).toBe('lg')
  })

  it('inherits the size from the injected parent group', () => {
    const { result } = withSetup(
      () => useAvatarGroup({ size: undefined }),
      [[avatarGroupInjectionKey, computed(() => ({ size: 'md' }))]],
    )
    expect(result.size.value).toBe('md')
  })

  it('lets the prop size override the inherited size', () => {
    const { result } = withSetup(
      () => useAvatarGroup({ size: 'xs' }),
      [[avatarGroupInjectionKey, computed(() => ({ size: 'md' }))]],
    )
    expect(result.size.value).toBe('xs')
  })
})
