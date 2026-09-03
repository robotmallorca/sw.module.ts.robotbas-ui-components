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
import TableDemo from './demos/TableDemo.vue'
import DataGridDemo from './demos/DataGridDemo.vue'
import OverlaysDemo from './demos/OverlaysDemo.vue'
import ToastDemo from './demos/ToastDemo.vue'
import NavigationDemo from './demos/NavigationDemo.vue'
import SidebarDemo from './demos/SidebarDemo.vue'
import InventoryDemo from './demos/InventoryDemo.vue'

export interface ShowcaseSection {
  /** Ancla / id del <section> (usado por el nav y el scroll). */
  id: string
  /** Texto corto para el enlace del nav. */
  label: string
  /** Título del encabezado de la sección. */
  title: string
  /** Clase(s) del icono Font Awesome del encabezado. */
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
  { id: 'tokens', label: 'Tokens', title: 'Tokens de color', icon: 'fas fa-palette', description: 'La paleta que alimenta las variables SCSS del runtime.', component: TokensDemo },
  { id: 'icons', label: 'Icons', title: 'RobotbasIcon', icon: 'fas fa-face-smile', description: 'Renderiza cualquier fuente de iconos por clase. Aquí, Font Awesome.', component: IconsDemo },
  { id: 'buttons', label: 'Buttons', title: 'Button', icon: 'fas fa-hand-pointer', description: 'Estilo por defecto y variantes vía la prop ui.', component: ButtonsDemo },
  { id: 'badges', label: 'Badges', title: 'Badge', icon: 'fas fa-award', description: 'Etiquetas de estado con icono, texto y colores personalizados.', component: BadgesDemo },
  { id: 'avatars', label: 'Avatars', title: 'Avatar · AvatarGroup · Chip', icon: 'fas fa-users', component: AvatarsDemo },
  { id: 'cards', label: 'Cards', title: 'Card', icon: 'fas fa-id-card', description: 'Contenedor con slots de cabecera, cuerpo y pie.', component: CardsDemo },
  { id: 'forms', label: 'Inputs', title: 'Input · FormField · InputIterator · FieldGroup', icon: 'fas fa-i-cursor', component: FormsDemo },
  { id: 'select', label: 'Selects', title: 'Select · Combobox · SelectTree', icon: 'fas fa-square-caret-down', description: 'Desplegables accesibles con menú en portal (estilados con Bootstrap).', component: SelectsDemo },
  { id: 'toggle', label: 'ToggleGroup', title: 'ToggleGroup', icon: 'fas fa-toggle-on', description: 'Selección exclusiva de una opción.', component: ToggleDemo },
  { id: 'tabs', label: 'Tabs', title: 'Tabs', icon: 'fas fa-window-maximize', component: TabsDemo },
  { id: 'disclosure', label: 'Accordions', title: 'Accordion · Collapsible', icon: 'fas fa-list-ul', component: DisclosureDemo },
  { id: 'progress', label: 'Progress bars', title: 'Progress', icon: 'fas fa-bars-progress', component: ProgressDemo },
  { id: 'tree', label: 'Tree', title: 'Tree', icon: 'fas fa-sitemap', description: 'Árbol jerárquico navegable por teclado.', component: TreeDemo },
  { id: 'table', label: 'Table', title: 'Table', icon: 'fas fa-table', description: 'Tabla de datos con orden, filtro, paginación y celdas a medida.', component: TableDemo },
  { id: 'datagrid', label: 'DataGrid', title: 'DataGrid', icon: 'fas fa-table-cells', description: 'Envoltorio de ag-grid con el tema Robotbas: registra sus módulos y trae orden, filtros y paginación.', component: DataGridDemo },
  { id: 'overlays', label: 'Modals', title: 'Modal · Popover', icon: 'fas fa-window-restore', description: 'Modales y popovers accesibles.', component: OverlaysDemo },
  { id: 'notifications', label: 'Toasts', title: 'Toast · Toaster', icon: 'fas fa-bell', description: 'Notificaciones efímeras con useToast(). Aparecen abajo a la derecha y se autodescartan.', component: ToastDemo },
  { id: 'navigation', label: 'SideBarLinks', title: 'SideBarLink · SideBarCheckbox', icon: 'fas fa-signs-post', description: 'Elementos de menú lateral: enlaces con badge y checkboxes con submenús.', component: NavigationDemo },
  { id: 'sidebar', label: 'Sidebar', title: 'Sidebar · SidebarFooter', icon: 'fas fa-table-columns', description: 'El rail lateral completo que comparten RobotDesk y RobotAccount: cabecera con logo, control de contraer, menú y pie de usuario.', component: SidebarDemo },
  { id: 'inventory', label: 'Inventario', title: 'Inventario completo', icon: 'fas fa-table-cells-large', description: 'Los 30 componentes del módulo, todos en uso en esta página.', component: InventoryDemo },
]
