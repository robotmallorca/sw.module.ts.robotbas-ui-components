import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

// Algunos specs montan con `mount()` de @vue/test-utils (app Vue aislada, sin los
// plugins de Nuxt del playground). Los componentes que usan `useLocale()` (= `useI18n`)
// necesitan vue-i18n instalado, así que lo registramos globalmente para TODOS los
// montajes (`mount` y `mountSuspended`). Mensajes vacíos: vue-i18n devuelve la clave.
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {},
})

config.global.plugins.push(i18n)
