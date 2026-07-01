<script lang="ts">
import type { ComboboxRootProps, ComboboxRootEmits, ComboboxContentProps, ComboboxContentEmits, ComboboxArrowProps } from 'reka-ui'

import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { ButtonHTMLAttributes } from '../types/html'
import type { AcceptableValue, ArrayOrNested, GetItemKeys, GetItemValue, GetModelValue, GetModelValueEmits, NestedItem, EmitsToProps } from '../types/utils'
import type { IconProps } from './RobotbasIcon.vue'
import type { RobotbasAvatarProps } from './RobotbasAvatar.vue'
import type { RobotbasChipProps } from './RobotbasChip.vue'
import type { RobotbasInputProps } from './RobotbasInput.vue'
import type { ModelModifiers } from '../types/input'
import { createUiFn } from '../types'


export type RobotbasComboboxValue = AcceptableValue

interface RobotbasComboboxUI {
  base: string
  content: string
  value: string
  placeholder: string
  focusScope: string
  viewport: string
  group: string
  arrow: string
  input: string
  leading: string
  leadingIcon: string
  trailing: string
  trailingIcon: string
  empty: string
  contentTop: string
  contentBottom: string
  createItemLabel: string
  label: string
  separator: string
  item: string
  itemLeadingIcon: string
  itemLeadingAvatarSize: string
  itemLeadingAvatar: string
  itemLeadingChipSize: string
  itemLeadingChip: string
  itemWrapper: string
  itemLabel: string
  itemDescription: string
  itemTrailing: string
  itemTrailingIcon: string
}

export type RobotbasComboboxItem = RobotbasComboboxValue | {
  label?: string
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  avatar?: RobotbasAvatarProps
  chip?: RobotbasChipProps
  /**
   * The item type.
   * @defaultValue 'item'
   */
  type?: 'label' | 'separator' | 'item'
  disabled?: boolean
  onSelect?: (e: Event) => void
  class?: any
  ui?: any // Pick<RobotbasCombobox['slots'], 'label' | 'separator' | 'item' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLeadingChipSize' | 'itemLeadingChip' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemTrailing' | 'itemTrailingIcon'>
  [key: string]: any
}

export interface RobotbasComboboxProps<
  T extends ArrayOrNested<RobotbasComboboxItem> = ArrayOrNested<RobotbasComboboxItem>,
  VK extends GetItemKeys<T> | undefined = undefined,
  M extends boolean = false
> extends Pick<ComboboxRootProps<T>, 'open' | 'defaultOpen' | 'disabled' | 'name' | 'resetSearchTermOnBlur' | 'resetSearchTermOnSelect' | 'highlightOnHover'>, UseComponentIconsProps, /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'type' | 'disabled' | 'name'> {
  id?: string
  /** The placeholder text when the select is empty. */
  placeholder?: string
  /**
   * Whether to display the search input or not.
   * Can be an object to pass additional props to the input.
   * `{ placeholder: 'Search...', variant: 'none' }`{lang="ts-type"}
   * @defaultValue true
   */
  searchInput?: boolean | RobotbasInputProps
  /**
   * @defaultValue 'primary'
   */
  color?: any // RobotbasCombobox['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: any // RobotbasCombobox['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: any // RobotbasCombobox['variants']['size']
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
  content?: Omit<ComboboxContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ComboboxContentEmits>>
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   * @IconifyIcon
   */
  arrow?: boolean | Omit<ComboboxArrowProps, 'as' | 'asChild'>
  /**
   * Render the menu in a portal.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /**
   * Enable virtualization for large lists.
   * Note: when enabled, all groups are flattened into a single list due to a limitation of Reka UI (https://github.com/unovue/reka-ui/issues/1885).
   * @defaultValue false
   */
  virtualize?: boolean | {
    /**
     * Number of items rendered outside the visible area
     * @defaultValue 12
     */
    overscan?: number
    /**
     * Estimated size (in px) of each item
     * @defaultValue 32
     */
    estimateSize?: number
  }
  /**
   * When `items` is an array of objects, select the field to use as the value instead of the object itself.
   * @defaultValue undefined
   */
  valueKey?: VK
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>
  /**
   * When `items` is an array of objects, select the field to use as the description.
   * @defaultValue 'description'
   */
  descriptionKey?: GetItemKeys<T>
  items?: T
  /** The value of the RobotbasCombobox when initially rendered. Use when you do not need to control the state of the RobotbasCombobox. */
  defaultValue?: GetModelValue<T, VK, M>
  /** The controlled value of the RobotbasCombobox. Can be binded-with with `v-model`. */
  modelValue?: GetModelValue<T, VK, M>
  modelModifiers?: Omit<ModelModifiers<GetModelValue<T, VK, M>>, 'lazy'>
  /** Whether multiple options can be selected or not. */
  multiple?: M & boolean
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  /**
   * Determines if custom user input that does not exist in options can be added.
   * @defaultValue false
   */
  createItem?: boolean | 'always' | { position?: 'top' | 'bottom', when?: 'empty' | 'always' }
  /**
   * Fields to filter items by.
   * @defaultValue [labelKey]
   */
  filterFields?: string[]
  /**
   * When `true`, disable the default filters, useful for custom filtering (useAsyncData, useFetch, etc.).
   * @defaultValue false
   */
  ignoreFilter?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  class?: any
  ui?: RobotbasComboboxUI // RobotbasCombobox['slots']
}

export type RobotbasComboboxEmits<A extends ArrayOrNested<RobotbasComboboxItem>, VK extends GetItemKeys<A> | undefined, M extends boolean> = Pick<ComboboxRootEmits, 'update:open'> & {
  change: [event: Event]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  create: [item: string]
  /** Event handler when highlighted element changes. */
  highlight: [payload: {
    ref: HTMLElement
    value: GetModelValue<A, VK, M>
  } | undefined]
} & GetModelValueEmits<A, VK, M>

type SlotProps<T extends RobotbasComboboxItem> = (props: { item: T, index: number, ui: RobotbasComboboxUI }) => any

export interface RobotbasComboboxSlots<
  A extends ArrayOrNested<RobotbasComboboxItem> = ArrayOrNested<RobotbasComboboxItem>,
  VK extends GetItemKeys<A> | undefined = undefined,
  M extends boolean = false,
  T extends NestedItem<A> = NestedItem<A>
> {
  'leading'(props: { modelValue?: GetModelValue<A, VK, M>, open: boolean, ui: RobotbasComboboxUI }): any
  'default'(props: { modelValue?: GetModelValue<A, VK, M>, open: boolean, ui: RobotbasComboboxUI }): any
  'trailing'(props: { modelValue?: GetModelValue<A, VK, M>, open: boolean, ui: RobotbasComboboxUI }): any
  'empty'(props: { searchTerm?: string }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label'(props: { item: T, index: number }): any
  'item-description'(props: { item: T, index: number }): any
  'item-trailing': SlotProps<T>
  'content-top': (props?: {}) => any
  'content-bottom': (props?: {}) => any
  'create-item-label'(props: { item: string }): any
}
</script>

<script setup lang="ts"
  generic="T extends ArrayOrNested<RobotbasComboboxItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false">
  import { useTemplateRef, computed, onMounted, toRef, toRaw } from 'vue'
  import { ComboboxRoot, ComboboxArrow, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxPortal, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxVirtualizer, ComboboxLabel, ComboboxSeparator, ComboboxItem, ComboboxItemIndicator, FocusScope, useForwardPropsEmits, useFilter } from 'reka-ui'
  import { defu } from 'defu'
  import { reactivePick, createReusableTemplate } from '@vueuse/core'
  import { useFieldGroup } from '../composables/useFieldGroup'
  import { useComponentIcons } from '../composables/useComponentIcons'
  import { useFormField } from '../composables/useFormField'
  import { useLocale } from '../composables/useLocale'
  import { usePortal } from '../composables/usePortal'
  import { compare, get, getDisplayValue, isArrayOfArray, looseToNumber } from '../utils'
  import { getEstimateSize } from '../utils/virtualizer'
  import RobotbasIcon from './RobotbasIcon.vue'
  import RobotbasAvatar from './RobotbasAvatar.vue'
  import RobotbasChip from './RobotbasChip.vue'
  import RobotbasInput from './RobotbasInput.vue'

  defineOptions({ inheritAttrs: false })

  const props = withDefaults(defineProps<RobotbasComboboxProps<T, VK, M>>(), {
    portal: true,
    searchInput: true,
    labelKey: 'label',
    descriptionKey: 'description',
    resetSearchTermOnBlur: true,
    resetSearchTermOnSelect: true,
    autofocusDelay: 0,
    virtualize: false
  })
  const emits = defineEmits<RobotbasComboboxEmits<T, VK, M>>()
  const slots = defineSlots<RobotbasComboboxSlots<T, VK, M>>()

  const searchTerm = defineModel<string>('searchTerm', { default: '' })

  const { t } = useLocale()
  const { contains } = useFilter({ sensitivity: 'base' })

  const rootProps = useForwardPropsEmits(reactivePick(props, 'modelValue', 'defaultValue', 'open', 'defaultOpen', 'required', 'multiple', 'resetSearchTermOnBlur', 'resetSearchTermOnSelect', 'highlightOnHover'), emits)
  const portalProps = usePortal(toRef(() => props.portal))
  const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 2, collisionPadding: 8, position: 'popper', align: 'end' }) as ComboboxContentProps)
  const arrowProps = toRef(() => props.arrow as ComboboxArrowProps)
  const virtualizerProps = toRef(() => {
    if (!props.virtualize) return false

    return defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
      estimateSize: getEstimateSize(items.value, props.size || 'md', props.descriptionKey as string)
    })
  })
  const searchInputProps = toRef(() => defu(props.searchInput, { placeholder: t('robotbas-combobox.search.placeholder'), variant: 'none' }) as RobotbasInputProps)

  const { emitFormBlur, emitFormFocus, emitFormInput, emitFormChange, size: formGroupSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField<RobotbasInputProps>(props)
  const { orientation, size: fieldGroupSize } = useFieldGroup<RobotbasInputProps>(props)
  const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props)))

  const selectSize = computed(() => fieldGroupSize.value || formGroupSize.value)

  const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate()
  const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: RobotbasComboboxItem, index: number }>({
    props: {
      item: {
        type: [Object, String, Number, Boolean],
        required: true
      },
      index: {
        type: Number,
        required: false
      }
    }
  })

  const ui = computed(() => {
    return {
      base: createUiFn(props.ui?.base || 'form-select'),
      value: createUiFn(props.ui?.value || ''),
      placeholder: createUiFn(props.ui?.placeholder || 'text-muted'),
      focusScope: createUiFn(props.ui?.focusScope || ''),
      viewport: createUiFn(props.ui?.viewport || ''),
      group: createUiFn(props.ui?.group || ''),
      arrow: createUiFn(props.ui?.arrow || ''),
      content: createUiFn(props.ui?.content || 'dropdown-menu robotbas-combobox-content show'),
      input: createUiFn(props.ui?.input || 'form-control mb-1'),
      leading: createUiFn(props.ui?.leading || ''),
      leadingIcon: createUiFn(props.ui?.leadingIcon || ''),
      trailing: createUiFn(props.ui?.trailing || ''),
      trailingIcon: createUiFn(props.ui?.trailingIcon || ''),
      empty: createUiFn(props.ui?.empty || 'dropdown-item-text text-muted'),
      contentTop: createUiFn(props.ui?.contentTop || ''),
      contentBottom: createUiFn(props.ui?.contentBottom || ''),
      createItemLabel: createUiFn(props.ui?.createItemLabel || ''),
      label: createUiFn(props.ui?.label || 'dropdown-header'),
      separator: createUiFn(props.ui?.separator || 'dropdown-divider'),
      item: createUiFn(props.ui?.item || 'dropdown-item'),
      itemLeadingIcon: createUiFn(props.ui?.itemLeadingIcon || ''),
      itemLeadingAvatarSize: () => props.ui?.itemLeadingAvatarSize || 'itemLeadingAvatarSize',
      itemLeadingAvatar: createUiFn(props.ui?.itemLeadingAvatar || ''),
      itemLeadingChipSize: () => props.ui?.itemLeadingChipSize || 'itemLeadingChipSize',
      itemLeadingChip: createUiFn(props.ui?.itemLeadingChip || ''),
      itemWrapper: createUiFn(props.ui?.itemWrapper || ''),
      itemLabel: createUiFn(props.ui?.itemLabel || ''),
      itemDescription: createUiFn(props.ui?.itemDescription || 'text-muted small'),
      itemTrailing: createUiFn(props.ui?.itemTrailing || ''),
      itemTrailingIcon: createUiFn(props.ui?.itemTrailingIcon || ''),
    }
  })

  function displayValue(value: GetItemValue<T, VK> | GetItemValue<T, VK>[]): string | undefined {
    if (props.multiple && Array.isArray(value)) {
      const displayedValues = value
        .map(item => getDisplayValue<NestedItem<T>, GetItemValue<T, VK>>(items.value, item, {
          labelKey: props.labelKey,
          valueKey: props.valueKey
        }))
        .filter((v): v is string => v != null && v !== '')

      return displayedValues.length > 0 ? displayedValues.join(', ') : undefined
    }

    return getDisplayValue<NestedItem<T>, GetItemValue<T, VK>>(items.value, value as GetItemValue<T, VK>, {
      labelKey: props.labelKey,
      valueKey: props.valueKey
    })
  }

  const groups = computed<RobotbasComboboxItem[][]>(() =>
    props.items?.length
      ? isArrayOfArray(props.items)
        ? props.items
        : [props.items]
      : []
  )
  // eslint-disable-next-line vue/no-dupe-keys
  const items = computed(() => groups.value.flatMap(group => group) as NestedItem<T>[])

  const filteredGroups = computed(() => {
    if (props.ignoreFilter || !searchTerm.value) {
      return groups.value
    }

    const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey] as string[]

    return groups.value.map(items => items.filter((item) => {
      if (item === undefined || item === null) {
        return false
      }

      if (typeof item !== 'object') {
        return contains(String(item), searchTerm.value)
      }

      if (item.type && ['label', 'separator'].includes(item.type)) {
        return true
      }

      return fields.some((field) => {
        const value = get(item, field)
        return value !== undefined && value !== null && contains(String(value), searchTerm.value)
      })
    })).filter(group => group.filter(item =>
      !isSelectItem(item) || (!item.type || !['label', 'separator'].includes(item.type))
    ).length > 0)
  })
  const filteredItems = computed(() => filteredGroups.value.flatMap(group => group))

  const createItem = computed(() => {
    if (!props.createItem || !searchTerm.value) {
      return false
    }

    const newItem = props.valueKey ? { [props.valueKey]: searchTerm.value } as NestedItem<T> : searchTerm.value

    if ((typeof props.createItem === 'object' && props.createItem.when === 'always') || props.createItem === 'always') {
      return !filteredItems.value.find(item => compare(item, newItem, props.valueKey as string))
    }

    return !filteredItems.value.length
  })
  const createItemPosition = computed(() => typeof props.createItem === 'object' ? props.createItem.position : 'bottom')

  const triggerRef = useTemplateRef('triggerRef')

  // Track the trigger element's width
  // const triggerWidth = ref(0)

  // Watch for trigger element and measure its width
  // let resizeObserver: ResizeObserver | null = null

  // watchEffect(() => {
  //   const ref = triggerRef.value as { $el?: HTMLButtonElement } | null
  //   const element = ref?.$el

  //   if (element) {
  //     // Update width immediately
  //     triggerWidth.value = element.offsetWidth

  //     // Set up ResizeObserver to track width changes
  //     if (resizeObserver) {
  //       resizeObserver.disconnect()
  //     }

  //     resizeObserver = new ResizeObserver((entries) => {
  //       for (const entry of entries) {
  //         triggerWidth.value = entry.target.clientWidth
  //       }
  //     })

  //     resizeObserver.observe(element)
  //   } else {
  //     if (resizeObserver) {
  //       resizeObserver.disconnect()
  //       resizeObserver = null
  //     }
  //   }
  // })

  // onUnmounted(() => {
  //   if (resizeObserver) {
  //     resizeObserver.disconnect()
  //   }
  // })

  // Computed style for content to match trigger width
  const contentStyle = computed(() => {
    // if (triggerWidth.value > 0) {
    //   return { minWidth: `${triggerWidth.value}px`, width: `${triggerWidth.value}px` }
    // }
    return {}
  })

  function autoFocus() {
    if (props.autofocus) {
      (triggerRef.value as { $el?: HTMLButtonElement })?.$el?.focus({
        focusVisible: true
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

    if (props.resetSearchTermOnSelect) {
      searchTerm.value = ''
    }
  }

  function onUpdateOpen(value: boolean) {
    let timeoutId

    if (!value) {
      const event = new FocusEvent('blur')

      emits('blur', event)
      emitFormBlur()

      // Since we use `displayValue` prop inside ComboboxInput we should reset searchTerm manually
      // https://reka-ui.com/docs/components/combobox#api-reference
      if (props.resetSearchTermOnBlur) {
        const STATE_ANIMATION_DELAY_MS = 100

        timeoutId = setTimeout(() => {
          searchTerm.value = ''
        }, STATE_ANIMATION_DELAY_MS)
      }
    } else {
      const event = new FocusEvent('focus')
      emits('focus', event)
      emitFormFocus()
      clearTimeout(timeoutId)
    }
  }

  function onCreate(e: Event) {
    e.preventDefault()
    e.stopPropagation()

    emits('create', searchTerm.value)
  }

  function onSelect(e: Event, item: RobotbasComboboxItem) {
    if (!isSelectItem(item)) {
      return
    }

    if (item.disabled) {
      e.preventDefault()
      return
    }

    item.onSelect?.(e)
  }

  function isSelectItem(item: RobotbasComboboxItem): item is Exclude<RobotbasComboboxItem, RobotbasComboboxValue> {
    return typeof item === 'object' && item !== null
  }

  defineExpose({
    triggerRef: toRef(() => (triggerRef.value as { $el?: HTMLButtonElement })?.$el as HTMLButtonElement)
  })
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DefineCreateItemTemplate>
    <ComboboxItem data-slot="item" :class="ui.item({ class: props.ui?.item })" :value="searchTerm" @select="onCreate">
      <span data-slot="itemLabel" :class="ui.itemLabel({ class: props.ui?.itemLabel })">
        <slot name="create-item-label" :item="searchTerm">
          {{ t('RobotbasCombobox.create', { label: searchTerm }) }}
        </slot>
      </span>
    </ComboboxItem>
  </DefineCreateItemTemplate>

  <DefineItemTemplate v-slot="{ item, index }">
    <ComboboxLabel v-if="isSelectItem(item) && item.type === 'label'" data-slot="label"
      :class="ui.label({ class: [props.ui?.label, item.ui?.label, item.class] })">
      {{ get(item, props.labelKey as string) }}
    </ComboboxLabel>

    <ComboboxSeparator v-else-if="isSelectItem(item) && item.type === 'separator'" data-slot="separator"
      :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator, item.class] })" />

    <ComboboxItem v-else data-slot="item"
      :class="ui.item({ class: [props.ui?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] })"
      :disabled="isSelectItem(item) && item.disabled"
      :value="props.valueKey && isSelectItem(item) ? get(item, props.valueKey as string) : item"
      @select="onSelect($event, item)">
      <slot name="item" :item="(item as NestedItem<T>)" :index="index" :ui="ui">
        <slot name="item-leading" :item="(item as NestedItem<T>)" :index="index" :ui="ui">
          <RobotbasIcon v-if="isSelectItem(item) && item.icon" :name="item.icon" data-slot="itemLeadingIcon"
            :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })" />
          <RobotbasAvatar v-else-if="isSelectItem(item) && item.avatar"
            :size="((item.ui?.itemLeadingAvatarSize || props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as RobotbasAvatarProps['size'])"
            v-bind="item.avatar" data-slot="itemLeadingAvatar"
            :class="ui.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })" />
          <RobotbasChip v-else-if="isSelectItem(item) && item.chip"
            :size="((props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()) as RobotbasChipProps['size'])" inset
            standalone v-bind="item.chip" data-slot="itemLeadingChip"
            :class="ui.itemLeadingChip({ class: [props.ui?.itemLeadingChip, item.ui?.itemLeadingChip] })" />
        </slot>

        <span data-slot="itemWrapper"
          :class="ui.itemWrapper({ class: [props.ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })">
          <span data-slot="itemLabel"
            :class="ui.itemLabel({ class: [props.ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })">
            <slot name="item-label" :item="(item as NestedItem<T>)" :index="index">
              {{ isSelectItem(item) ? get(item, props.labelKey as string) : item }}
            </slot>
          </span>

          <span v-if="isSelectItem(item) && (get(item, props.descriptionKey as string) || !!slots['item-description'])"
            data-slot="itemDescription"
            :class="ui.itemDescription({ class: [props.ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })">
            <slot name="item-description" :item="(item as NestedItem<T>)" :index="index">
              {{ get(item, props.descriptionKey as string) }}
            </slot>
          </span>
        </span>

        <span data-slot="itemTrailing"
          :class="ui.itemTrailing({ class: [props.ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })">
          <slot name="item-trailing" :item="(item as NestedItem<T>)" :index="index" :ui="ui" />

          <ComboboxItemIndicator as-child>
            <RobotbasIcon v-if="selectedIcon" :name="selectedIcon" data-slot="itemTrailingIcon"
              :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })" />
          </ComboboxItemIndicator>
        </span>
      </slot>
    </ComboboxItem>
  </DefineItemTemplate>

  <ComboboxRoot :id="id" v-slot="{ modelValue, open }" v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }" ignore-filter
    as-child :name="name" :disabled="disabled" @update:model-value="onUpdate" @update:open="onUpdateOpen">
    <ComboboxAnchor as-child>
      <ComboboxTrigger ref="triggerRef" data-slot="base" :class="ui.base({ class: [props.ui?.base, props.class] })"
        tabindex="0">
        <span v-if="isLeading || !!avatar || !!slots.leading" data-slot="leading"
          :class="ui.leading({ class: props.ui?.leading })">
          <slot name="leading" :model-value="(modelValue as GetModelValue<T, VK, M>)" :open="open" :ui="ui">
            <RobotbasIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon"
              :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
            <RobotbasAvatar v-else-if="!!avatar"
              :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as RobotbasAvatarProps['size'])"
              v-bind="avatar" data-slot="itemLeadingAvatar"
              :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
          </slot>
        </span>

        <slot :model-value="(modelValue as GetModelValue<T, VK, M>)" :open="open" :ui="ui">
          <template v-for="displayedModelValue in [displayValue(modelValue as GetModelValue<T, VK, M>)]"
            :key="displayedModelValue">
            <span v-if="displayedModelValue !== undefined && displayedModelValue !== null" data-slot="value"
              :class="ui.value({ class: props.ui?.value })">
              {{ displayedModelValue }}
            </span>
            <span v-else data-slot="placeholder" :class="ui.placeholder({ class: props.ui?.placeholder })">
              {{ placeholder ?? '&nbsp;' }}
            </span>
          </template>
        </slot>

        <span v-if="isTrailing || !!slots.trailing" data-slot="trailing"
          :class="ui.trailing({ class: props.ui?.trailing })">
          <slot name="trailing" :model-value="(modelValue as GetModelValue<T, VK, M>)" :open="open" :ui="ui">
            <RobotbasIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon"
              :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
          </slot>
        </span>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal v-bind="portalProps">
      <ComboboxContent data-slot="content" :class="ui.content({ class: props.ui?.content })" :style="contentStyle"
        v-bind="contentProps">
        <FocusScope trapped data-slot="focusScope" :class="ui.focusScope({ class: props.ui?.focusScope })">
          <slot name="content-top" />

          <ComboboxInput v-if="!!searchInput" v-model="searchTerm" :display-value="() => searchTerm" as-child>
            <RobotbasInput autofocus autocomplete="off" :size="size" v-bind="searchInputProps" data-slot="input"
              :ui="{ base: ui.input({ class: props.ui?.input }) }" @change.stop />
          </ComboboxInput>

          <ComboboxEmpty data-slot="empty" :class="ui.empty({ class: props.ui?.empty })">
            <slot name="empty" :search-term="searchTerm">
              {{ searchTerm ? t('RobotbasCombobox.noMatch', { searchTerm }) : t('RobotbasCombobox.noData') }}
            </slot>
          </ComboboxEmpty>

          <div role="presentation" data-slot="viewport" :class="ui.viewport({ class: props.ui?.viewport })">
            <template v-if="!!virtualize">
              <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'top'" />

              <ComboboxVirtualizer v-slot="{ option: item, virtualItem }" :options="(filteredItems as any[])"
                :text-content="(item: any) => isSelectItem(item) ? get(item, props.labelKey as string) : String(item)"
                v-bind="virtualizerProps">
                <ReuseItemTemplate :item="item" :index="virtualItem.index" />
              </ComboboxVirtualizer>

              <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'bottom'" />
            </template>

            <template v-else>
              <ComboboxGroup v-if="createItem && createItemPosition === 'top'" data-slot="group"
                :class="ui.group({ class: props.ui?.group })">
                <ReuseCreateItemTemplate />
              </ComboboxGroup>

              <ComboboxGroup v-for="(group, groupIndex) in filteredGroups" :key="`group-${groupIndex}`"
                data-slot="group" :class="ui.group({ class: props.ui?.group })">
                <ReuseItemTemplate v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`" :item="item"
                  :index="index" />
              </ComboboxGroup>

              <ComboboxGroup v-if="createItem && createItemPosition === 'bottom'" data-slot="group"
                :class="ui.group({ class: props.ui?.group })">
                <ReuseCreateItemTemplate />
              </ComboboxGroup>
            </template>
          </div>

          <slot name="content-bottom" />
        </FocusScope>

        <ComboboxArrow v-if="!!arrow" v-bind="arrowProps" data-slot="arrow"
          :class="ui.arrow({ class: props.ui?.arrow })" />
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>

<style>
.robotbas-combobox-content {
  max-height: 200px;
  overflow-y: auto;
  position: relative;
  padding: 0.25rem;
  /* width: min-content; */
}
</style>
