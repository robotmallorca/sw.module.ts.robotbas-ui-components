import type { Component } from 'vue'

import TokensDemo from './demos/TokensDemo.vue'
import IconsDemo from './demos/IconsDemo.vue'
import ButtonsDemo from './demos/ButtonsDemo.vue'
import BadgesDemo from './demos/BadgesDemo.vue'
import AvatarsDemo from './demos/AvatarsDemo.vue'
import CardsDemo from './demos/CardsDemo.vue'
import FormsDemo from './demos/FormsDemo.vue'
import SelectsDemo from './demos/SelectsDemo.vue'
import ToggleDemo from './demos/ToggleDemo.vue'
import TabsDemo from './demos/TabsDemo.vue'
import DisclosureDemo from './demos/DisclosureDemo.vue'
import ProgressDemo from './demos/ProgressDemo.vue'
import TreeDemo from './demos/TreeDemo.vue'
import OverlaysDemo from './demos/OverlaysDemo.vue'
import ToastDemo from './demos/ToastDemo.vue'
import NavigationDemo from './demos/NavigationDemo.vue'
import InventoryDemo from './demos/InventoryDemo.vue'

export interface ShowcaseSection {
  /** Ancla / id del <section> (usado por el nav y el scroll). */
  id: string
  /** Texto corto para el enlace del nav. */
  label: string
  /** Título del encabezado de la sección. */
  title: string
  /** Clase(s) del icono Bootstrap del encabezado. */
  icon: string
  /** Descripción opcional bajo el título. */
  description?: string
  /** Componente de demostración (contenido de la sección). */
  component: Component
}

// ---------------------------------------------------------------------------
// Registro de secciones de la web demo.
//
// Para AÑADIR un componente nuevo a la página:
//   1. Crea `demos/MiComponenteDemo.vue` (solo el contenido; sin <section>).
//   2. Impórtalo aquí y añade una entrada al array.
// El nav, el orden y el encabezado de la sección se generan automáticamente.
// ---------------------------------------------------------------------------
export const sections: ShowcaseSection[] = [
  { id: 'tokens', label: 'Tokens', title: 'Tokens de color', icon: 'bi bi-palette', description: 'La paleta que alimenta las variables SCSS del runtime.', component: TokensDemo },
  { id: 'icons', label: 'Icons', title: 'RobotbasIcon', icon: 'bi bi-emoji-smile', description: 'Renderiza cualquier fuente de iconos por clase. Aquí, Bootstrap Icons.', component: IconsDemo },
  { id: 'buttons', label: 'Buttons', title: 'Button', icon: 'bi bi-hand-index-thumb', description: 'Estilo por defecto y variantes vía la prop ui.', component: ButtonsDemo },
  { id: 'badges', label: 'Badges', title: 'Badge', icon: 'bi bi-award', description: 'Etiquetas de estado con icono, texto y colores personalizados.', component: BadgesDemo },
  { id: 'avatars', label: 'Avatars', title: 'Avatar · AvatarGroup · Chip', icon: 'bi bi-people', component: AvatarsDemo },
  { id: 'cards', label: 'Cards', title: 'Card', icon: 'bi bi-card-heading', description: 'Contenedor con slots de cabecera, cuerpo y pie.', component: CardsDemo },
  { id: 'forms', label: 'Inputs', title: 'Input · FormField · InputIterator · FieldGroup', icon: 'bi bi-input-cursor-text', component: FormsDemo },
  { id: 'select', label: 'Selects', title: 'Select · Combobox · SelectTree', icon: 'bi bi-menu-button-wide', description: 'Desplegables accesibles con menú en portal (estilados con Bootstrap).', component: SelectsDemo },
  { id: 'toggle', label: 'ToggleGroup', title: 'ToggleGroup', icon: 'bi bi-toggles', description: 'Selección exclusiva de una opción.', component: ToggleDemo },
  { id: 'tabs', label: 'Tabs', title: 'Tabs', icon: 'bi bi-segmented-nav', component: TabsDemo },
  { id: 'disclosure', label: 'Accordions', title: 'Accordion · Collapsible', icon: 'bi bi-list-nested', component: DisclosureDemo },
  { id: 'progress', label: 'Progress bars', title: 'Progress', icon: 'bi bi-bar-chart-steps', component: ProgressDemo },
  { id: 'tree', label: 'Tree', title: 'Tree', icon: 'bi bi-diagram-2', description: 'Árbol jerárquico navegable por teclado.', component: TreeDemo },
  { id: 'overlays', label: 'Modals', title: 'Modal · Popover', icon: 'bi bi-window-stack', description: 'Modales y popovers accesibles.', component: OverlaysDemo },
  { id: 'notifications', label: 'Toasts', title: 'Toast · Toaster', icon: 'bi bi-bell', description: 'Notificaciones efímeras con useToast(). Aparecen abajo a la derecha y se autodescartan.', component: ToastDemo },
  { id: 'navigation', label: 'SideBarLinks', title: 'SideBarLink · SideBarCheckbox', icon: 'bi bi-signpost-split', description: 'Elementos de menú lateral: enlaces con badge y checkboxes con submenús.', component: NavigationDemo },
  { id: 'inventory', label: 'Inventario', title: 'Inventario completo', icon: 'bi bi-grid-3x3-gap', description: 'Los 28 componentes del módulo, todos en uso en esta página.', component: InventoryDemo },
]
