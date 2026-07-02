<script lang="ts">
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import { createUiFn, type RobotbasAvatarProps } from '../types'
import type { InputHTMLAttributes } from '../types/html'
import type { ModelModifiers } from '../types/input'


export interface InputProps extends UseComponentIconsProps, /** @vue-ignore */ Omit<InputHTMLAttributes, 'name' | 'type' | 'placeholder' | 'required' | 'autocomplete' | 'autofocus' | 'disabled'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  id?: string
  name?: string
  type?: InputHTMLAttributes['type'],
  leadingAs?: 'button' | 'span'
  trailingAs?: 'button' | 'span'
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
  modelValue?: number
  defaultValue?: number
  modelModifiers?: ModelModifiers<number>
  valuesLabels: string[]
  class?: any
  iterationMode?: "rotation" | "limit"
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

export interface InputEmits {
  'update:modelValue': [value: number]
  'blur': [event: FocusEvent]
  'change': [event: Event]
}

export interface InputSlots {
  leading(props: { ui: { root?: string, base?: string, leading?: string, leadingIcon?: string, leadingAvatar?: string, leadingAvatarSize?: string } }): any
  default(props: { ui: { root?: string, base?: string, leading?: string, leadingIcon?: string, leadingAvatar?: string, leadingAvatarSize?: string } }): any
  trailing(props: { ui: { root?: string, base?: string, trailing?: string, trailingIcon?: string } }): any
}
</script>

<script setup lang="ts">
import { useTemplateRef, computed, onMounted, type ComputedRef } from 'vue'
import { Primitive } from 'reka-ui'
import { useVModel } from '@vueuse/core'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { looseToNumber } from '../utils'
import RobotbasIcon from './RobotbasIcon.vue'
import RobotbasAvatar from './RobotbasAvatar.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  autocomplete: 'off',
  autofocusDelay: 0,
  leadingAs: 'button',
  trailingAs: 'button',
  trailingIcon: 'robotbas-icon-bold icon-caret-right-fill',
  leadingIcon: 'robotbas-icon-bold icon-caret-left-fill',
  iterationMode: 'rotation',
  ui: () => ({
    base: 'form-control',
    leading: 'input-group-text',
    trailing: 'input-group-text',
  })
})
const emits = defineEmits<InputEmits>()
const slots = defineSlots<InputSlots>()

const modelValue = useVModel<InputProps, 'modelValue', 'update:modelValue'>(props, 'modelValue', emits, { defaultValue: props.defaultValue })

const { emitFormBlur, emitFormInput, emitFormChange, size: formGroupSize, color, id, name, highlight, disabled, emitFormFocus, ariaAttrs } = useFormField<InputProps>(props, { deferInputValidation: true })
const { orientation, size: fieldGroupSize } = useFieldGroup<InputProps>(props)
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

const numValues: ComputedRef<number> = computed(() => props.valuesLabels.length)
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

  modelValue.value = Number(value) as number
  emitFormInput()
}

function nextIndex() {
  if (props.iterationMode === 'limit') {
    if (modelValue.value !== undefined && modelValue.value < numValues.value - 1) {
      modelValue.value = modelValue.value + 1
    }
  } else {
    modelValue.value = ((modelValue.value ?? 0) + 1) % numValues.value as number
  }
}
function previousIndex() {
  if (props.iterationMode === 'limit') {
    if (modelValue.value !== undefined && modelValue.value > 0) {
      modelValue.value = modelValue.value - 1
    }
  } else {
    modelValue.value = ((modelValue.value ?? 0) - 1 + numValues.value) % numValues.value as number
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
    <Primitive v-if="isLeading || !!avatar || !!slots.leading" :as="leadingAs" data-slot="leading"
      :class="ui.leading({ class: props.ui?.leading })" @click="previousIndex">
      <slot name="leading" :ui="props.ui">
        <RobotbasIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon"
          :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
        <RobotbasAvatar v-else-if="!!avatar"
          :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as RobotbasAvatarProps['size'])"
          v-bind="avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
      </slot>
    </Primitive>
    <input :id="id" ref="inputRef" :type="type" :value="valuesLabels[modelValue ?? 0]" :name="name"
      :placeholder="placeholder" data-slot="base" :class="ui.base({ class: props.ui?.base })" :disabled="disabled"
      :required="required" :autocomplete="autocomplete" v-bind="{ ...$attrs, ...ariaAttrs }" readonly @blur="onBlur"
      @change="onChange" @focus="emitFormFocus">

    <slot :ui="props.ui" />

    <Primitive v-if="isTrailing || !!slots.trailing" :as="trailingAs" data-slot="trailing"
      :class="ui.trailing({ class: props.ui?.trailing })" @click="nextIndex">
      <slot name="trailing" :ui="props.ui">
        <RobotbasIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon"
          :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
      </slot>
    </Primitive>
  </Primitive>
</template>
