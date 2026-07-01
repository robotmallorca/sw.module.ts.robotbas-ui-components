<script lang="ts">
import type { CollapsibleRootProps, CollapsibleRootEmits } from 'reka-ui'
import type { VNode } from 'vue'

export interface RobotbasCollapsibleUI {
  root?: string
  content?: string
}

export interface RobotbasCollapsibleProps extends Pick<CollapsibleRootProps, 'defaultOpen' | 'open' | 'disabled' | 'unmountOnHide'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: RobotbasCollapsibleUI
}

export interface RobotbasCollapsibleEmits extends CollapsibleRootEmits { }

export interface RobotbasCollapsibleSlots {
  default?(props: { open: boolean }): VNode[]
  content?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { createUiFn } from '../types'

const props = withDefaults(defineProps<RobotbasCollapsibleProps>(), {
  as: 'div',
  class: '',
  ui: () => ({}),
  unmountOnHide: true
})
const emits = defineEmits<RobotbasCollapsibleEmits>()
const slots = defineSlots<RobotbasCollapsibleSlots>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultOpen', 'open', 'disabled', 'unmountOnHide'), emits)

const ui = computed(() => ({
  root: createUiFn(props.ui?.root || 'collapsible'),
  content: createUiFn(props.ui?.content || 'collapsible-content'),
}))
</script>

<template>
  <CollapsibleRoot v-slot="{ open }" v-bind="rootProps" data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })">
    <CollapsibleTrigger v-if="!!slots.default" as-child>
      <slot :open="open" />
    </CollapsibleTrigger>

    <CollapsibleContent data-slot="content" :class="ui.content({ class: props.ui?.content })">
      <slot name="content" />
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
