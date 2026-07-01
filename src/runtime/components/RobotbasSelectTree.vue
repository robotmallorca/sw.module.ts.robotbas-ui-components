<script lang="ts">
import type { SelectRootProps, SelectContentProps, SelectArrowProps } from 'reka-ui'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { ButtonHTMLAttributes } from '../types/html'
import type { GetItemKeys, GetItemValue, GetModelValue, GetModelValueEmits } from '../types/utils'
import type { IconProps } from './RobotbasIcon.vue'
import type { TreeItem } from './RobotbasTree.vue'
import type { ModelModifiers } from '../types/input'
import { createUiFn } from '../types'

export interface SelectTreeUI {
  base: string
  trigger: string
  value: string
  placeholder: string
  trailing: string
  trailingIcon: string
  content: string
  viewport: string
  group: string
  arrow: string
  empty: string
  item: string
  itemIcon: string
  itemLabel: string
  itemIndent: string
}

export interface SelectTreeProps<VK extends GetItemKeys<TreeItem> | undefined = undefined> extends Pick<SelectRootProps, 'open' | 'defaultOpen' | 'disabled' | 'name' | 'multiple'>, UseComponentIconsProps, /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'type' | 'disabled' | 'name'> {
  id?: string
  /** The placeholder text when no value is selected. */
  placeholder?: string
  /**
   * @defaultValue 'primary'
   */
  color?: any
  /**
   * @defaultValue 'outline'
   */
  variant?: any
  /**
   * @defaultValue 'md'
   */
  size?: any
  required?: boolean
  /**
   * The icon displayed to open the menu.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: IconProps['name']
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  selectedIcon?: IconProps['name']
  /**
   * The content of the menu.
   * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }
   */
  content?: Omit<SelectContentProps, 'as' | 'asChild' | 'forceMount'>
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   */
  arrow?: boolean | Omit<SelectArrowProps, 'as' | 'asChild'>
  /**
   * Render the menu in a portal.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /**
   * Tree items to display
   */
  items: TreeItem[]
  /** The value of the SelectTree when initially rendered. */
  defaultValue?: GetModelValue<TreeItem, VK, false>
  /** The controlled value of the SelectTree. Can be binded-with with `v-model`. */
  modelValue?: GetModelValue<TreeItem, VK, false>
  modelModifiers?: Omit<ModelModifiers<GetModelValue<TreeItem, VK, false>>, 'lazy'>
  /**
   * When `items` is an array of objects, select the field to use as the value instead of the object itself.
   * @defaultValue undefined
   */
  valueKey?: VK
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'title'
   */
  labelKey?: GetItemKeys<TreeItem>
  /**
   * Whether to allow selection of non-leaf nodes (nodes with children).
   * @defaultValue false
   */
  allowParentSelection?: boolean
  /**
   * Whether to show icons for items
   * @defaultValue true
   */
  showIcons?: boolean
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  class?: any
  ui?: SelectTreeUI
}

export type SelectTreeEmits<VK extends GetItemKeys<TreeItem> | undefined> = {
  'update:open': [open: boolean]
  change: [event: Event]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
} & GetModelValueEmits<TreeItem, VK, false>

interface FlattenedTreeItem<VK extends GetItemKeys<TreeItem> | undefined = undefined> {
  item: TreeItem
  level: number
  path: string[]
  value: GetItemValue<TreeItem, VK>
  label: string
  isLeaf: boolean
}
</script>

<script setup lang="ts" generic="VK extends GetItemKeys<TreeItem> | undefined = undefined">
import { computed, onMounted, toRef, toRaw, useTemplateRef } from 'vue'
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectViewport,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectArrow,
  SelectPortal,
  useForwardPropsEmits,
} from 'reka-ui'
import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { usePortal } from '../composables/usePortal'
import { get, looseToNumber } from '../utils'
import RobotbasIcon from './RobotbasIcon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SelectTreeProps<VK>>(), {
  portal: true,
  labelKey: 'title',
  autofocusDelay: 0,
  allowParentSelection: false,
  showIcons: true,
  arrow: false,
})
const emits = defineEmits<SelectTreeEmits<VK>>()
defineSlots<{
  'default'(props: { modelValue?: GetModelValue<TreeItem, VK, false>, open: boolean, ui: SelectTreeUI }): any
  'item'(props: { item: TreeItem, level: number, isLeaf: boolean }): any
  'item-icon'(props: { item: TreeItem, level: number, isLeaf: boolean, hasChildren: boolean }): any
  'item-label'(props: { item: TreeItem, level: number }): any
  empty(): any
}>()

const rootProps = useForwardPropsEmits(
  reactivePick(props, 'modelValue', 'defaultValue', 'open', 'defaultOpen', 'required', 'multiple'),
  emits
)
const portalProps = usePortal(toRef(() => props.portal))
const contentProps = toRef(() =>
  defu(props.content, {
    side: 'bottom',
    sideOffset: 8,
    collisionPadding: 8,
    position: 'popper',
    align: 'start',
  }) as SelectContentProps
)
const arrowProps = toRef(() => props.arrow as SelectArrowProps)

const { emitFormBlur, emitFormFocus, emitFormInput, emitFormChange, id, name, disabled, ariaAttrs } = useFormField<SelectTreeProps<VK>>(props)
const { isTrailing, trailingIconName } = useComponentIcons(toRef(() => defu(props)))

const ui = computed(() => {
  return {
    base: createUiFn(props.ui?.base || 'form-select'),
    trigger: createUiFn(props.ui?.trigger || 'd-flex align-items-center justify-content-between'),
    value: createUiFn(props.ui?.value || ''),
    placeholder: createUiFn(props.ui?.placeholder || 'text-muted'),
    trailing: createUiFn(props.ui?.trailing || ''),
    trailingIcon: createUiFn(props.ui?.trailingIcon || ''),
    content: createUiFn(props.ui?.content || 'dropdown-menu robotbas-select-tree-content show'),
    viewport: createUiFn(props.ui?.viewport || 'p-1'),
    group: createUiFn(props.ui?.group || ''),
    arrow: createUiFn(props.ui?.arrow || ''),
    empty: createUiFn(props.ui?.empty || 'dropdown-item-text text-muted'),
    item: createUiFn(props.ui?.item || 'dropdown-item d-flex align-items-center'),
    itemIcon: createUiFn(props.ui?.itemIcon || 'me-2'),
    itemLabel: createUiFn(props.ui?.itemLabel || ''),
    itemIndent: createUiFn(props.ui?.itemIndent || ''),
  }
})

/**
 * Recursively flatten tree items into a flat array with level information
 */
function flattenTreeItems(
  items: TreeItem[],
  level: number = 0,
  path: string[] = []
): FlattenedTreeItem<VK>[] {
  const result: FlattenedTreeItem<VK>[] = []

  for (const item of items) {
    const currentPath = [...path, item.title]
    const hasChildren = item.children && item.children.length > 0
    const isLeaf = !hasChildren

    // Only include leaf nodes (or all nodes if allowParentSelection is true)
    // if (isLeaf || props.allowParentSelection) {
    const value = (props.valueKey ? get(item, props.valueKey as string) : item) as GetItemValue<TreeItem, VK>
    const label = get(item, props.labelKey as string) || item.title

    result.push({
      item,
      level,
      path: currentPath,
      value: value as GetItemValue<TreeItem, VK>,
      label: String(label),
      isLeaf,
    })
    // }

    // Recursively process children
    if (hasChildren) {
      result.push(...flattenTreeItems(item.children!, level + 1, currentPath))
    }
  }

  return result
}

const flattenedItems = computed(() => {
  const ret = flattenTreeItems(props.items)
  console.log(ret)
  return ret
})

const triggerRef = useTemplateRef('triggerRef')

function autoFocus() {
  if (props.autofocus) {
    ; (triggerRef.value as { $el?: HTMLButtonElement })?.$el?.focus({
      focusVisible: true,
    } as FocusOptions)
  }
}

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

function onUpdate(value: any) {
  if (toRaw(props.modelValue) === value) {
    return
  }

  if (props.modelModifiers?.trim) {
    value = value?.trim() ?? null
  }

  if (props.modelModifiers?.number) {
    value = looseToNumber(value)
  }

  if (props.modelModifiers?.nullable) {
    value ??= null
  }

  if (props.modelModifiers?.optional) {
    value ??= undefined
  }

  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}

function onUpdateOpen(value: boolean) {
  if (!value) {
    const event = new FocusEvent('blur')
    emits('blur', event)
    emitFormBlur()
  } else {
    const event = new FocusEvent('focus')
    emits('focus', event)
    emitFormFocus()
  }
}

defineExpose({
  triggerRef: toRef(() => (triggerRef.value as { $el?: HTMLButtonElement })?.$el as HTMLButtonElement),
})
</script>

<template>
  <SelectRoot :id="id" v-slot="{ modelValue: selectedValue, open }" v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    :name="name" :disabled="disabled" @update:model-value="onUpdate" @update:open="onUpdateOpen">
    <SelectTrigger ref="triggerRef" data-slot="base" :class="ui.base({ class: [props.ui?.base, props.class] })"
      tabindex="0">
      <span :class="ui.trigger({ class: props.ui?.trigger })">
        <slot :model-value="(selectedValue as GetModelValue<TreeItem, VK, false>)" :open="open" :ui="ui">
          <SelectValue :class="ui.value({ class: props.ui?.value })" :placeholder="placeholder ?? '&nbsp;'" />
        </slot>
      </span>

      <span v-if="isTrailing" data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
        <RobotbasIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon"
          :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
      </span>
    </SelectTrigger>

    <SelectPortal v-bind="portalProps">
      <SelectContent data-slot="content" :class="ui.content({ class: props.ui?.content })" v-bind="contentProps">
        <SelectViewport data-slot="viewport" :class="ui.viewport({ class: props.ui?.viewport })">
          <template v-if="flattenedItems.length > 0">
            <SelectGroup data-slot="group" :class="ui.group({ class: props.ui?.group })">
              <SelectItem v-for="(flattenedItem, index) in flattenedItems" :key="`tree-item-${index}`"
                :value="flattenedItem.value" :class="ui.item({ class: props.ui?.item })"
                :style="{ 'padding-left': `${1 + flattenedItem.level * 1.5}rem` }">
                <slot name="item" :item="flattenedItem.item" :level="flattenedItem.level"
                  :is-leaf="flattenedItem.isLeaf">
                  <slot name="item-icon" :item="flattenedItem.item" :level="flattenedItem.level"
                    :is-leaf="flattenedItem.isLeaf" :has-children="!flattenedItem.isLeaf">
                    <RobotbasIcon v-if="showIcons && flattenedItem.item.icon" :name="flattenedItem.item.icon"
                      data-slot="itemIcon" :class="ui.itemIcon({ class: props.ui?.itemIcon })"
                      style="width: 1rem; height: 1rem;" />
                  </slot>

                  <SelectItemText :class="ui.itemLabel({ class: props.ui?.itemLabel })">
                    <slot name="item-label" :item="flattenedItem.item" :level="flattenedItem.level">
                      {{ flattenedItem.label }}
                    </slot>
                  </SelectItemText>

                  <SelectItemIndicator class="ms-auto me-2">
                    <RobotbasIcon v-if="selectedIcon" :name="selectedIcon"
                      :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
                  </SelectItemIndicator>
                </slot>
              </SelectItem>
            </SelectGroup>
          </template>

          <template v-else>
            <div data-slot="empty" :class="ui.empty({ class: props.ui?.empty })">
              <slot name="empty">No items available</slot>
            </div>
          </template>
        </SelectViewport>

        <SelectArrow v-if="!!arrow" v-bind="arrowProps" data-slot="arrow"
          :class="ui.arrow({ class: props.ui?.arrow })" />
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style scoped>
.robotbas-select-tree-content {
  max-height: 200px;
  overflow-y: auto;
  position: relative;
  padding: 0.25rem;
}

.dropdown-item[data-disabled] {
  color: var(--bs-secondary-color, #6c757d);
  pointer-events: none;
  opacity: 0.65;
}

.dropdown-item[data-highlighted] {
  background-color: var(--bs-primary, #0d6efd);
  color: var(--bs-white, #fff);
}

.dropdown-item[data-highlighted] .SelectItemIndicator {
  color: var(--bs-white, #fff);
}

.SelectItemIndicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
}

.dropdown-item[data-state="checked"] .SelectItemIndicator {
  opacity: 1;
}
</style>
