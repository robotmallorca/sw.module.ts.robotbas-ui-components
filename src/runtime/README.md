# runtime/

Código que se publica **tal cual** y que el módulo (`src/module.ts`) resuelve en el
consumidor con `createResolver`. El alias `#ui` apunta a esta carpeta.

Aquí va el contenido migrado desde la POC (`modules/ui/runtime` de robotdesk2):

- `components/` — componentes `Robotbas*` (auto-importados vía `addComponentsDir`).
- `composables/` — p. ej. `useToast`.
- `types/`
- `utils/`

> Mantener las rutas internas relativas (`../types/utils`, `../utils`) y los imports
> externos del consumidor como `#ui/...`, tal como dejó preparado la POC.
