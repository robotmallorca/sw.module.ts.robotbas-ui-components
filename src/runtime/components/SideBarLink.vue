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
import type { RouteLocationRaw } from "#vue-router";
import type { RobotbasBadgeProps } from "./RobotbasBadge.vue";

const props = defineProps<SideBarItemProps>();
const emit = defineEmits(["toggle-click"]);

const route = useRoute();

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

const badgeUi = computed(() => {
  const base = props.ui?.trailingBadge ?? "robotbas-badge badge sidebarlink-badge";

  return typeof props.badge === "object" ? { ...props.badge.ui, base: props.badge.ui?.base ?? base } : { base };
});
const onToggleClick = () => {
  emit("toggle-click");
};
</script>

<template>
  <NuxtLink :to="link" class="sidebarlink" :class="variableClass">
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
          class=""
          @click="onToggleClick"
        />
      </slot>
    </span>
  </NuxtLink>
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
</style>
