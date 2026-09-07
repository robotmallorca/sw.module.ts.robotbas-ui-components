<script lang="ts">
export interface RobotbasTopbarUI {
  root?: string
  title?: string
  icon?: string
  text?: string
  separator?: string
  trailing?: string
}

export interface RobotbasTopbarProps {
  /**
   * One segment, or several: an array renders as a breadcrumb with `/` between
   * the parts. Empty segments are dropped, so a title built from a value that
   * has not loaded yet (`[project?.name ?? '', pageTitle]`) does not leave a
   * dangling separator.
   */
  title?: string | string[]
  ui?: RobotbasTopbarUI
}

export interface RobotbasTopbarSlots {
  /** Goes in the 24×24 box to the left of the title. */
  icon(props?: object): any
  /**
   * Right-hand side of the bar. The apps put their version indicator here;
   * anything app-specific (release notes, environment badges) belongs in the
   * consumer, not in this component.
   */
  trailing(props?: object): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<RobotbasTopbarProps>(), {
  title: '',
})

defineSlots<RobotbasTopbarSlots>()

const segments = computed(() => {
  const raw = Array.isArray(props.title) ? props.title : [props.title]
  return raw.filter((segment) => typeof segment === 'string' && segment.trim() !== '')
})
</script>

<template>
  <div class="robot-top-bar" :class="ui?.root">
    <div class="top-bar-title" :class="ui?.title">
      <div class="icons-nav-robot" :class="ui?.icon">
        <slot name="icon" />
      </div>

      <template v-for="(segment, index) in segments" :key="index">
        <div v-if="index > 0" class="title-separator" :class="ui?.separator">/</div>
        <div class="title-text" :class="ui?.text">{{ segment }}</div>
      </template>
    </div>

    <div class="top-bar-trailing" :class="ui?.trailing">
      <slot name="trailing" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.robot-top-bar,
.robot-top-bar :deep(*) {
  box-sizing: border-box;
}

/* `--top-bar-height` and `--textlg-medium` are read as CSS custom properties
   with a fallback, not as SCSS variables: RobotDesk defines them, RobotAccount
   does not, and a published component cannot assume either. */
.robot-top-bar {
  background: var(--gray-50, #f0f0f3);
  padding: 0px 18px 0px 18px;
  height: var(--top-bar-height, 37px);
  position: relative;
  display: flex;
  justify-content: space-between;
}

.top-bar-title {
  display: flex;
  flex-direction: row;
  gap: 3px;
  align-items: center;
  justify-content: flex-start;
  align-self: stretch;
}

.icons-nav-robot {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-text {
  color: $gray-700;
  text-align: left;
  font: var(--textlg-medium, 500 18px/28px "Roboto", sans-serif);
  position: relative;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.title-separator {
  font: var(--textlg-medium, 500 18px/28px "Roboto", sans-serif);
  color: $gray-200;
}

.top-bar-trailing {
  display: flex;
  align-items: center;
}
</style>
