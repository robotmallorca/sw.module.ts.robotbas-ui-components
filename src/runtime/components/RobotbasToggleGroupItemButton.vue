<script setup lang="ts">
import { ToggleGroupItem } from 'reka-ui';
import type { RobotbasButtonProps } from './RobotbasButton.vue';

const props = withDefaults(defineProps<RobotbasButtonProps & { value: string }>(), {
  variant: 'normal',
  color: 'primary'
});

const ui = computed(() => {
  return {
    ...props.ui,
    trailingBadge: props.ui?.trailingBadge || 'badge text-bg-secondary text-white'
  }
})
</script>


<template>
  <ToggleGroupItem v-bind="props" :class="ui?.root">
    <RobotbasIcon v-if="leadingIcon" :name="leadingIcon" :class="ui?.leadingIcon" class="me-1" />
    <slot>{{ label }}</slot>
    <slot name="trailing">
      <RobotbasBadge v-if="badge !== undefined && badge !== 0" color="neutral" variant="outline"
        :size="(ui?.trailingBadgeSize || props.ui?.trailingBadgeSize)"
        v-bind="(typeof badge === 'string' || typeof badge === 'number') ? { label: badge } : badge"
        :ui="{ base: ui?.trailingBadge }" />
    </slot>
  </ToggleGroupItem>
</template>
