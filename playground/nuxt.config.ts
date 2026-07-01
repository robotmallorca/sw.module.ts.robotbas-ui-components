export default defineNuxtConfig({
  modules: ['../src/module'],
  robotbasUi: {},
  devtools: { enabled: true },
  compatibilityDate: '2025-01-01',

  // El runtime asume estas variables SCSS inyectadas por el consumidor (ver PARTE B
  // del plan: decidir si el módulo las inyecta o las documenta). En el playground se
  // dejan comentadas hasta integrar el runtime real.
  // css: ['~/assets/style/variables.scss'],
})
