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
  { name: 'Accordion', icon: 'fas fa-list-ul', desc: 'Secciones plegables', live: true },
  { name: 'App', icon: 'fas fa-window-maximize', desc: 'Provider raíz', live: true },
  { name: 'Avatar', icon: 'fas fa-circle-user', desc: 'Imagen / iniciales', live: true },
  { name: 'AvatarGroup', icon: 'fas fa-users', desc: 'Avatares apilados', live: true },
  { name: 'Badge', icon: 'fas fa-award', desc: 'Etiqueta de estado', live: true },
  { name: 'Button', icon: 'fas fa-hand-pointer', desc: 'Acción primaria', live: true },
  { name: 'Card', icon: 'fas fa-id-card', desc: 'Contenedor', live: true },
  { name: 'Chip', icon: 'fas fa-circle', desc: 'Indicador de estado', live: true },
  { name: 'Collapsible', icon: 'fas fa-compress', desc: 'Contenido plegable', live: true },
  { name: 'Combobox', icon: 'fas fa-magnifying-glass', desc: 'Búsqueda + selección', live: true },
  { name: 'DataGrid', icon: 'fas fa-table-cells', desc: 'ag-grid con tema Robotbas', live: true },
  { name: 'FieldGroup', icon: 'fas fa-layer-group', desc: 'Grupo de campos', live: true },
  { name: 'FormField', icon: 'fas fa-i-cursor', desc: 'Campo con etiqueta', live: true },
  { name: 'Icon', icon: 'fas fa-face-smile', desc: 'Iconografía', live: true },
  { name: 'Input', icon: 'fas fa-i-cursor', desc: 'Entrada de texto', live: true },
  { name: 'InputIterator', icon: 'fas fa-plus-minus', desc: 'Selector cíclico', live: true },
  { name: 'Modal', icon: 'fas fa-window-restore', desc: 'Diálogo', live: true },
  { name: 'Popover', icon: 'fas fa-comment-dots', desc: 'Panel flotante', live: true },
  { name: 'Progress', icon: 'fas fa-bars-progress', desc: 'Barra de progreso', live: true },
  { name: 'Select', icon: 'fas fa-square-caret-down', desc: 'Desplegable', live: true },
  { name: 'SelectTree', icon: 'fas fa-sitemap', desc: 'Selección jerárquica', live: true },
  { name: 'SideBarLink', icon: 'fas fa-link', desc: 'Enlace de menú', live: true },
  { name: 'SideBarCheckbox', icon: 'fas fa-square-check', desc: 'Checkbox de menú', live: true },
  { name: 'Table', icon: 'fas fa-table', desc: 'Tabla de datos', live: true },
  { name: 'Tabs', icon: 'fas fa-window-maximize', desc: 'Pestañas', live: true },
  { name: 'Toast', icon: 'fas fa-bell', desc: 'Notificación', live: true },
  { name: 'Toaster', icon: 'fas fa-tower-broadcast', desc: 'Gestor de toasts', live: true },
  { name: 'ToggleGroup', icon: 'fas fa-toggle-on', desc: 'Grupo de opciones', live: true },
  { name: 'Tree', icon: 'fas fa-sitemap', desc: 'Árbol jerárquico', live: true },
  { name: 'Progress (steps)', icon: 'fas fa-list-ol', desc: 'Progreso por pasos', live: true },
]
