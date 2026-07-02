<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AccordionRootProps, AccordionRootEmits } from 'reka-ui'
import type { DynamicSlots, GetItemKeys } from '../types/utils'

export interface RobotbasAccordionItem {
  label?: string
  /**
   * @IconifyIcon
   */
  icon?: string,
  /**
   * Display a badge on the item.
   * `{ size: 'sm', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
   */
  badge?: string | number | RobotbasBadgeProps
  /**
   * @IconifyIcon
   */
  trailingIcon?: string
  slot?: string
  content?: string
  /** A unique value for the accordion item. Defaults to the index. */
  value?: string
  disabled?: boolean
  class?: any
  ui?: RobotbasAccordionItemUI
  [key: string]: any
}

export interface RobotbasAccordionItemUI {
  item?: string
  header?: string
  trigger?: string
  leadingIcon?: string
  label?: string
  trailingIcon?: string
  content?: string
  body?: string
  badge?: string
}

export interface RobotbasAccordionUI {
  root?: string
  item?: string
  header?: string
  trigger?: string
  leadingIcon?: string
  label?: string
  trailingIcon?: string
  content?: string
  body?: string
}

export interface RobotbasAccordionProps<T extends RobotbasAccordionItem = RobotbasAccordionItem> extends Pick<AccordionRootProps, 'collapsible' | 'defaultValue' | 'modelValue' | 'type' | 'disabled' | 'unmountOnHide'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  items?: T[]
  /**
   * The icon displayed on the right side of the trigger.
   * @defaultValue 'lucide:chevron-down'
   * @IconifyIcon
   */
  trailingIcon?: string
  /**
   * The key used to get the value from the item.
   * @defaultValue 'value'
   */
  valueKey?: GetItemKeys<T>
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>
  class?: any
  ui?: RobotbasAccordionUI
}

export interface RobotbasAccordionEmits extends AccordionRootEmits { }

type SlotProps<T extends RobotbasAccordionItem> = (props: { item: T, index: number, open: boolean }) => any

export type RobotbasAccordionSlots<T extends RobotbasAccordionItem = RobotbasAccordionItem> = {
  leading: SlotProps<T>
  default(props: { item: T, index: number, open: boolean }): any
  trailing: SlotProps<T>
  content: SlotProps<T>
  body: SlotProps<T>
  label: SlotProps<T>
} & DynamicSlots<T, 'body' | 'label', { index: number, open: boolean }>

</script>

<script setup lang="ts" generic="T extends RobotbasAccordionItem">
import { computed } from 'vue'
import { AccordionRoot, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { createUiFn, type RobotbasBadgeProps } from '../types'
import { get } from '../utils'

const props = withDefaults(defineProps<RobotbasAccordionProps<T>>(), {
  type: 'single',
  collapsible: true,
  unmountOnHide: true,
  valueKey: 'value',
  labelKey: 'label',
  trailingIcon: 'lucide:chevron-down',
})
const emits = defineEmits<RobotbasAccordionEmits>()
const slots = defineSlots<RobotbasAccordionSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'collapsible', 'defaultValue', 'disabled', 'modelValue', 'unmountOnHide'), emits)

const ui = computed(() => ({
  root: createUiFn(props.ui?.root || 'accordion'),
  item: createUiFn(props.ui?.item || 'accordion-item'),
  header: createUiFn(props.ui?.header || 'accordion-header'),
  trigger: createUiFn(props.ui?.trigger || 'accordion-button'),
  leadingIcon: createUiFn(props.ui?.leadingIcon || ''),
  label: createUiFn(props.ui?.label || ''),
  trailingIcon: createUiFn(props.ui?.trailingIcon || ''),
  content: createUiFn(props.ui?.content || 'accordion-collapse'),
  body: createUiFn(props.ui?.body || 'accordion-body'),
}))
</script>

<template>
  <AccordionRoot v-bind="rootProps" :type="type" data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })">
    <AccordionItem v-for="(item, index) in props.items" v-slot="{ open }" :key="index"
      :value="get(item, props.valueKey as string) ?? String(index)" :disabled="item.disabled" data-slot="item"
      :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class] })">
      <AccordionHeader as="div" data-slot="header" :class="ui.header({ class: [props.ui?.header, item.ui?.header] })">
        <AccordionTrigger data-slot="trigger"
          :class="ui.trigger({ class: [props.ui?.trigger, item.ui?.trigger, item.disabled && 'disabled'] })">
          <slot name="leading" :item="item" :index="index" :open="open">
            <RobotbasBadge v-if="item.badge !== undefined" color="neutral" variant="outline"
              v-bind="(typeof item.badge === 'string' || typeof item.badge === 'number') ? { label: item.badge } : item.badge"
              :ui="{ base: item.ui?.badge }" />
            <RobotbasIcon v-if="item.icon" :name="item.icon" data-slot="leadingIcon"
              :class="ui.leadingIcon({ class: [props.ui?.leadingIcon, item?.ui?.leadingIcon] })" />
          </slot>

          <slot :name="((item.slot ? `${item.slot}-label` : 'label') as keyof RobotbasAccordionSlots<T>)"
            :item="(item as Extract<T, { slot: string }>)" :index="index" :open="open"></slot>
          <span v-if="get(item, props.labelKey as string) || !!slots.default" data-slot="label"
            :class="ui.label({ class: [props.ui?.label, item.ui?.label] })">
            <slot :item="item" :index="index" :open="open">{{ get(item, props.labelKey as string) }}</slot>
          </span>

          <slot name="trailing" :item="item" :index="index" :open="open">
            <RobotbasIcon :name="item.trailingIcon || props.trailingIcon" data-slot="trailingIcon"
              :class="ui.trailingIcon({ class: [props.ui?.trailingIcon, item.ui?.trailingIcon] })" />
          </slot>
        </AccordionTrigger>
      </AccordionHeader>

      <AccordionContent
        v-if="item.content || !!slots.content || (item.slot && !!slots[item.slot as keyof RobotbasAccordionSlots<T>]) || !!slots.body || (item.slot && !!slots[`${item.slot}-body` as keyof RobotbasAccordionSlots<T>])"
        data-slot="content" :class="ui.content({ class: [props.ui?.content, item.ui?.content] })">
        <slot :name="((item.slot || 'content') as keyof RobotbasAccordionSlots<T>)"
          :item="(item as Extract<T, { slot: string }>)" :index="index" :open="open">
          <div data-slot="body" :class="ui.body({ class: [props.ui?.body, item.ui?.body] })">
            <slot :name="((item.slot ? `${item.slot}-body` : 'body') as keyof RobotbasAccordionSlots<T>)"
              :item="(item as Extract<T, { slot: string }>)" :index="index" :open="open">
              {{ item.content }}
            </slot>
          </div>
        </slot>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
