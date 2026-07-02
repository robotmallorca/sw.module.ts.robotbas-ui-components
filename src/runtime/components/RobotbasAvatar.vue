<script lang="ts">
import type { ImgHTMLAttributes } from '../types/html'
import type { IconProps } from './RobotbasIcon.vue'
import type { RobotbasChipProps } from './RobotbasChip.vue'
import { createUiFn } from '../types'
// import type { ComponentConfig } from '../types/tv'

// type Avatar = ComponentConfig<typeof theme, AppConfig, 'avatar'>
export interface RobotbasAvatarUI {
  size?: string
  root?: string
  image?: string
  icon?: string
  fallback?: string
}
export interface RobotbasAvatarProps extends /** @vue-ignore */ Omit<ImgHTMLAttributes, 'src' | 'alt'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'span'
   */
  as?: any | { root?: any, img?: any }
  src?: string
  alt?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  text?: string
  /**
   * @defaultValue 'md'
   */
  size?: string // Avatar['variants']['size']
  chip?: boolean | RobotbasChipProps
  class?: any
  style?: any
  ui?: RobotbasAvatarUI // Avatar['slots']
}

export interface RobotbasAvatarSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Primitive, Slot } from 'reka-ui'
import { defu } from 'defu'
// import ImageComponent from '#build/ui-image-component'
import { useAvatarGroup } from '../composables/useAvatarGroup'
import RobotbasIcon from './RobotbasIcon.vue'
import RobotbasChip from './RobotbasChip.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<RobotbasAvatarProps>()

const as = computed(() => {
  if (typeof props.as === 'string' || typeof props.as?.render === 'function') {
    return { root: props.as }
  }

  return defu(props.as, { root: 'span', img: 'img' })
})

const fallback = computed(() => props.text || (props.alt || '').split(' ').map(word => word.charAt(0)).join('').substring(0, 2))

const { size } = useAvatarGroup(props)

const ui = computed(() => {
  return {
    size: size.value,
    root: createUiFn(props.ui?.root || 'avatar'),
    image: createUiFn(props.ui?.image || 'avatar-image'),
    icon: createUiFn(props.ui?.icon || 'avatar-icon'),
    fallback: createUiFn(props.ui?.fallback || 'avatar-fallback'),
  }
})

const sizePx = computed(() => ({
  '3xs': 16,
  '2xs': 20,
  'xs': 24,
  'sm': 28,
  'md': 32,
  'lg': 36,
  'xl': 40,
  '2xl': 44,
  '3xl': 48
})[props.size || 'md'])

const error = ref(false)

watch(() => props.src, () => {
  if (error.value) {
    error.value = false
  }
})

function onError() {
  error.value = true
}
</script>

<template>
  <component :is="props.chip ? RobotbasChip : Primitive" :as="as.root" aria-hidden="true"
    v-bind="props.chip ? (typeof props.chip === 'object' ? { inset: true, ...props.chip } : { inset: true }) : {}"
    data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })" :style="props.style">
    <component :is="as.img" v-if="src && !error" :src="src" :alt="alt" :width="sizePx" :height="sizePx" v-bind="$attrs"
      data-slot="image" :class="ui.image({ class: props.ui?.image })" @error="onError" />

    <Slot v-else v-bind="$attrs">
      <slot>
        <RobotbasIcon v-if="icon" :name="icon" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
        <span v-else aria-label="Avatar fallback" data-slot="fallback"
          :class="ui.fallback({ class: props.ui?.fallback })">{{
            fallback || '&nbsp;'
          }}</span>
      </slot>
    </Slot>
  </component>
</template>
