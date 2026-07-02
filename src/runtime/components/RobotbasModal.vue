<script lang="ts">
import type { DialogRootProps, DialogRootEmits, DialogContentProps } from 'reka-ui'
import type { VNode } from 'vue'

export interface RobotbasModalUI {
  overlay?: string
  modal?: string
  dialog?: string
  content?: string
  header?: string
  wrapper?: string
  title?: string
  description?: string
  close?: string
  body?: string
  footer?: string
}

export interface RobotbasModalProps extends DialogRootProps {
  title?: string
  titleIcon?: string
  description?: string
  /**
   * Props forwarded to the reka-ui DialogContent element.
   */
  contentProps?: Omit<DialogContentProps, 'as' | 'asChild' | 'forceMount'>
  /**
   * Render an overlay behind the modal.
   * @defaultValue true
   */
  overlay?: boolean
  /**
   * When `true`, the modal body becomes scrollable while header/footer stay fixed.
   * @defaultValue false
   */
  scrollable?: boolean
  /**
   * When `true`, the modal will take up the full screen.
   * @defaultValue false
   */
  fullscreen?: boolean
  /**
   * Render the modal in a portal.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /**
   * Display a close button to dismiss the modal.
   * @defaultValue true
   */
  close?: boolean
  /**
   * Icon class for the close button.
   * @defaultValue 'modal-close-icon robotbas-icon-bold icon-cancel'
   */
  closeIcon?: string
  /**
   * When `false`, the modal will not close when clicking outside or pressing escape.
   * @defaultValue true
   */
  dismissible?: boolean
  class?: any
  ui?: RobotbasModalUI
}

export interface RobotbasModalEmits extends DialogRootEmits {
  'after:leave': []
  'after:enter': []
  'close:prevent': []
}

export interface RobotbasModalSlots {
  default?(props: { open: boolean }): VNode[]
  content?(props: { close: () => void }): VNode[]
  header?(props: { close: () => void }): VNode[]
  title?(props?: {}): VNode[]
  description?(props?: {}): VNode[]
  actions?(props?: {}): VNode[]
  close?(props: { ui: ReturnType<typeof computeUi> }): VNode[]
  body?(props: { close: () => void }): VNode[]
  footer?(props: { close: () => void }): VNode[]
}

function computeUi(ui?: RobotbasModalUI) {
  return {
    overlay: createUiFn(ui?.overlay || 'modal-backdrop show'),
    modal: createUiFn(ui?.modal || 'modal show d-block'),
    dialog: createUiFn(ui?.dialog || 'modal-dialog'),
    content: createUiFn(ui?.content || 'modal-content'),
    header: createUiFn(ui?.header || 'modal-header'),
    wrapper: createUiFn(ui?.wrapper || 'flex-grow-1'),
    title: createUiFn(ui?.title || 'modal-title'),
    description: createUiFn(ui?.description || ''),
    close: createUiFn(ui?.close || 'robotbas-clickable-icon size-16px'),
    body: createUiFn(ui?.body || 'modal-body'),
    footer: createUiFn(ui?.footer || 'modal-footer'),
  }
}
</script>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose, VisuallyHidden, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { usePortal } from '../composables/usePortal'
import { createUiFn } from '../types'

const props = withDefaults(defineProps<RobotbasModalProps>(), {
  title: '',
  description: '',
  contentProps: undefined,
  close: true,
  closeIcon: 'modal-close-icon robotbas-icon-bold icon-cancel',
  portal: true,
  overlay: true,
  modal: true,
  dismissible: true,
  class: '',
  ui: () => ({}),
})
const emits = defineEmits<RobotbasModalEmits>()
const slots = defineSlots<RobotbasModalSlots>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'open', 'defaultOpen', 'modal'), emits)
const portalProps = usePortal(toRef(() => props.portal))
const fwdContentProps = toRef(() => props.contentProps)

const contentEvents = computed(() => {
  if (!props.dismissible) {
    return {
      escapeKeyDown: (e: Event) => {
        e.preventDefault()
        emits('close:prevent')
      }
    }
  }
  return {}
})


const ui = computed(() => computeUi(props.ui))

const dialogClass = computed(() => {
  const classes = []
  if (props.ui?.dialog) classes.push(props.ui.dialog)
  if (props.fullscreen) classes.push('modal-fullscreen')
  if (props.scrollable) classes.push('modal-dialog-scrollable')
  return classes.join(' ')
})

function onBackdropPointerDown(close: () => void) {
  if (props.dismissible) {
    close()
  } else {
    emits('close:prevent')
  }
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DialogRoot v-slot="{ open, close }" v-bind="rootProps">
    <DialogTrigger v-if="!!slots.default" as-child :class="props.class">
      <slot :open="open" />
    </DialogTrigger>

    <DialogPortal v-bind="portalProps">
      <DialogOverlay v-if="overlay" data-slot="overlay" :class="ui.overlay({ class: props.ui?.overlay })" />

      <DialogContent data-slot="modal" :class="ui.modal({ class: props.ui?.modal })" v-bind="fwdContentProps"
        v-on="contentEvents" @pointerdown.self="onBackdropPointerDown(close)" @after-enter="emits('after:enter')"
        @after-leave="emits('after:leave')">
        <div data-slot="dialog" :class="dialogClass" @pointerdown.self="onBackdropPointerDown(close)">
          <div data-slot="content" :class="ui.content({ class: [props.ui?.content, !slots.default && props.class] })">

            <VisuallyHidden
              v-if="!!slots.content && ((title || !!slots.title) || (description || !!slots.description))">
              <DialogTitle v-if="title || !!slots.title">
                <slot name="title">
                  {{ title }}
                </slot>
              </DialogTitle>

              <DialogDescription v-if="description || !!slots.description">
                <slot name="description">
                  {{ description }}
                </slot>
              </DialogDescription>
            </VisuallyHidden>

            <slot name="content" :close="close">
              <div
                v-if="!!slots.header || (title || !!slots.title) || (description || !!slots.description) || (props.close || !!slots.close)"
                data-slot="header" :class="ui.header({ class: props.ui?.header })">
                <slot name="header" :close="close">
                  <i v-if="titleIcon" class="modal-header-icon" :class="titleIcon"></i>
                  <div data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
                    <DialogTitle v-if="title || !!slots.title" data-slot="title"
                      :class="ui.title({ class: props.ui?.title })">
                      <slot name="title">
                        {{ title }}
                      </slot>
                    </DialogTitle>

                    <DialogDescription v-if="description || !!slots.description" data-slot="description"
                      :class="ui.description({ class: props.ui?.description })">

                      <slot name="description">
                        {{ description }}
                      </slot>
                    </DialogDescription>
                  </div>

                  <slot name="actions" />

                  <DialogClose v-if="props.close || !!slots.close" as-child>
                    <slot name="close" :ui="ui">
                      <robotbas-clickable-icon v-if="props.close" :icon-class="closeIcon" data-slot="close"
                        :class="ui.close({ class: props.ui?.close })" aria-label="Close"></robotbas-clickable-icon>
                    </slot>
                  </DialogClose>
                </slot>
              </div>

              <div v-if="!!slots.body" data-slot="body" :class="ui.body({ class: props.ui?.body })">
                <slot name="body" :close="close" />
              </div>

              <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
                <slot name="footer" :close="close" />
              </div>
            </slot>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
