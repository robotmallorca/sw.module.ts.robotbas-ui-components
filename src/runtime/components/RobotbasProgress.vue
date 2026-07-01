<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { ProgressRootProps, ProgressRootEmits } from 'reka-ui'

// type Progress = ComponentConfig<typeof theme, AppConfig, 'progress'>

export interface RobotbasProgressProps extends Pick<ProgressRootProps, 'getValueLabel' | 'getValueText' | 'modelValue'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /** The maximum progress value. */
  max?: number | Array<any>
  /** Display the current progress value. */
  status?: boolean
  /** Whether the progress is visually inverted. */
  inverted?: boolean
  /**
   * @defaultValue 'md'
   */
  size?: string // Progress['variants']['size']
  /**
   * @defaultValue 'primary'
   */
  color?: string // Progress['variants']['color']
  /**
   * The orientation of the progress bar.
   * @defaultValue 'horizontal'
   */
  orientation?: string // Progress['variants']['orientation']
  /**
   * The animation of the progress bar.
   * @defaultValue 'carousel'
   */
  animation?: string // Progress['variants']['animation']
  class?: any
  ui?: {
    root?: string,
    status?: string,
    base?: string,
    indicator?: string,
    steps?: string,
    step?: string
  }
}

export interface ProgressEmits extends ProgressRootEmits { }

export type RobotbasProgressSlots = {
  status(props: { percent?: number }): any
} & {
  [key: string]: (props: { step: number }) => any
}

</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive, ProgressRoot, ProgressIndicator, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'

const props = withDefaults(defineProps<RobotbasProgressProps>(), {
  inverted: true,
  modelValue: null,
  orientation: 'horizontal',
  ui: () => ({
    root: '',
    status: 'ProgressStatus',
    base: 'ProgressRoot',
    indicator: 'ProgressIndicator',
    steps: 'ProgressSteps',
    step: 'ProgressStep'
  })
})
const emits = defineEmits<ProgressEmits>()
const slots = defineSlots<RobotbasProgressSlots>()

// const { dir } = useLocale()
const appConfig = useAppConfig()

const rootProps = useForwardPropsEmits(reactivePick(props, 'getValueLabel', 'getValueText', 'modelValue'), emits)

const isIndeterminate = computed(() => rootProps.value.modelValue === null)
const hasSteps = computed(() => Array.isArray(props.max))

const realMax = computed(() => {
  if (isIndeterminate.value || !props.max) {
    return undefined
  }

  if (Array.isArray(props.max)) {
    return props.max.length - 1
  }

  return Number(props.max)
})

const percent = computed(() => {
  if (isIndeterminate.value) {
    return undefined
  }

  switch (true) {
    case rootProps.value.modelValue! < 0: return 0
    case rootProps.value.modelValue! > (realMax.value ?? 100): return 100
    default: return Math.round((rootProps.value.modelValue! / (realMax.value ?? 100)) * 100)
  }
})

const indicatorStyle = computed(() => {
  if (percent.value === undefined) {
    return
  }

  if (props.orientation === 'vertical') {
    return {
      transform: `translateY(${props.inverted ? '' : '-'}${100 - percent.value}%)`
    }
  } else {
    // if (dir.value === 'rtl') {
    // console.log(`translateX(${props.inverted ? '-' : ''}${100 - percent.value}%)`)
    return {
      transform: `translateX(${props.inverted ? '-' : ''}${100 - percent.value}%) !important`
    }
    // } else {
    // console.log(`translateX(${props.inverted ? '' : '-'}${100 - percent.value}%)`)
    // return {
    //   transform: `translateX(${props.inverted ? '' : '-'}${100 - percent.value}%)`
    // }
    // }
  }
})

const statusStyle = computed(() => {
  const value = `${Math.max(percent.value ?? 0, 0)}%`
  return props.orientation === 'vertical' ? { height: value } : { width: value }
})

function isActive(index: number) {
  return index === Number(props.modelValue)
}

function isFirst(index: number) {
  return index === 0
}

function isLast(index: number) {
  return index === realMax.value
}

function stepVariant(index: number | string) {
  index = Number(index)

  if (isActive(index) && !isFirst(index)) {
    return 'active'
  }

  if (isFirst(index) && isActive(index)) {
    return 'first'
  }

  if (isLast(index) && isActive(index)) {
    return 'last'
  }

  return 'other'
}

// const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.progress || {}) })({
//   animation: props.animation,
//   size: props.size,
//   color: props.color,
//   orientation: props.orientation,
//   inverted: props.inverted
// }))
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root" :class="ui.root">
    <div v-if="!isIndeterminate && (status || !!slots.status)" data-slot="status" :class="ui.status"
      :style="statusStyle">
      <slot name="status" :percent="percent">
        {{ percent }}%
      </slot>
    </div>

    <ProgressRoot v-bind="rootProps" :max="realMax" data-slot="base" :class="ui.base" style="transform: translateZ(0)">
      <ProgressIndicator data-slot="indicator" :class="ui.indicator" :style="indicatorStyle" />
    </ProgressRoot>

    <div v-if="hasSteps" data-slot="steps" :class="ui.steps">
      <div v-for="(step, index) in max" :key="index" data-slot="step" :class="ui.step">
        <slot :name="`step-${index}`" :step="step">
          {{ step }}
        </slot>
      </div>
    </div>
  </Primitive>
</template>

<style lang="scss">
.ProgressRoot {
  position: relative;
  overflow: hidden;
  background: $primary-500;
  border-radius: $robotbas-border-radius-default;
  // width: 300px;
  height: 5px;

  /* Fix overflow clipping in Safari */
  /* https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0 */
  transform: translateZ(0);
}

.ProgressIndicator {
  background-color: white;
  width: 100%;
  height: 100%;
  transition: transform 660ms cubic-bezier(0.65, 0, 0.35, 1);
}
</style>
