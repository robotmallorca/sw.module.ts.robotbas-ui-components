// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { computed, ref } from 'vue'
import {
  useFormField,
  formFieldInjectionKey,
  inputIdInjectionKey,
  formOptionsInjectionKey,
} from '../../src/runtime/composables/useFormField'
import { withSetup } from './_helpers'

describe('useFormField', () => {
  describe('without a form context', () => {
    it('resolves values from its own props', () => {
      const { result } = withSetup(() => useFormField({
        id: 'my-id',
        name: 'my-name',
        size: 'lg',
        color: 'primary',
        highlight: false,
      }))

      expect(result.id.value).toBe('my-id')
      expect(result.name.value).toBe('my-name')
      expect(result.size.value).toBe('lg')
      expect(result.color.value).toBe('primary')
      expect(result.highlight.value).toBe(false)
      expect(result.disabled.value).toBeFalsy()
    })

    it('exposes no aria attributes', () => {
      const { result } = withSetup(() => useFormField({ name: 'x' }))
      expect(result.ariaAttrs.value).toBeUndefined()
    })

    it('does not throw when emitting form events', () => {
      const { result } = withSetup(() => useFormField({ name: 'x' }))
      expect(() => {
        result.emitFormBlur()
        result.emitFormFocus()
        result.emitFormChange()
      }).not.toThrow()
    })
  })

  describe('with an injected form field', () => {
    const provideErroredField = () => withSetup(
      () => useFormField({ name: 'my-name', color: 'primary', highlight: false }),
      [
        [formFieldInjectionKey, computed(() => ({ name: 'my-name', error: 'Required', ariaId: 'aria-x' }))],
      ],
    )

    it('forces the error color and highlight when the field has an error', () => {
      const { result } = provideErroredField()
      expect(result.color.value).toBe('error')
      expect(result.highlight.value).toBe(true)
    })

    it('builds aria-invalid and aria-describedby from the field', () => {
      const { result } = provideErroredField()
      expect(result.ariaAttrs.value).toEqual({
        'aria-invalid': true,
        'aria-describedby': 'aria-x-error',
      })
    })

    it('falls back to the injected input id when no prop id is given', () => {
      const { result } = withSetup(
        () => useFormField({ name: 'my-name' }),
        [
          [formFieldInjectionKey, computed(() => ({ name: 'my-name', ariaId: 'aria-x' }))],
          [inputIdInjectionKey, ref('injected-id')],
        ],
      )
      expect(result.id.value).toBe('injected-id')
    })
  })

  it('is disabled when the form options say so', () => {
    const { result } = withSetup(
      () => useFormField({ name: 'x' }),
      [[formOptionsInjectionKey, computed(() => ({ disabled: true }))]],
    )
    expect(result.disabled.value).toBe(true)
  })
})
