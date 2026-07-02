<script lang="ts">
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import { createUiFn, type RobotbasAvatarProps } from '../types'
import type { InputHTMLAttributes } from '../types/html'
import type { ModelModifiers } from '../types/input'
import type { AcceptableValue } from '../types/utils'

export type InputValue = AcceptableValue

export interface RobotbasInputProps<T extends InputValue = InputValue> extends UseComponentIconsProps, /** @vue-ignore */ Omit<InputHTMLAttributes, 'name' | 'type' | 'placeholder' | 'required' | 'autocomplete' | 'autofocus' | 'disabled'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  id?: string
  name?: string
  type?: InputHTMLAttributes['type']
  /** The placeholder text when the input is empty. */
  placeholder?: string
  /**
   * @defaultValue 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'senary' | 'septenary' | 'octonary' | 'nonary' | 'denary'
  /**
   * @defaultValue 'outline'
   */
  variant?: 'outline' | 'filled' | 'ghost' | 'link'
  /**
   * @defaultValue 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  required?: boolean
  autocomplete?: InputHTMLAttributes['autocomplete']
  autofocus?: boolean
  autofocusDelay?: number
  disabled?: boolean
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  modelValue?: T
  defaultValue?: T
  modelModifiers?: ModelModifiers<T>
  class?: any
  ui?: {
    root?: string
    base?: string
    leading?: string
    leadingIcon?: string
    leadingAvatar?: string
    leadingAvatarSize?: string
    trailing?: string
    trailingIcon?: string
  }
}

export interface RobotbasInputEmits<T extends InputValue = InputValue> {
  'update:modelValue': [value: T]
  'blur': [event: FocusEvent]
  'change': [event: Event]
}

export interface RobotbasInputSlots {
  leading(props: { ui: { root?: string, base?: string, leading?: string, leadingIcon?: string, leadingAvatar?: string, leadingAvatarSize?: string } }): any
  default(props: { ui: { root?: string, base?: string, leading?: string, leadingIcon?: string, leadingAvatar?: string, leadingAvatarSize?: string } }): any
  trailing(props: { ui: { root?: string, base?: string, trailing?: string, trailingIcon?: string } }): any
}
</script>

<script setup lang="ts" generic="T extends InputValue">
import { useTemplateRef, computed, onMounted } from 'vue'
import { Primitive } from 'reka-ui'
import { useVModel } from '@vueuse/core'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { looseToNumber } from '../utils'
import RobotbasIcon from './RobotbasIcon.vue'
import RobotbasAvatar from './RobotbasAvatar.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<RobotbasInputProps<T>>(), {
  type: 'text',
  autocomplete: 'off',
  autofocusDelay: 0
})
const emits = defineEmits<RobotbasInputEmits<T>>()
const slots = defineSlots<RobotbasInputSlots>()

const modelValue = useVModel<RobotbasInputProps<T>, 'modelValue', 'update:modelValue'>(props, 'modelValue', emits, { defaultValue: props.defaultValue })

const { emitFormBlur, emitFormInput, emitFormChange, size: formGroupSize, color, id, name, highlight, disabled, emitFormFocus, ariaAttrs } = useFormField<RobotbasInputProps<T>>(props, { deferInputValidation: true })
const { orientation, size: fieldGroupSize } = useFieldGroup<RobotbasInputProps<T>>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const inputSize = computed(() => fieldGroupSize.value || formGroupSize.value)

const ui = computed(() => ({
  root: createUiFn(props.ui?.root),
  base: createUiFn(props.ui?.base),
  leading: createUiFn(isLeading.value || !!props.avatar || !!slots.leading),
  leadingIcon: createUiFn(props.ui?.leadingIcon),
  leadingAvatar: createUiFn(props.ui?.leadingAvatar),
  leadingAvatarSize: createUiFn(props.ui?.leadingAvatarSize),
  trailing: createUiFn(isTrailing.value || !!slots.trailing),
  trailingIcon: createUiFn(props.ui?.trailingIcon),
  type: createUiFn(props.type),
  color: createUiFn(color.value),
  variant: createUiFn(props.variant),
  size: createUiFn(inputSize?.value),
  loading: createUiFn(props.loading),
  highlight: createUiFn(highlight.value),
  fieldGroup: createUiFn(orientation.value)
}))

const inputRef = useTemplateRef('inputRef')

// Custom function to handle the v-model properties
function updateInput(value: string | null | undefined) {
  if (props.modelModifiers?.trim) {
    value = value?.trim() ?? null
  }

  if (props.modelModifiers?.number || props.type === 'number') {
    value = looseToNumber(value)
  }

  if (props.modelModifiers?.nullable) {
    value ||= null
  }

  if (props.modelModifiers?.optional) {
    value ||= undefined
  }

  modelValue.value = value as T
  emitFormInput()
}

function onInput(event: Event) {
  if (!props.modelModifiers?.lazy) {
    updateInput((event.target as HTMLInputElement).value)
  }
}

function onChange(event: Event) {
  const value = (event.target as HTMLInputElement).value

  if (props.modelModifiers?.lazy) {
    updateInput(value)
  }

  // Update trimmed input so that it has same behavior as native input https://github.com/vuejs/core/blob/5ea8a8a4fab4e19a71e123e4d27d051f5e927172/packages/runtime-dom/src/directives/vModel.ts#L63
  if (props.modelModifiers?.trim) {
    (event.target as HTMLInputElement).value = value.trim()
  }

  emitFormChange()
  emits('change', event)
}

function onBlur(event: FocusEvent) {
  emitFormBlur()
  emits('blur', event)
}

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.focus()
  }
}

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

defineExpose({
  inputRef
})
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <input :id="id" ref="inputRef" :type="type" :value="modelValue" :name="name" :placeholder="placeholder"
      data-slot="base" :class="ui.base({ class: props.ui?.base })" :disabled="disabled" :required="required"
      :autocomplete="autocomplete" v-bind="{ ...$attrs, ...ariaAttrs }" @input="onInput" @blur="onBlur"
      @change="onChange" @focus="emitFormFocus">

    <slot :ui="ui" />

    <span v-if="isLeading || !!avatar || !!slots.leading" data-slot="leading"
      :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading" :ui="ui">
        <RobotbasIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon"
          :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
        <RobotbasAvatar v-else-if="!!avatar"
          :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as RobotbasAvatarProps['size'])"
          v-bind="avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
      </slot>
    </span>

    <span v-if="isTrailing || !!slots.trailing" data-slot="trailing"
      :class="ui.trailing({ class: props.ui?.trailing })">
      <slot name="trailing" :ui="ui">
        <RobotbasIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon"
          :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
      </slot>
    </span>
  </Primitive>
</template>
