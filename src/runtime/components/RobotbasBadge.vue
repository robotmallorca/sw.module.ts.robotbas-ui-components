<script lang="ts">
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { RobotbasAvatarProps } from './RobotbasAvatar.vue'

export interface RobotbasBadgeUI {
  base?: string
  leadingIcon?: string
  leadingAvatar?: string
  leadingAvatarSize?: string
  label?: string
  trailingIcon?: string
}

export interface RobotbasBadgeProps extends Omit<UseComponentIconsProps, 'loading' | 'loadingIcon'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'span'
   */
  as?: any
  label?: string | number
  /**
   * Optional color variant (for custom styling via ui).
   */
  color?: string
  colorHex?: string,
  backgroundColorHex?: string,

  /**
   * Optional variant (for custom styling via ui).
   */
  variant?: string
  /**
   * Optional size class or variant (e.g. trailing badge size in buttons).
   */
  size?: string
  /** Render the badge with equal padding on all sides. */
  square?: boolean
  class?: any
  ui?: RobotbasBadgeUI
}

export interface RobotbasBadgeSlots {
  leading?(props?: {}): any
  default?(props?: {}): any
  trailing?(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { createUiFn } from '../types'
import { useComponentIcons } from '../composables/useComponentIcons'
import RobotbasIcon from './RobotbasIcon.vue'
import RobotbasAvatar from './RobotbasAvatar.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<RobotbasBadgeProps>(), {
  as: 'span',
  ui: () => ({}),
})
defineSlots<RobotbasBadgeSlots>()

const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const ui = computed(() => ({
  base: createUiFn(props.ui?.base || 'robotbas-badge badge'),
  leadingIcon: createUiFn(props.ui?.leadingIcon || ''),
  leadingAvatar: createUiFn(props.ui?.leadingAvatar || ''),
  label: createUiFn(props.ui?.label || ''),
  trailingIcon: createUiFn(props.ui?.trailingIcon || ''),
}))

const baseClass = computed(() =>
  ui.value.base({ class: [props.size, props.class] })
)
</script>

<template>
  <Primitive :as="as" role="contentinfo" data-slot="base" :class="baseClass"
    :style="{ color: colorHex, background: backgroundColorHex }">
    <slot name="leading" :ui="ui">
      <RobotbasIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon"
        :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
      <RobotbasAvatar v-else-if="!!avatar" :size="(props.ui?.leadingAvatarSize || 'xs')" v-bind="avatar"
        data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
    </slot>

    <slot :ui="ui">
      <span v-if="label !== undefined && label !== null" data-slot="label"
        :class="ui.label({ class: props.ui?.label })">
        {{ label }}
      </span>
    </slot>

    <slot name="trailing" :ui="ui">
      <RobotbasIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" data-slot="trailingIcon"
        :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
    </slot>
  </Primitive>
</template>

<style scoped lang="scss">
.robotbas-badge {
  color: $white;
  background: $primary-500;
  text-align: center;
}

.robotbas.active .robotbas-badge {
  color: $primary-700;
  background: $primary-100;
}

.robotbas:hover .robotbas-badge {
  color: $primary-700;
  background: $primary-200;
}
</style>
