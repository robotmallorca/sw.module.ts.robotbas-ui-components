import { defineNuxtPlugin } from '#imports'

/**
 * Plugin de runtime de @robotbas/ui.
 *
 * Los composables del runtime (useToast, useLocale, usePortal, ...) se auto-importan
 * vía `addImportsDir` en el módulo (src/module.ts), igual que en nuxt/ui — NO hace falta
 * registrarlos aquí.
 *
 * Este plugin queda como punto de extensión a nivel de app para futuros providers
 * globales (p. ej. el provider de toasts/overlay que monta nuxt/ui), inyección de
 * helpers en `nuxtApp`, etc.
 */
export default defineNuxtPlugin(() => {
  // Sin providers por ahora.
})
