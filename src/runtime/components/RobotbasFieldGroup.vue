<script lang="ts">
import type { RobotbasUiOrientation } from '../types/theme'
// import theme from '#build/ui/field-group'

// type FieldGroup = ComponentConfig<typeof theme, AppConfig, 'fieldGroup'>

export interface RobotbasFieldGroupUI {
  root?: string,
}

export interface RobotbasFieldGroupProps {
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
  class?: any
  ui?: RobotbasFieldGroupUI
}

export interface RobotbasFieldGroupSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { provide, computed } from 'vue'
import { Primitive } from 'reka-ui'
import { fieldGroupInjectionKey } from '../composables/useFieldGroup'
// import { tv } from '../utils/tv'

const props = withDefaults(defineProps<RobotbasFieldGroupProps>(), {
  orientation: 'horizontal'
})
defineSlots<RobotbasFieldGroupSlots>()

// const appConfig = useAppConfig() as FieldGroup['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
// const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.fieldGroup || {}) }))

provide(fieldGroupInjectionKey, computed(() => ({
  orientation: props.orientation,
  size: props.size
})))
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" :class="[orientation, props.class]">
    <slot />
  </Primitive>
</template>
