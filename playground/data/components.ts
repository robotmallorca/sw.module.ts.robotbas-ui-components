// Inventario de los componentes del módulo @robotbas/ui.
// Fuente de verdad para el grid del inventario y el contador del hero.
export interface ComponentInfo {
  name: string
  icon: string
  desc: string
  /** `true` si el componente se muestra en vivo en la página. */
  live: boolean
}

export const componentInventory: ComponentInfo[] = [
  { name: 'Accordion', icon: 'bi bi-list-nested', desc: 'Secciones plegables', live: true },
  { name: 'App', icon: 'bi bi-window', desc: 'Provider raíz', live: true },
  { name: 'Avatar', icon: 'bi bi-person-circle', desc: 'Imagen / iniciales', live: true },
  { name: 'AvatarGroup', icon: 'bi bi-people', desc: 'Avatares apilados', live: true },
  { name: 'Badge', icon: 'bi bi-award', desc: 'Etiqueta de estado', live: true },
  { name: 'Button', icon: 'bi bi-hand-index', desc: 'Acción primaria', live: true },
  { name: 'Card', icon: 'bi bi-card-heading', desc: 'Contenedor', live: true },
  { name: 'Chip', icon: 'bi bi-circle-fill', desc: 'Indicador de estado', live: true },
  { name: 'Collapsible', icon: 'bi bi-arrows-collapse', desc: 'Contenido plegable', live: true },
  { name: 'Combobox', icon: 'bi bi-search', desc: 'Búsqueda + selección', live: true },
  { name: 'FieldGroup', icon: 'bi bi-collection', desc: 'Grupo de campos', live: true },
  { name: 'FormField', icon: 'bi bi-input-cursor-text', desc: 'Campo con etiqueta', live: true },
  { name: 'Icon', icon: 'bi bi-emoji-smile', desc: 'Iconografía', live: true },
  { name: 'Input', icon: 'bi bi-input-cursor', desc: 'Entrada de texto', live: true },
  { name: 'InputIterator', icon: 'bi bi-plus-slash-minus', desc: 'Selector cíclico', live: true },
  { name: 'Modal', icon: 'bi bi-window-stack', desc: 'Diálogo', live: true },
  { name: 'Popover', icon: 'bi bi-chat-square-text', desc: 'Panel flotante', live: true },
  { name: 'Progress', icon: 'bi bi-bar-chart-steps', desc: 'Barra de progreso', live: true },
  { name: 'Select', icon: 'bi bi-menu-button-wide', desc: 'Desplegable', live: true },
  { name: 'SelectTree', icon: 'bi bi-diagram-3', desc: 'Selección jerárquica', live: true },
  { name: 'SideBarLink', icon: 'bi bi-link-45deg', desc: 'Enlace de menú', live: true },
  { name: 'SideBarCheckbox', icon: 'bi bi-check2-square', desc: 'Checkbox de menú', live: true },
  { name: 'Tabs', icon: 'bi bi-segmented-nav', desc: 'Pestañas', live: true },
  { name: 'Toast', icon: 'bi bi-bell', desc: 'Notificación', live: true },
  { name: 'Toaster', icon: 'bi bi-broadcast', desc: 'Gestor de toasts', live: true },
  { name: 'ToggleGroup', icon: 'bi bi-toggles', desc: 'Grupo de opciones', live: true },
  { name: 'Tree', icon: 'bi bi-diagram-2', desc: 'Árbol jerárquico', live: true },
  { name: 'Progress (steps)', icon: 'bi bi-list-ol', desc: 'Progreso por pasos', live: true },
]
