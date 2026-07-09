# sw.module.ts.robotbas-ui-components
RobotBAS VUE UI components shared with all webapps.
Project module derived from NuxtUI.

---

## Description

`@robotbas/ui` is a **Nuxt module** that bundles the RobotBAS UI components
(`Robotbas*`) together with their composables and types, so they can be shared across
all webapps. It follows the architecture of [Nuxt UI](https://ui.nuxt.com): once the
module is registered, its components and composables become **auto-imported** in the
consumer project — no manual imports required.

Unlike a compiled package, **the runtime is published as SOURCE** (Vue SFCs with
**uncompiled** SCSS). The consumer project is the one that transpiles it with its own
design variables; this lets the components blend in with each webapp's Bootstrap 5 theme.

## What's included

- **Components** `Robotbas*` (`RobotbasButton`, `RobotbasInput`, `RobotbasModal`,
  `RobotbasSelect`, `RobotbasTree`, `RobotbasToast`…) in
  [`src/runtime/components/`](src/runtime/components/).
- **Composables**: `useToast`, `useLocale`, `usePortal`, `useFormField`,
  `useFieldGroup`, `useAvatarGroup`, `useComponentIcons` in
  [`src/runtime/composables/`](src/runtime/composables/).
- **Types** for each component's props/emits/slots and theme utilities in
  [`src/runtime/types/`](src/runtime/types/).

## How it works

The entry point is [`src/module.ts`](src/module.ts), a `defineNuxtModule` with
`configKey: 'robotbasUi'`. In its `setup()`:

1. **Components** → `addComponentsDir(...)` with `pathPrefix: false`, so each component is
   used by its **file name** (`<RobotbasButton />`).
2. **Composables** → `addImportsDir('./runtime/composables')`; used without importing them
   (`const toast = useToast()`).
3. **Runtime plugin** → `addPlugin('./runtime/plugin')`, an extension point for future
   global providers (toasts/overlays).
4. **Transpilation** → adds the runtime and `reka-ui` to `build.transpile` and to
   `vite.ssr.noExternal`, so Vite compiles the `.vue/.scss/.ts` with the consumer's
   variables and there's no duplicate Vue instance in SSR.
5. **`#ui` alias** → points to the `runtime/` folder (POC legacy). With the package's
   `exports` field you can now use `@robotbas/ui/...` instead (see below).

## Getting started in your consumer project

### 1. Install the package

From GitHub (`dev` branch):

```bash
pnpm add "github:robotmallorca/sw.module.ts.robotbas-ui-components"
```

### 2. Register the module in `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  build: {
    transpile: ['reka-ui'],
  },
  modules: ['@robotbas/ui'],

  imports: {
    dirs: ['../node_modules/@robotbas/ui/src/runtime/composables'],
  },
  
})
```

### 3. Provide the SCSS variables

Create `assets/style/variables.scss` with the tokens the components expect
(`$primary-*`, `$gray-*`, `$textmd-regular`, `$robotbas-border-radius-default`…). Use
[`playground/assets/style/variables.scss`](playground/assets/style/variables.scss) as a
template.

> This file is injected into **every** SCSS compilation, so it must only contain
> **declarations** (variables/mixins/functions), never rules that emit CSS.

### 4. Use the components

## Importing types

**Components and composables** are auto-imported; **types** are not. Import them with
`@robotbas/ui/...` paths (enabled by the package's `exports` field):

| Import | Use |
|---|---|
| `import type { TreeItem } from '@robotbas/ui/types'` | Types re-exported in the barrel |
| `import type { RobotbasColorTheme } from '@robotbas/ui/types/theme'` | A specific type file |
| `import type { RobotbasSelectProps } from '@robotbas/ui/components/RobotbasSelect.vue'` | Any component's types, straight from its `.vue` |
| `import type { RobotbasButtonProps } from '@robotbas/ui'` | From the root (only the barrel-re-exported types) |

> Note: the barrel [`src/runtime/types/index.ts`](src/runtime/types/index.ts) currently
> re-exports only a subset of components. For types of components not included there,
> import them directly from their `.vue` (row 3 of the table).

## Module options

The module accepts the `robotbasUi` key in `nuxt.config.ts`. The full `ModuleOptions`
interface (prefix, fonts, colorMode, theme, prose, content…) is defined in
[`src/module.ts`](src/module.ts) mirroring Nuxt UI's, but **the `setup()` does not consume
them yet**: it only registers components, composables, the plugin and transpilation.
Treat them as reference/WIP.

## Development

The [`playground/`](playground/) is both the demo site and the host app for the tests
(it acts as the reference consumer project).

```bash
pnpm dev            # nuxi dev playground
pnpm dev:prepare    # generate .nuxt types
pnpm test           # vitest run
pnpm lint           # eslint
pnpm typecheck      # nuxi typecheck playground
```

## License

See [LICENSE.md](LICENSE.md).
