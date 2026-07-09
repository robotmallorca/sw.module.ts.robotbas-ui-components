<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { TabsRootProps, TabsRootEmits } from 'reka-ui'
import type { DynamicSlots } from '../types/utils'
import { get } from '../utils'
import RobotbasBadge, { type RobotbasBadgeProps } from './RobotbasBadge.vue'


// type Tabs = ComponentConfig<typeof theme, AppConfig, 'tabs'>

export interface RobotbasTabsItem {
  label?: string
  /**
   * @IconifyIcon
   */
  icon?: string
  // avatar?: AvatarProps
  /**
   * Display a badge on the item.
   * `{ size: 'sm', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
   */
  badge?: string | number | RobotbasBadgeProps
  slot?: string
  content?: string
  /** A unique value for the tab item. Defaults to the index. */
  value?: string | number
  disabled?: boolean
  class?: any
  ui?: {
    trailingBadge?: string,
    trailingBadgeSize?: string,
  },
  [key: string]: any
}

export interface RobotbasTabsProps<T extends RobotbasTabsItem = RobotbasTabsItem> extends Pick<TabsRootProps<string | number>, 'defaultValue' | 'modelValue' | 'activationMode' | 'unmountOnHide'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  items?: T[]
  /**
   * @defaultValue 'primary'
   */
  // color?: Tabs['variants']['color']
  /**
   * @defaultValue 'pill'
   */
  // variant?: Tabs['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  // size?: Tabs['variants']['size']
  /**
   * The orientation of the tabs.
   * @defaultValue 'horizontal'
   */
  orientation?: TabsRootProps['orientation']
  /**
   * The content of the tabs, can be disabled to prevent rendering the content.
   * @defaultValue true
   */
  content?: boolean
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: string
  class?: any
  ui?: {
    root?: string,
    list?: string,
    indicator?: string,
    trigger?: string,
    content?: string,
    leadingIcon?: string,
    // leadingAvatar?: string,
    // leadingAvatarSize?: string,
    label?: string,
    trailingBadge?: string,
    trailingBadgeSize?: string,
  }
}

export interface TabsEmits extends TabsRootEmits<string | number> { }

type SlotProps<T extends RobotbasTabsItem> = (props: { item: T, index: number }) => any

export type RobotbasTabsSlots<T extends RobotbasTabsItem = RobotbasTabsItem> = {
  'leading': SlotProps<T>
  'default': SlotProps<T>
  'trailing': SlotProps<T>
  'content': SlotProps<T>
  'content-default': (props?: {}) => any
  'list-leading': (props?: {}) => any
  'list-trailing': (props?: {}) => any
} & DynamicSlots<T, undefined, { index: number }>

</script>

<script setup lang="ts" generic="T extends RobotbasTabsItem">
import { ref, type ComponentPublicInstance } from 'vue'
import { TabsRoot, TabsList, TabsIndicator, TabsTrigger, TabsContent, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'

const props = withDefaults(defineProps<RobotbasTabsProps<T>>(), {
  content: true,
  defaultValue: '0',
  orientation: 'horizontal',
  unmountOnHide: true,
  labelKey: 'label'
})
const emits = defineEmits<TabsEmits>()
const slots = defineSlots<RobotbasTabsSlots<T>>()

// const appConfig = useAppConfig() as Tabs['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'orientation', 'activationMode', 'unmountOnHide'), emits)

// const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.tabs || {}) })({
//   color: props.color,
//   variant: props.variant,
//   size: props.size,
//   orientation: props.orientation
// }))

const triggersRef = ref<ComponentPublicInstance[]>([])

defineExpose({
  triggersRef
})
</script>

<template>
  <TabsRoot v-bind="rootProps" :class="ui?.root">
    <TabsList :class="ui?.list">
      <TabsIndicator :class="ui?.indicator" />

      <slot name="list-leading" />
      <ul class="nav nav-tabs">
        <TabsTrigger v-for="(item, index) of items" :key="index" as="li" class="nav-item"
          :ref="el => (triggersRef[index] = el as ComponentPublicInstance)" :value="item.value ?? String(index)"
          :disabled="item.disabled" :class="ui?.trigger">
          <slot name="leading" :item="item" :index="index">
            <!-- <UAvatar v-else-if="item.avatar" :size="((item.ui?.leadingAvatarSize || props.ui?.leadingAvatarSize || ui?.leadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" :class="ui?.leadingAvatar({ class: [props.ui?.leadingAvatar, item.ui?.leadingAvatar] })" /> -->
          </slot>

          <span v-if="get(item, props.labelKey as string) || !!slots.default" :class="ui?.label" class="nav-link">
            <RobotbasIcon v-if="item.icon" :name="item.icon" :class="ui?.leadingIcon" class="me-1" />
            <slot :item="item" :index="index">{{ get(item, props.labelKey as string) }}</slot>
            <slot name="trailing" :item="item" :index="index">
              <RobotbasBadge v-if="item.badge !== undefined" color="neutral" variant="outline"
                :size="(item.ui?.trailingBadgeSize || props.ui?.trailingBadgeSize)"
                v-bind="(typeof item.badge === 'string' || typeof item.badge === 'number') ? { label: item.badge } : item.badge"
                :class="props.ui?.trailingBadge"
                :ui="{ base: item.ui?.trailingBadge }" />
            </slot>
          </span>


        </TabsTrigger>
      </ul>
      <slot name="list-trailing" />
    </TabsList>

    <template v-if="!!content">
      <TabsContent v-for="(item, index) of items" :key="index" :value="item.value ?? String(index)"
        :class="ui?.content">
        <slot :name="((item.slot || 'content') as keyof RobotbasTabsSlots<T>)"
          :item="(item as Extract<T, { slot: string; }>)" :index="index">
          {{ item.content }}
        </slot>
      </TabsContent>
    </template>
    <slot name="content-default"></slot>
  </TabsRoot>
</template>
