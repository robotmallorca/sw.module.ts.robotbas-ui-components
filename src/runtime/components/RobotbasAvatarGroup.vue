<script lang="ts">

export interface RobotbasAvatarGroupUI {
  root?: string
  base?: string
}
export interface RobotbasAvatarGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'md'
   */
  size?: string // AvatarGroup['variants']['size']
  /**
   * The maximum number of avatars to display.
   */
  max?: number | string
  class?: any
  ui?: RobotbasAvatarGroupUI // AvatarGroup['slots']
}

export interface RobotbasAvatarGroupSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { Primitive } from 'reka-ui'
import { avatarGroupInjectionKey } from '../composables/useAvatarGroup'
import RobotbasAvatar from './RobotbasAvatar.vue'
import { createUiFn } from '../types'

const props = defineProps<RobotbasAvatarGroupProps>()
const slots = defineSlots<RobotbasAvatarGroupSlots>()

// const appConfig = useAppConfig() as AvatarGroup['AppConfig']

const ui = computed(() => {
  return {
    root: createUiFn(props.ui?.root || 'avatar-group'),
    base: createUiFn(props.ui?.base || 'avatar-group-base'),
  }
})
// const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.avatarGroup || {}) })({
//   size: props.size
// }))

const max = computed(() => typeof props.max === 'string' ? Number.parseInt(props.max, 10) : props.max)

const children = computed(() => {
  let children = slots.default?.()
  if (children?.length) {
    children = children.flatMap((child: any) => {
      if (typeof child.type === 'symbol') {
        // `v-if="false"` or commented node
        if (typeof child.children === 'string') {
          return
        }

        return child.children
      }

      return child
    }).filter(Boolean)
  }

  return children || []
})

const visibleAvatars = computed(() => {
  if (!children.value.length) {
    return []
  }

  if (!max.value || max.value <= 0) {
    return [...children.value].reverse()
  }

  return [...children.value].slice(0, max.value).reverse()
})

const hiddenCount = computed(() => {
  if (!children.value.length) {
    return 0
  }

  return children.value.length - visibleAvatars.value.length
})

provide(avatarGroupInjectionKey, computed(() => ({
  size: props.size
})))
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })" aria-hidden="true">
    <RobotbasAvatar v-if="hiddenCount > 0" :text="`+${hiddenCount}`" data-slot="base"
      :class="ui.base({ class: props.ui?.base })" />
    <component :is="avatar" v-for="(avatar, count) in visibleAvatars" :key="count" data-slot="base"
      :class="ui.base({ class: props.ui?.base })" />
  </Primitive>
</template>
