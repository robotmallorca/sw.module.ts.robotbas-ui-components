<script lang="ts">
export interface RobotbasSidebarUI {
  /** Extra classes on the outer rail (`.sidebar-nav-robot`). */
  root?: string
  /**
   * Classes on the inner flex column. Defaults to `flex-grow-1` (the rail grows
   * inside its parent); pass `min-vh-100` for a rail that owns the viewport.
   */
  body?: string
  header?: string
  /** Classes on the `<img>` while the rail is expanded. */
  logo?: string
  /** Classes on the `<img>` while the rail is compact. */
  compactLogo?: string
  toggle?: string
  menu?: string
  separator?: string
  footer?: string
}

export interface RobotbasSidebarProps {
  /** Logo shown while the rail is expanded. */
  logo?: string
  /** Logo shown while the rail is compact. Omit it to show none there. */
  compactLogo?: string
  logoAlt?: string
  /**
   * Icon classes for the collapse control while the rail is expanded.
   * Left empty it falls back to a double chevron drawn in CSS, so the module
   * depends on no icon pack (same reasoning as `SideBarLink`).
   */
  toggleIcon?: string
  /**
   * Icon classes while the rail is compact. Defaults to `toggleIcon`, i.e. the
   * control does NOT flip unless you ask it to.
   */
  compactToggleIcon?: string
  collapseLabel?: string
  expandLabel?: string
  /** Draw the `<hr>` between the menu and the footer. */
  separator?: boolean
  /**
   * Viewport width (px) below which the rail collapses on its own. Applied on
   * mount and on every resize. `false` leaves the state entirely to the app.
   */
  breakpoint?: number | false
  ui?: RobotbasSidebarUI
}

export interface RobotbasSidebarSlots {
  /** Replaces the `<img>` in the header. */
  logo(props: { compact: boolean }): any
  /** Replaces the collapse control. */
  toggle(props: { compact: boolean, toggle: () => void }): any
  /** The menu itself: `SideBarLink` / `SideBarCheckbox` items. */
  default(props: { compact: boolean }): any
  footer(props: { compact: boolean }): any
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'

const props = withDefaults(defineProps<RobotbasSidebarProps>(), {
  logoAlt: '',
  collapseLabel: 'Collapse sidebar',
  expandLabel: 'Expand sidebar',
  separator: true,
  breakpoint: 700,
})

defineSlots<RobotbasSidebarSlots>()

const compact = defineModel<boolean>('compact', { default: false })

const logoSrc = computed(() => (compact.value ? props.compactLogo : props.logo))
const logoClass = computed(() => (compact.value ? props.ui?.compactLogo : props.ui?.logo))

const toggleIconClass = computed(() =>
  compact.value ? (props.compactToggleIcon ?? props.toggleIcon) : props.toggleIcon,
)

const toggleLabel = computed(() => (compact.value ? props.expandLabel : props.collapseLabel))

function toggle() {
  compact.value = !compact.value
}

// Both apps carried their own resize listener for the same 700px threshold; one
// of them only reacted to resizes, so a narrow window at load kept the rail
// expanded. Applying it on mount too fixes that without changing any layout.
function applyBreakpoint() {
  if (props.breakpoint === false) return
  compact.value = window.innerWidth < props.breakpoint
}

onMounted(() => {
  if (props.breakpoint === false) return
  applyBreakpoint()
  window.addEventListener('resize', applyBreakpoint)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', applyBreakpoint)
})
</script>

<template>
  <div class="sidebar-nav-robot px-0" :class="[{ compact }, ui?.root]">
    <div
      class="d-flex flex-column align-items-center align-items-sm-start"
      :class="ui?.body ?? 'flex-grow-1'"
    >
      <div class="sidebar-header" :class="ui?.header">
        <slot name="logo" :compact="compact">
          <img
            v-if="logoSrc"
            :src="logoSrc"
            :class="logoClass"
            :alt="logoAlt"
          >
        </slot>

        <slot name="toggle" :compact="compact" :toggle="toggle">
          <i
            v-if="toggleIconClass"
            class="sidebar-icon-compact"
            :class="[toggleIconClass, ui?.toggle]"
            role="button"
            :aria-label="toggleLabel"
            @click="toggle"
          />
          <button
            v-else
            type="button"
            class="sidebar-icon-compact sidebar-toggle-caret"
            :class="[ui?.toggle, { 'is-compact': compact }]"
            :aria-label="toggleLabel"
            @click="toggle"
          />
        </slot>
      </div>

      <div
        id="menu"
        class="nav flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start mx-auto"
        :class="ui?.menu"
      >
        <slot :compact="compact" />
      </div>

      <hr v-if="separator" :class="ui?.separator">

      <div :class="ui?.footer">
        <slot name="footer" :compact="compact" />
      </div>
    </div>
  </div>
</template>

<!-- Unscoped on purpose: the compact rules reach into `SideBarLink` /
     `SideBarCheckbox`, which are rendered by the consumer through the slot. -->
<style lang="scss">
$sidebar-header-height: 37px;
$sidebar-header-margin-bottom: 28px;

.sidebar-nav-robot {
  background: var(--white, #ffffff);
  width: 210px !important;
}

.sidebar-header {
  background: $gray-900;
  height: $sidebar-header-height;
  margin-bottom: $sidebar-header-margin-bottom;
  align-self: stretch;
  display: flex;
  padding: 0px 8px 0px 26px;
  justify-content: space-between;
  align-items: center;
}

.sidebar-icon-compact {
  color: $white;
  font-size: 23px;
  cursor: pointer;
}

#menu {
  gap: 4px;
}

/* Fallback control: two chevrons built out of borders, no icon font. */
.sidebar-toggle-caret {
  background: none;
  border: none;
  padding: 0;
  appearance: none;
  width: 23px;
  height: 23px;
  position: relative;
  display: inline-flex;
}

.sidebar-toggle-caret::before,
.sidebar-toggle-caret::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 7px;
  height: 7px;
  border-left: 1.5px solid currentcolor;
  border-bottom: 1.5px solid currentcolor;
  transform: translateY(-50%) rotate(45deg);
}

.sidebar-toggle-caret::before {
  left: 3px;
}

.sidebar-toggle-caret::after {
  left: 9px;
}

.sidebar-toggle-caret.is-compact::before,
.sidebar-toggle-caret.is-compact::after {
  transform: translateY(-50%) rotate(-135deg);
}

/* COMPACT SIDEBAR */
.sidebar-nav-robot.compact {
  width: 82px !important;
}

.sidebar-nav-robot.compact .sidebar-header {
  width: 82px;
}

.sidebar-nav-robot.compact .sidebar-checkbox {
  display: none;
}

.sidebar-nav-robot.compact .sidebarlink {
  width: auto;
}

.sidebar-nav-robot.compact .sidebarlink .text {
  display: none;
}

.sidebar-nav-robot.compact .sidebarlink .sidebarlink-trailing {
  display: none;
}
</style>
