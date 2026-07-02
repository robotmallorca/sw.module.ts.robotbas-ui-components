// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { usePortal, portalTargetInjectionKey } from '../../src/runtime/composables/usePortal'
import { withSetup } from './_helpers'

describe('usePortal', () => {
  it('disables the portal and targets body when portal is false', () => {
    const { result } = withSetup(() => usePortal(ref(false)))
    expect(result.value).toEqual({ to: 'body', disabled: true })
  })

  it('targets a string selector as-is', () => {
    const { result } = withSetup(() => usePortal(ref('#modal')))
    expect(result.value).toEqual({ to: '#modal', disabled: false })
  })

  it('resolves the global target when portal is true', () => {
    const { result } = withSetup(
      () => usePortal(ref(true)),
      [[portalTargetInjectionKey, ref('#global-target')]],
    )
    expect(result.value).toEqual({ to: '#global-target', disabled: false })
  })
})
