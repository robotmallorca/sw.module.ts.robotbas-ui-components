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

## Iconos

Ningún componente publicado depende de una fuente de iconos concreta: los que
pintan iconos los reciben por prop (`leading-icon`, `toggle-icon`, `sort-icon`,
`prev-page-icon`, …) y los que necesitan un control por defecto lo dibujan en CSS
(el caret de `SideBarLink`, el doble chevron de `RobotbasSidebar`).

Donde hay un valor por defecto, es de **Font Awesome** (`fas fa-*`), que es el pack
que usan las apps RobotBAS. El módulo **no** lo instala ni lo carga: el consumidor
que use esos defaults tiene que añadirlo a su propio `css`, por ejemplo

```ts
css: [
  '@fortawesome/fontawesome-free/css/fontawesome.css',
  '@fortawesome/fontawesome-free/css/solid.css',
]
```

o bien pasar las clases de su propio pack por las props. Por eso
`@fortawesome/fontawesome-free` es `devDependency` (lo necesita el `playground`),
no `dependency`.

### La fuente propia: RobotApps

En `assets/icons/` viaja la fuente de iconos de RobotBAS (199 glifos, caras Light
y Bold) que antes vivía sólo en RobotDesk. Se carga igual que cualquier otro pack,
añadiéndola al `css` del consumidor:

```ts
css: ['@robotbas/ui/assets/icons/robotbas-icons.css']
```

```html
<i class="robotbas-icon-light icon-projects" />
<i class="robotbas-icon-bold icon-bed" />
```

La clase de cara (`robotbas-icon-light` / `robotbas-icon-bold`) es **obligatoria**:
es de ella de la que cuelgan tanto la familia tipográfica como el glifo. La hoja
original de icomoon se apropiaba de `[class^="icon-"]` globalmente, lo que en una
librería significaría secuestrar cualquier clase `icon-*` del proyecto que la use.

Las dos caras **no comparten codepoints** (`caret-left` es `\e9b3` en Light y
`\e949` en Bold), así que cada una tiene su bloque de reglas. Si hay que
regenerar la hoja desde un export nuevo de icomoon, no fusiones los selectores.
