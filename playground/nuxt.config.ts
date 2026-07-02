export default defineNuxtConfig({
  modules: ['../src/module'],
  robotbasUi: {},
  devtools: { enabled: true },
  compatibilityDate: '2025-01-01',

  // Metadatos + base para GitHub Pages.
  //
  // OJO: el baseURL debe ser un STRING LITERAL horneado en build-time. Si el
  // valor fluye desde una env var hacia `app.baseURL` (p. ej. NUXT_APP_BASE_URL
  // o cualquier otra), Nitro lo trata como base de RUNTIME y el prerender emite
  // solo redirects ("Redirecting...") en lugar de la página. Por eso elegimos
  // entre dos literales según si estamos en CI (GitHub Actions) o en local.
  app: {
    baseURL: process.env.GITHUB_ACTIONS ? '/sw.module.ts.robotbas-ui-components/' : '/',
    head: {
      title: '@robotbas/ui — Component Showcase',
      htmlAttrs: { lang: 'es' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Demo interactiva de los componentes Robotbas* de @robotbas/ui.',
        },
      ],
    },
  },

  // El runtime asume estas variables SCSS inyectadas por el consumidor. En la
  // web demo cumplimos ese rol inyectándolas en CADA compilación SCSS (para que
  // los `<style scoped lang="scss">` de los componentes las resuelvan).
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css',
    '~/assets/style/demo.scss',
  ],

  vite: {
    // vue-i18n referencia feature flags de Vue/intlify como identificadores
    // globales (`__VUE_PROD_DEVTOOLS__`, ...). En el bundle de servidor del
    // prerender no se sustituyen y lanzan ReferenceError, así que las definimos
    // explícitamente aquí.
    define: {
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      __VUE_I18N_FULL_INSTALL__: 'true',
      __VUE_I18N_LEGACY_API__: 'false',
      __INTLIFY_PROD_DEVTOOLS__: 'false',
      __INTLIFY_JIT_COMPILATION__: 'true',
      __INTLIFY_DROP_MESSAGE_COMPILER__: 'false',
    },
    // Necesario para que el `define` de arriba alcance a vue-i18n en SSR: si se
    // externaliza, Vite no lo transforma y las flags quedan sin sustituir.
    ssr: {
      noExternal: ['vue-i18n'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/style/variables.scss" as *;\n',
        },
      },
    },
  },

})
