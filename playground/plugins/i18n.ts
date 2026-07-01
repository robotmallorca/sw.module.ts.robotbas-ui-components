import { createI18n } from 'vue-i18n'

// Los componentes Robotbas* que usan `useLocale()` (= `useI18n` de vue-i18n) requieren
// que el CONSUMIDOR instale vue-i18n vía `app.use(i18n)`. El playground actúa como
// consumidor (y como app anfitriona de los tests), así que registramos aquí una
// instancia mínima. `missingWarn`/`fallbackWarn` desactivados: sin mensajes definidos,
// vue-i18n devuelve la propia clave, suficiente para render y tests.
export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    missingWarn: false,
    fallbackWarn: false,
    messages: {},
  })

  nuxtApp.vueApp.use(i18n)
})
