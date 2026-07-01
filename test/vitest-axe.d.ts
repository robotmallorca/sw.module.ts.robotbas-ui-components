import type { AxeMatchers } from 'vitest-axe'

// Aumenta los tipos de Vitest con el matcher de `vitest-axe` para que
// `expect(...).toHaveNoViolations()` tenga tipos en los specs.
declare module 'vitest' {
  interface Assertion extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
