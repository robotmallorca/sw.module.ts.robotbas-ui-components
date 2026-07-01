import { fileURLToPath } from 'node:url'
import { defineVitestConfig } from '@nuxt/test-utils/config'

// El runtime del módulo se publica como FUENTE (SFC + SCSS sin compilar), por lo que
// los tests necesitan un entorno Nuxt real que transpile los `.vue`/`.scss`/`.ts` y
// resuelva los auto-imports (`#components`, `#imports`). Usamos el `playground` como
// app anfitriona: registra el módulo vía `modules: ['../src/module']`, de modo que los
// componentes Robotbas* quedan disponibles igual que en un consumidor real.
export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL('./playground', import.meta.url)),
      },
    },
    include: ['test/**/*.{test,spec}.ts'],
    setupFiles: ['./test/setup/axe.ts', './test/setup/vue-test-utils.ts'],
  },
})
