import { createApp, h } from 'vue'
import type { App, InjectionKey } from 'vue'

/**
 * Ejecuta un composable dentro de un `setup()` real (necesario para que `inject`/`provide`
 * funcionen sin warnings). Permite inyectar valores de contexto vía `provides` antes del
 * montaje, para probar tanto la rama con proveedor como la de fallback.
 *
 * Requiere un entorno con DOM (happy-dom): añade `// @vitest-environment happy-dom` al spec.
 */
export function withSetup<T>(
  composable: () => T,
  provides: [InjectionKey<unknown> | string, unknown][] = [],
): { result: T, app: App } {
  let result!: T
  const app = createApp({
    setup() {
      result = composable()
      return () => h('div')
    },
  })

  for (const [key, value] of provides) {
    app.provide(key as InjectionKey<unknown>, value)
  }

  app.mount(document.createElement('div'))

  return { result, app }
}
