import { expect } from 'vitest'
import { configureAxe } from 'vitest-axe'
// `vitest-axe` no expone un mapa `exports`, así que apuntamos al fichero real en `dist`.
import * as matchers from 'vitest-axe/dist/matchers.js'

// happy-dom no implementa IntersectionObserver, que usan componentes con virtualización
// o scroll (p. ej. Combobox/Select). Lo mockeamos para que el montaje no reviente. El
// guard evita romper los specs en entorno `node` (sin `window`), p. ej. tests de utils.
if (typeof window !== 'undefined') {
  // @ts-expect-error implementación mínima para el entorno de test
  window.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
}

// Los componentes se montan aislados, sin landmarks de página, así que la regla `region`
// de axe da falsos positivos. La desactivamos (igual que hace el repo oficial nuxt/ui).
configureAxe({
  globalOptions: {
    rules: [{
      id: 'region',
      enabled: false,
    }],
  },
})

// Registra los matchers de `vitest-axe` (`toHaveNoViolations`) usados en los tests de a11y.
expect.extend(matchers)
