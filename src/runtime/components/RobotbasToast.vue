<script lang="ts">
import type { ToastRootProps, ToastRootEmits } from 'reka-ui'
// import type { AppConfig } from '@nuxt/schema'
// import type { AvatarProps, ButtonProps, IconProps, ProgressProps } from '../types'
import type { StringOrVNode } from '../types/utils'
import type { RobotbasButtonProps } from './RobotbasButton.vue'
import type { RobotbasProgressProps } from './RobotbasProgress.vue'
import type { RobotbasColorTheme } from '../types/theme'

// type Toast = ComponentConfig<typeof theme, AppConfig, 'toast'>
export interface RobotbasToastUI {
  root?: string,
  wrapper?: string,
  title?: string,
  description?: string,
  actions?: string,
  close?: string,
  progress?: string,
  icon?: string,
  leading?: string,
}

export interface RobotbasToastProps extends Pick<ToastRootProps, 'defaultOpen' | 'open' | 'type' | 'duration'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'li'
   */
  as?: any
  title?: StringOrVNode
  description?: StringOrVNode
  /**
   * @IconifyIcon
   */
  icon?: string // IconProps['name']
  avatar?: string // AvatarProps
  /**
   * @defaultValue 'primary'
   */
  color?: RobotbasColorTheme
  /**
   * The orientation between the content and the actions.
   * @defaultValue 'vertical'
   */
  orientation?: string // Toast['variants']['orientation']
  /**
   * Display a close button to dismiss the toast.
   * `{ size: 'md', color: 'neutral', variant: 'link' }`{lang="ts-type"}
   * @defaultValue true
   */
  close?: boolean // | Partial<ButtonProps>
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  closeIcon?: string // IconProps['name']
  /**
   * Display a list of actions:
   * - under the title and description when orientation is `vertical`
   * - next to the close button when orientation is `horizontal`
   * `{ size: 'xs' }`{lang="ts-type"}
   */
  actions?: RobotbasButtonProps[] // ButtonProps[]
  /**
   * Display a progress bar showing the toast's remaining duration.
   * `{ size: 'sm' }`{lang="ts-type"}
   * @defaultValue true
   */
  progress?: boolean // | Pick<ProgressProps, 'color' | 'ui'>
  class?: any
  ui?: RobotbasToastUI

  // ui?: Toast['slots']
}

export interface ToastEmits extends ToastRootEmits { }

export interface ToastSlots {
  leading(props: { ui: RobotbasToastUI }): any
  title(props?: {}): any
  description(props?: {}): any
  actions(props?: {}): any
  close(props: { ui: RobotbasToastUI }): any
}
</script>

<script setup lang="ts">
import { ToastRoot, ToastTitle, ToastDescription, ToastAction, ToastClose, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'

const props = withDefaults(defineProps<RobotbasToastProps>(), {
  orientation: 'vertical',
  close: true,
  progress: true,
  ui: () => ({
    root: 'robotbas-toast-root row',
    wrapper: 'col-10 robotbas-toast-wrapper',
    title: 'ToastTitle',
    description: 'ToastDescription',
    leading: 'col-2 text-center',
    // actions: 'ToastActions',
    // close: 'ToastClose',
    // progress: 'ToastProgress',
    // icon: 'ToastIcon',
  })
})
const emits = defineEmits<ToastEmits>()
const slots = defineSlots<ToastSlots>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultOpen', 'open', 'duration', 'type'), emits)

const rootRef = useTemplateRef('rootRef')
const height = ref(0)

onMounted(() => {
  if (!rootRef.value) {
    return
  }

  nextTick(() => {
    height.value = rootRef.value?.$el?.getBoundingClientRect()?.height
  })
})

defineExpose({
  height
})
</script>

<template>
  <ToastRoot ref="rootRef" v-slot="{ remaining, duration, open }" v-bind="rootProps" :data-orientation="orientation"
    data-slot="root" :class="ui.root" :style="{ '--height': height }">
    <slot name="leading" :ui="ui">
      <!-- <UAvatar v-if="avatar" :size="((props.ui?.avatarSize || ui.avatarSize()) as AvatarProps['size'])" v-bind="avatar"
        data-slot="avatar" :class="ui.avatar({ class: props.ui?.avatar })" /> -->
      <div :class="ui.leading">
        <RobotbasIcon v-if="icon" :name="icon" data-slot="icon" :class="ui.icon" />
      </div>
    </slot>

    <div data-slot="wrapper" :class="ui.wrapper">
      <ToastTitle v-if="title || !!slots.title" data-slot="title" :class="ui.title">
        <slot name="title">
          <component :is="title()" v-if="typeof title === 'function'" />
          <component :is="title" v-else-if="typeof title === 'object'" />
          <template v-else>
            {{ title }}
          </template>
        </slot>
      </ToastTitle>
      <ToastDescription v-if="description || !!slots.description" data-slot="description" :class="ui.description">
        <slot name="description">
          <component :is="description()" v-if="typeof description === 'function'" />
          <component :is="description" v-else-if="typeof description === 'object'" />
          <template v-else>
            {{ description }}
          </template>
        </slot>
      </ToastDescription>

      <div v-if="orientation === 'vertical' && (actions?.length || !!slots.actions)" data-slot="actions"
        :class="ui.actions">
        <slot name="actions">
          <ToastAction v-for="(action, index) in actions" :key="index" :alt-text="action.label || 'Action'" as-child
            @click.stop>
            <RobotbasButton size="xs" :color="color" v-bind="action" />
          </ToastAction>
        </slot>
      </div>
    </div>

    <div v-if="(orientation === 'horizontal' && (actions?.length || !!slots.actions)) || close" data-slot="actions"
      :class="ui.actions">
      <template v-if="orientation === 'horizontal' && (actions?.length || !!slots.actions)">
        <slot name="actions">
          <ToastAction v-for="(action, index) in actions" :key="index" :alt-text="action.label || 'Action'" as-child
            @click.stop>
            <RobotbasButton size="xs" :color="color" v-bind="action" />
          </ToastAction>
        </slot>
      </template>

      <ToastClose v-if="close || !!slots.close" as-child>
        <slot name="close" :ui="ui">
          <!-- <RobotbasButton v-if="close" :icon="closeIcon || appConfig.ui.icons.close" color="neutral" variant="link"
            :aria-label="t('toast.close')" v-bind="(typeof close === 'object' ? close as Partial<ButtonProps> : {})"
            data-slot="close" :class="ui.close({ class: props.ui?.close })" @click.stop /> -->
        </slot>
      </ToastClose>
    </div>

    <RobotbasProgress v-if="progress && open && remaining > 0 && duration" :model-value="remaining / duration * 100"
      :color="color" v-bind="(typeof progress === 'object' ? progress as Partial<RobotbasProgressProps> : {})" size="sm"
      data-slot="progress" :class="ui.progress" />
  </ToastRoot>
</template>

<style>
.robotbas-toast-root {
  background-color: white;
  border-radius: 6px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  align-items: center !important;
}

.robotbas-toast-root[data-state='open'] {
  animation: slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.robotbas-toast-root[data-state='closed'] {
  animation: hide 100ms ease-in;
}

.robotbas-toast-root[data-swipe='move'] {
  transform: translateX(var(--reka-toast-swipe-move-x));
}

.robotbas-toast-root[data-swipe='cancel'] {
  transform: translateX(0);
  transition: transform 200ms ease-out;
}

.robotbas-toast-root[data-swipe='end'] {
  animation: swipeOut 100ms ease-out;
}

@keyframes hide {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(calc(100% + var(--viewport-padding)));
  }

  to {
    transform: translateX(0);
  }
}

@keyframes swipeOut {
  from {
    transform: translateX(var(--reka-toast-swipe-end-x));
  }

  to {
    transform: translateX(calc(100% + var(--viewport-padding)));
  }
}

.robotbas-toast-wrapper {
  padding: 15px;
}

.ToastTitle {
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 15px;
}

.ToastDescription {
  margin: 0;
  font-size: 13px;
  line-height: 1.3;
}
</style>
