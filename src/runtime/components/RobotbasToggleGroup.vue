<script lang="ts">
import type { RobotbasUiOrientation } from '../types/theme'

export interface ToggleGroupUI {
  root?: string,
}

export interface ToggleGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'md'
   */
  size?: 'sm' | 'md'
  /**
   * The orientation the buttons are laid out.
   * @defaultValue 'horizontal'
   */
  orientation?: RobotbasUiOrientation
  variant?: 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark'
  class?: any
  ui?: ToggleGroupUI
  // items: ToggleGroupItemProps[]
}

export interface ToggleGroupSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { provide, computed } from 'vue'
import { ToggleGroupRoot, type AcceptableValue } from 'reka-ui'
import { fieldGroupInjectionKey } from '../composables/useFieldGroup'


const props = withDefaults(defineProps<ToggleGroupProps>(), {
  orientation: 'horizontal'
})
defineSlots<ToggleGroupSlots>()

const model = defineModel<AcceptableValue | AcceptableValue[]>('modelValue')

provide(fieldGroupInjectionKey, computed(() => ({
  orientation: props.orientation,
  size: props.size
})))

const ui = computed(() => {
  return {
    ...props.ui,
    root: props.ui?.root || 'btn-group'
  }
})
</script>

<template>
  <ToggleGroupRoot v-model="model" :class="ui?.root" :as="as" :orientation="orientation">
    <slot>

    </slot>
  </ToggleGroupRoot>
</template>
