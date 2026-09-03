<script lang="ts">
interface SideBarItemProps {
  label: string;
  link?: RouteLocationRaw;
  linkRegex?: RegExp;
  leadingIcon?: string;
  trailingIcon?: string;
  /**
   * Display a badge on the item.
   * `{ size: 'sm', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
   */
  badge?: string | number | RobotbasBadgeProps;
  /**
   * Nesting level inside a dropdown. Levels > 0 are indented and draw a
   * vertical rail on their left that visually groups the siblings together.
   * Shares its scale with `SideBarCheckbox` (16 / 32 / 48 px).
   */
  submenu?: 0 | 1 | 2;
  /**
   * Marks the item as a dropdown header: adds the chevron (which rotates
   * according to `open`) and exposes `aria-expanded` / `data-state`. Without a
   * `link` the root element becomes a `<button>` instead of a link.
   *
   * The default chevron is drawn in CSS so that it depends on no icon pack;
   * `trailingIcon` replaces it with whichever icon you pass.
   */
  expandable?: boolean;
  /** Dropdown state. Drives the chevron rotation. */
  open?: boolean;
  /**
   * Highlights the header while it is collapsed and one of its children is the
   * active route, so you don't lose track of where you are.
   */
  childActive?: boolean;
  ui?: {
    root?: string;
    content?: string;
    leadingIcon?: string;
    label?: string;
    trailingBadge?: string;
    trailingBadgeSize?: string;
    trailingIcon?: string;
  };
}
</script>

<script setup lang="ts">
import { computed, resolveComponent } from "vue";
import { useRoute } from "#imports";
import type { RouteLocationRaw } from "#vue-router";
import type { RobotbasBadgeProps } from "./RobotbasBadge.vue";

const props = defineProps<SideBarItemProps>();
const emit = defineEmits(["toggle-click"]);

const route = useRoute();

const NuxtLink = resolveComponent("NuxtLink");

// A dropdown header with no route of its own is not a link: it is a button
// that opens and closes. When it does have a `link` it keeps navigating and
// only the chevron acts as the trigger.
const isTrigger = computed(() => props.expandable && !props.link);
const rootTag = computed(() => (isTrigger.value ? "button" : NuxtLink));

const selected = computed(() => {
  if (props.linkRegex) {
    return props.linkRegex.test(route.path);
  } else {
    return route.path == props.link;
  }
});

const variableClass = computed(() => {
  return `${selected.value ? "active" : ""}`;
});

const submenuClass = computed(() => (props.submenu ? `submenu-${props.submenu}` : ""));

const badgeUi = computed(() => {
  const base = props.ui?.trailingBadge ?? "robotbas-badge badge sidebarlink-badge";

  return typeof props.badge === "object" ? { ...props.badge.ui, base: props.badge.ui?.base ?? base } : { base };
});
const onToggleClick = () => {
  emit("toggle-click");
};
</script>

<template>
  <component
    :is="rootTag"
    v-bind="isTrigger ? { type: 'button' } : { to: link }"
    class="sidebarlink"
    :class="[variableClass, submenuClass, { 'is-group': expandable, 'child-active': childActive }]"
    :data-state="expandable ? (open ? 'open' : 'closed') : undefined"
    :aria-expanded="expandable ? open : undefined"
    @click="isTrigger ? onToggleClick() : undefined"
  >
    <div class="sidebarlink-content">
      <div class="sidebarlink-leading">
        <slot name="leading">
          <RobotbasIcon v-if="leadingIcon" :name="leadingIcon" :class="ui?.leadingIcon" />
        </slot>
      </div>

      <div class="text">{{ label }}</div>
    </div>

    <span class="sidebarlink-trailing">
      <slot name="trailing">
        <RobotbasBadge
          v-if="badge !== undefined"
          color="neutral"
          variant="outline"
          :size="ui?.trailingBadgeSize || props.ui?.trailingBadgeSize"
          v-bind="typeof badge === 'string' || typeof badge === 'number' ? { label: badge } : badge"
          :ui="badgeUi"
        />
        <RobotbasIcon
          v-if="trailingIcon"
          :name="trailingIcon"
          :class="ui?.trailingIcon"
          class="sidebarlink-toggle"
          @click.stop.prevent="onToggleClick"
        />
        <!-- Default chevron drawn in CSS. The module cannot assume any icon
             pack (Font Awesome is a devDependency, for the playground only),
             so bare `expandable` has to work with no dependencies.
             Passing `trailing-icon` replaces it. -->
        <span
          v-else-if="expandable"
          class="sidebarlink-toggle sidebarlink-caret"
          @click.stop.prevent="onToggleClick"
        />
      </slot>
    </span>
  </component>
</template>

<style scoped lang="scss">
.sidebarlink,
.sidebarlink * {
  box-sizing: border-box;
  text-decoration: none;
}

.sidebarlink {
  // background: $white;
  border-radius: 8px;
  padding: 8px 12px 8px 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 178px;
  overflow: hidden;

  color: $gray-700;
  font: var(--textmd-medium, 500 16px/24px "Roboto", sans-serif);
  position: relative;
}

/* The root can be a <button> when it is a dropdown header with no route, so
   the native styling has to be neutralised to keep it indistinguishable from
   the <a>. No `font` here on purpose: author styles already beat the UA
   stylesheet, and a `font: inherit` at (0,1,1) would override the `font` of
   `.sidebarlink` at (0,1,0). */
button.sidebarlink {
  background: none;
  border: none;
  text-align: left;
  appearance: none;
}

.sidebarlink-content {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

/* BADGE */

.sidebarlink-badge {
  color: $gray-700;
  background: $gray-100;
  text-align: center;
}

.sidebarlink.active .sidebarlink-badge {
  color: $primary-700;
  background: $primary-100;
}

.sidebarlink:hover .sidebarlink-badge {
  color: $primary-700;
  background: $primary-200;
}

/* BADGE */
.sidebarlink-trailing {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.sidebarlink-alert-dot {
  background: transparent !important;
  padding: 0 !important;
  min-width: auto !important;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.sidebarlink-leading {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  position: relative;
  overflow: hidden;
}

/* variant styles */
.sidebarlink.active {
  background: $primary-50;
  color: $primary-500;
}

.sidebarlink:hover {
  background: $primary-25;
  color: $primary-700;
  cursor: pointer;
}

.sidebarlink.active:hover {
  background: var(--primary-100, #ffd9e3);
  color: var(--primary-700, #8d004d);
}

/* ── DROPDOWNS ────────────────────────────────────────────────────────────── */

/* There is only ONE chevron: the state gives the direction, not the icon name. */
.sidebarlink-toggle {
  transition: transform 0.15s ease;
}

/* The `:not` keeps both rotations independent of rule order: the icon starts
   at 0deg and the CSS caret starts at 45deg. */
.sidebarlink[data-state="open"] .sidebarlink-toggle:not(.sidebarlink-caret) {
  transform: rotate(180deg);
}

.sidebarlink-caret {
  width: 7px;
  height: 7px;
  border-right: 1.5px solid currentcolor;
  border-bottom: 1.5px solid currentcolor;
  transform: rotate(45deg);
  margin: 0 5px 3px;
}

.sidebarlink[data-state="open"] .sidebarlink-caret {
  transform: rotate(225deg);
}

/* On a header the chevron is an affordance, not content: it sits one shade
   below the label so it does not compete with it. */
.sidebarlink.is-group .sidebarlink-toggle {
  color: $gray-600;
}

.sidebarlink.is-group:hover .sidebarlink-toggle,
.sidebarlink.is-group.active .sidebarlink-toggle {
  color: inherit;
}

/* Collapsed header with an active child: it hints at itself without stealing
   the emphasis from the child, which does get a background. */
.sidebarlink.child-active:not(.active) {
  color: $primary-700;
}

/* Indentation aligned with the SideBarCheckbox scale (16 / 32 / 48). */
.sidebarlink.submenu-1 {
  padding-left: 32px;
}

.sidebarlink.submenu-2 {
  padding-left: 48px;
}

/* The `overflow: hidden` on the base rule clips the pseudo-element at the box
   edge and would break the rail into segments, so nested levels release it and
   the label clipping moves down to the content. */
.sidebarlink.submenu-1,
.sidebarlink.submenu-2 {
  overflow: visible;
}

.sidebarlink.submenu-1 .sidebarlink-content,
.sidebarlink.submenu-2 .sidebarlink-content {
  overflow: hidden;
  min-width: 0;
}

/* Vertical rail that groups the siblings of a same level. It overflows by 2px
   at the top and bottom so that items stacked with a `gap` form a continuous
   line instead of loose segments. */
.sidebarlink.submenu-1::before,
.sidebarlink.submenu-2::before {
  content: "";
  position: absolute;
  top: -2px;
  bottom: -2px;
  width: 1px;
  background: $gray-300;
}

.sidebarlink.submenu-1::before {
  left: 19px;
}

.sidebarlink.submenu-2::before {
  left: 35px;
}

/* The active child tints its rail segment: it marks the position within the group. */
.sidebarlink.submenu-1.active::before,
.sidebarlink.submenu-2.active::before {
  background: $primary-500;
  width: 2px;
}

/* A child with neither icon nor slot would drag along 24px of empty box plus a
   12px gap and end up detached from the rail. */
.sidebarlink.submenu-1 .sidebarlink-leading:empty,
.sidebarlink.submenu-2 .sidebarlink-leading:empty {
  display: none;
}
</style>
