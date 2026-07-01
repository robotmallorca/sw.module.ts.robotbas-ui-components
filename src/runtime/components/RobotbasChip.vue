<script lang="ts">
export interface RobotbasChipUI {
  root?: string
  base?: string
}

export interface RobotbasChipProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any

  /** Display some text inside the chip. */
  text?: string | number
  /**
   * @defaultValue 'primary'
   */
  color?: RobotbasColorTheme
  /**
   * @defaultValue 'md'
   */
  size?: any // Chip['variants']['size']
  /**
   * The position of the chip.
   * @defaultValue 'top-right'
   */
  position?: any // Chip['variants']['position']
  /** When `true`, keep the chip inside the component for rounded elements. */
  inset?: boolean
  /** When `true`, render the chip relatively to the parent. */
  standalone?: boolean
  class?: any
  ui?: RobotbasChipUI
}

export interface RobotbasChipEmits {
  'update:show': [value: boolean]
}

export interface RobotbasChipSlots {
  default(props?: {}): any
  content(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive, Slot } from 'reka-ui'
import { useAvatarGroup } from '../composables/useAvatarGroup'
import { createUiFn } from '../types'
import type { RobotbasColorTheme } from '../types/theme'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<RobotbasChipProps>(), {
  inset: false,
  standalone: false
})
defineSlots<RobotbasChipSlots>()

const show = defineModel<boolean>('show', { default: true })

const { size } = useAvatarGroup(props)

const ui = computed(() => {
  return {
    root: createUiFn(props.ui?.root || ''),
    base: createUiFn(props.ui?.base || ''),
    color: props.color,
    size: size.value,
    position: props.position,
    inset: props.inset,
    standalone: props.standalone
  }
})
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <Slot v-bind="$attrs">
      <slot />
    </Slot>

    <span role="contentinfo" v-if="show" data-slot="base" :class="ui.base({ class: props.ui?.base })">
      <slot name="content">
        {{ text }}
      </slot>
    </span>
  </Primitive>
</template>
