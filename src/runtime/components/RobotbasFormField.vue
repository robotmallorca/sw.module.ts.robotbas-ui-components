<script lang="ts">
import type { Ref } from 'vue'

export interface RobotbasFormFieldUI {
  root?: string
  wrapper?: string
  labelWrapper?: string
  label?: string
  hint?: string
  description?: string
  container?: string
  error?: string
  help?: string
}

export interface RobotbasFormFieldProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /** The name of the FormField. Also used to match form errors. */
  name?: string
  /** A regular expression to match form error names. */
  errorPattern?: RegExp
  label?: string
  description?: string
  help?: string
  error?: boolean | string
  hint?: string
  /**
   * @defaultValue 'md'
   */
  size?: any // FormField['variants']['size']
  required?: boolean
  /** If true, validation on input will be active immediately instead of waiting for a blur event. */
  eagerValidation?: boolean
  /**
   * Delay in milliseconds before validating the form on input events.
   * @defaultValue `300`
   */
  validateOnInputDelay?: number
  /**
   * The orientation of the form field.
   * @defaultValue 'vertical'
   */
  orientation?: any // FormField['variants']['orientation']
  class?: any
  ui?: RobotbasFormFieldUI
}

export interface RobotbasFormFieldSlots {
  label(props: { label?: string }): any
  hint(props: { hint?: string }): any
  description(props: { description?: string }): any
  help(props: { help?: string }): any
  error(props: { error?: boolean | string }): any
  default(props: { error?: boolean | string }): any
}
</script>

<script setup lang="ts">
import { computed, ref, inject, provide, useId, watch } from 'vue'
import { Primitive, Label } from 'reka-ui'
import { formFieldInjectionKey, inputIdInjectionKey, formErrorsInjectionKey, formInputsInjectionKey } from '../composables/useFormField'
import { createUiFn } from '../types'
import type { FormError, FormFieldInjectedOptions } from '../types/form'

const props = withDefaults(defineProps<RobotbasFormFieldProps>(), {
  error: undefined
})
const slots = defineSlots<RobotbasFormFieldSlots>()

const ui = computed(() => {
  return {
    root: createUiFn(props.ui?.root || ''),
    wrapper: createUiFn(props.ui?.wrapper || ''),
    labelWrapper: createUiFn(props.ui?.labelWrapper || ''),
    label: createUiFn(props.ui?.label || ''),
    hint: createUiFn(props.ui?.hint || ''),
    description: createUiFn(props.ui?.description || ''),
    container: createUiFn(props.ui?.container || ''),
    error: createUiFn(props.ui?.error || ''),
    help: createUiFn(props.ui?.help || ''),
    size: props.size,
    required: props.required,
    orientation: props.orientation
  }
})

const formErrors = inject<Ref<FormError[]> | null>(formErrorsInjectionKey, null)

const error = computed(() => props.error || formErrors?.value?.find(error => error.name === props.name || (props.errorPattern && error.name?.match(props.errorPattern)))?.message)

const id = ref(useId())
// Copies id's initial value to bind aria-attributes such as aria-describedby.
// This is required for the RadioGroup component which unsets the id value.
const ariaId = id.value

const formInputs = inject(formInputsInjectionKey, undefined)
watch(id, () => {
  if (formInputs && props.name) {
    formInputs.value[props.name] = { id: id.value, pattern: props.errorPattern }
  }
}, { immediate: true })

provide(inputIdInjectionKey, id)

provide(formFieldInjectionKey, computed(() => ({
  error: error.value,
  name: props.name,
  size: props.size,
  eagerValidation: props.eagerValidation,
  validateOnInputDelay: props.validateOnInputDelay,
  errorPattern: props.errorPattern,
  hint: props.hint,
  description: props.description,
  help: props.help,
  ariaId
}) as FormFieldInjectedOptions<RobotbasFormFieldProps>))
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })" role="contentinfo">
    <div data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <div v-if="label || !!slots.label" data-slot="labelWrapper"
        :class="ui.labelWrapper({ class: props.ui?.labelWrapper })">
        <Label :for="id" data-slot="label" :class="ui.label({ class: props.ui?.label })">
          <slot name="label" :label="label">
            {{ label }}
          </slot>
        </Label>
        <span v-if="hint || !!slots.hint" :id="`${ariaId}-hint`" data-slot="hint"
          :class="ui.hint({ class: props.ui?.hint })">
          <slot name="hint" :hint="hint">
            {{ hint }}
          </slot>
        </span>
      </div>

      <p v-if="description || !!slots.description" :id="`${ariaId}-description`" data-slot="description"
        :class="ui.description({ class: props.ui?.description })">
        <slot name="description" :description="description">
          {{ description }}
        </slot>
      </p>
    </div>

    <div
      :class="[(label || !!slots.label || description || !!slots.description) && ui.container({ class: props.ui?.container })]">
      <slot :error="error" />
      <div v-if="props.error !== false && ((typeof error === 'string' && error) || !!slots.error)"
        :id="`${ariaId}-error`" data-slot="error" :class="ui.error({ class: props.ui?.error })">
        <slot name="error" :error="error">
          {{ error }}
        </slot>
      </div>
      <div v-else-if="help || !!slots.help" :id="`${ariaId}-help`" data-slot="help"
        :class="ui.help({ class: props.ui?.help })">
        <slot name="help" :help="help">
          {{ help }}
        </slot>
      </div>
    </div>
  </Primitive>
</template>
