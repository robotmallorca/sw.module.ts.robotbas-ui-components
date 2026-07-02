<script lang="ts">
export interface RobotbasCardUI {
  root?: string
  header?: string
  body?: string
  footer?: string
}

export interface RobotbasCardProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: RobotbasCardUI
}

export interface RobotbasCardSlots {
  header(props?: {}): any
  default(props?: {}): any
  footer(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { createUiFn } from '../types'

const props = withDefaults(defineProps<RobotbasCardProps>(), {
  as: 'div',
})

const slots = defineSlots<RobotbasCardSlots>()

const isSelected = defineModel<boolean>('selected', { required: false });
const ui = computed(() => {
  return {
    root: createUiFn(props.ui?.root || 'card'),
    header: createUiFn(props.ui?.header || 'card-header'),
    body: createUiFn(props.ui?.body || 'card-body'),
    footer: createUiFn(props.ui?.footer || 'card-footer'),
  }
})
</script>

<template>
  <Primitive :as="as" data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] }) + (isSelected ? ' selected' : '')">
    <div v-if="!!slots.header" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" />
    </div>

    <div v-if="!!slots.default" data-slot="body" :class="ui.body({ class: props.ui?.body })">
      <slot />
    </div>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
