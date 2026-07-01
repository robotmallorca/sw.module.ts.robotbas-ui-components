// @vitest-environment nuxt
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useToast } from '../../src/runtime/composables/useToast'

// `useToast` usa `useState` de Nuxt, así que debe invocarse dentro de un `setup()` con
// contexto Nuxt. Montamos un componente mínimo y devolvemos la API para manipularla.
async function setupToast() {
  let api!: ReturnType<typeof useToast>
  await mountSuspended({
    setup() {
      api = useToast()
      return () => h('div')
    },
  })
  return api
}

// El estado (`useState('toasts')`) es un singleton compartido en el runtime de test.
const flush = () => new Promise(resolve => setTimeout(resolve, 0))

describe('useToast', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds a toast with a generated id and open state', async () => {
    const toast = await setupToast()
    toast.clear()

    const added = toast.add({ title: 'Hello' })
    expect(added.id).toBeDefined()
    expect(added.open).toBe(true)

    await flush()
    expect(toast.toasts.value.some(t => t.id === added.id)).toBe(true)
  })

  it('updates an existing toast', async () => {
    const toast = await setupToast()
    toast.clear()

    const added = toast.add({ title: 'Before' })
    await flush()

    toast.update(added.id, { title: 'After' })
    const found = toast.toasts.value.find(t => t.id === added.id)
    expect(found?.title).toBe('After')
  })

  it('closes a toast immediately and removes it after the timeout', async () => {
    const toast = await setupToast()
    toast.clear()

    const added = toast.add({ title: 'Bye' })
    await flush()

    vi.useFakeTimers()
    toast.remove(added.id)
    expect(toast.toasts.value.find(t => t.id === added.id)?.open).toBe(false)

    vi.advanceTimersByTime(200)
    expect(toast.toasts.value.some(t => t.id === added.id)).toBe(false)
  })

  it('clears every toast', async () => {
    const toast = await setupToast()
    toast.add({ title: 'A' })
    toast.add({ title: 'B' })
    await flush()

    toast.clear()
    expect(toast.toasts.value).toEqual([])
  })

  it('caps the number of visible toasts to the default maximum', async () => {
    const toast = await setupToast()
    toast.clear()

    for (let i = 0; i < 7; i++) {
      toast.add({ title: `Toast ${i}` })
    }
    await flush()

    expect(toast.toasts.value.length).toBe(5)
  })
})
