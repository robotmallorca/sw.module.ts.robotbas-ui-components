import { defineNuxtModule, createResolver, addComponentsDir, addImportsDir, addPlugin } from '@nuxt/kit'
export type * from './runtime/types'

type Color = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | (string & {})
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | (string & {})

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Prefix for components
   * @defaultValue `U`
   * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#prefix
   */
  prefix?: string

  /**
   * Enable or disable `@nuxt/fonts` module
   * @defaultValue `true`
   * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#fonts
   */
  fonts?: boolean

  /**
   * Enable or disable `@nuxtjs/color-mode` module
   * @defaultValue `true`
   * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#colormode
   */
  colorMode?: boolean

  /**
   * Customize how the theme is generated
   * @see https://ui.nuxt.com/docs/getting-started/theme/design-system
   */
  theme?: {
    /**
     * Define the color aliases available for components
     * @defaultValue `['primary', 'secondary', 'success', 'info', 'warning', 'error']`
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#themecolors
     */
    colors?: Color[]

    /**
     * Enable or disable transitions on components
     * @defaultValue `true`
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#themetransitions
     */
    transitions?: boolean

    /**
     * Remove all default theme classes from components, keeping only their
     * structure and the classes you supply via `class`, `ui` or `app.config.ui`.
     * @defaultValue `false`
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#themeunstyled
     */
    unstyled?: boolean

    /**
     * The default variants to use for components
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#themedefaultvariants
     */
    defaultVariants?: {
      /**
       * The default color variant to use for components
       * @defaultValue `'primary'`
       */
      color?: Color

      /**
       * The default size variant to use for components
       * @defaultValue `'md'`
       */
      size?: Size
    }

    /**
     * Prefix for Tailwind CSS utility classes
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#themeprefix
     * @example 'tw'
     */
    prefix?: string
  }

  /**
   * Force the import of prose components even if `@nuxtjs/mdc` or `@nuxt/content` are not installed
   * @defaultValue false
   * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#prose
   */
  prose?: boolean

  /**
   * @deprecated Use `prose` instead
   * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#mdc
   */
  mdc?: boolean

  /**
   * Force the import of content & prose components even if `@nuxt/content` is not installed
   * @defaultValue false
   * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#content
   */
  content?: boolean

  /**
   * Experimental features
   */
  experimental?: {
    /**
     * Enable automatic component detection for tree-shaking
     * Only generates theme files for components actually used in your app
     * - `true`: Enable automatic detection
     * - `string[]`: Enable detection and include additional components (useful for dynamic components)
     * @defaultValue false
     * @example true
     * @example ['Modal', 'Dropdown']
     */
    componentDetection?: boolean | string[]
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'robotbas-ui',
    configKey: 'robotbasUi',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {},
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('./runtime')

    // Alias `#ui` -> runtime. Tipado vía .nuxt/tsconfig generado por Nuxt.
    // Mantener este nombre evita re-tocar los imports `#ui/...` del consumidor.
    nuxt.options.alias['#ui'] = runtimeDir

    // Auto-import de los componentes Robotbas* (pathPrefix: false => nombre = fichero).
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      extensions: ['vue'],
      pathPrefix: false,
    })

    // Auto-import de los composables del runtime (useToast, useLocale, usePortal, ...),
    // igual que hace nuxt/ui con addImportsDir('./runtime/composables'). Así el consumidor
    // los usa sin importarlos y sin la ruta `#ui/composables/...`.
    addImportsDir(resolver.resolve('./runtime/composables'))

    // Plugin de runtime del módulo (punto de extensión al estilo nuxt/ui). De momento
    // no hace nada salvo registrarse; aquí irán los providers globales (toast/overlay).
    addPlugin(resolver.resolve('./runtime/plugin'))

    // El runtime se publica como FUENTE (SFC con SCSS SIN compilar). El consumidor debe
    // transpilarlo y no externalizarlo en SSR (igual que reka-ui, para evitar doble
    // instancia de Vue), de modo que Vite compile los .vue/.scss/.ts con SUS variables
    // (p. ej. el variables.scss de Bootstrap inyectado globalmente por el consumidor).
    const toTranspile = [runtimeDir, 'reka-ui']
    nuxt.options.build.transpile.push(...toTranspile)
    nuxt.options.vite ||= {}
    nuxt.options.vite.ssr ||= {}
    const noExternal = nuxt.options.vite.ssr.noExternal
    nuxt.options.vite.ssr.noExternal = Array.isArray(noExternal)
      ? [...noExternal, ...toTranspile]
      : [...toTranspile]
  },
})
