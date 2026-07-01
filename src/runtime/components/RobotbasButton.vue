<script lang="ts">
import type { RobotbasColorTheme } from '../types/theme';
import type { RobotbasBadgeProps } from './RobotbasBadge.vue';

export interface RobotbasButtonUI {
  root?: string
  leadingIcon?: string
  label?: string
  trailingBadge?: string
  trailingBadgeSize?: string
  trailingIcon?: string
}

export interface RobotbasButtonProps {
  label: string;
  leadingIcon?: string;
  trailingIcon?: string;
  variant?: 'normal' | 'outline-slim'
  color?: RobotbasColorTheme
  /**
   * Display a badge on the item.
   * `{ size: 'sm', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
   */
  badge?: string | number | RobotbasBadgeProps;
  ui?: RobotbasButtonUI
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<RobotbasButtonProps>(), {
  variant: 'normal',
  color: 'primary',
  ui: () => ({
    root: 'robotbas-button',
    leadingIcon: 'robotbas-button-leading-icon',
    label: 'robotbas-button-label',
    trailingBadge: 'robotbas-button-trailing-badge',
    trailingBadgeSize: 'robotbas-button-trailing-badge-size',
    trailingIcon: 'robotbas-button-trailing-icon'
  })
});

const ui = computed(() => {
  return {
    ...props.ui,
    trailingBadge: props.ui?.trailingBadge || 'badge text-bg-secondary text-white'
  }
})
</script>

<template>
  <button :class="ui?.root">
    <RobotbasIcon v-if="leadingIcon" :name="leadingIcon" :class="ui?.leadingIcon" class="me-1" />
    <slot>{{ label }}</slot>
    <slot name="trailing">
      <RobotbasBadge v-if="badge !== undefined && badge !== 0" color="neutral" variant="outline"
        :size="(ui?.trailingBadgeSize || props.ui?.trailingBadgeSize)"
        v-bind="(typeof badge === 'string' || typeof badge === 'number') ? { label: badge } : badge"
        :ui="{ base: ui?.trailingBadge }" />
    </slot>
  </button>
</template>

<style scoped lang="scss"></style>
