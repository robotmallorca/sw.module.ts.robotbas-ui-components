<script lang="ts">
import type { IconProps } from './RobotbasIcon.vue'

export interface TreeItem {
  title: string
  icon?: IconProps['name']
  children?: TreeItem[]
  [key: string]: any
}

export interface RobotbasTreeProps {
  items: TreeItem[]
  defaultExpanded?: string[]
  getKey?: (item: TreeItem) => string
  title?: string
  class?: string
  style?: string | Record<string, any>
  ui?: {
    root?: string
    title?: string
    item?: string
    icon?: string
    label?: string
  }
}
</script>

<script setup lang="ts">
import { TreeItem as RekaTreeItem, TreeRoot } from 'reka-ui'
import RobotbasIcon from './RobotbasIcon.vue'

const props = withDefaults(defineProps<RobotbasTreeProps>(), {
  defaultExpanded: () => [],
  getKey: (item: TreeItem) => item.title
})

const slots = defineSlots<{
  title?: (props: {}) => any
  item?: (props: { item: any, isExpanded: boolean, level: number }) => any
  'item-icon'?: (props: { item: any, isExpanded: boolean, hasChildren: boolean }) => any
  'item-label'?: (props: { item: any }) => any
}>()
</script>

<template>
  <TreeRoot v-slot="{ flattenItems }" class="list-group user-select-none bg-white rounded p-2 small fw-medium"
    :class="[props.ui?.root, props.class]" :style="props.style" :items="items" :get-key="getKey"
    :default-expanded="defaultExpanded">
    <slot name="title" :title="props.title">
      <h2 v-if="props.title" class="fw-semibold fs-5 px-2 pt-1 mb-2" :class="props.ui?.title">
        {{ props.title }}
      </h2>
    </slot>

    <RekaTreeItem v-for="item in flattenItems" v-slot="{ isExpanded }" :key="item._id"
      :style="{ 'margin-left': `${item.level + 0.5}rem` }" v-bind="item.bind"
      class="list-group-item list-group-item-action d-flex align-items-center py-1 px-2 my-1 rounded border-0"
      :class="props.ui?.item">
      <slot name="item" :item="item" :is-expanded="isExpanded" :level="item.level">
        <slot name="item-icon" :item="item" :is-expanded="isExpanded" :has-children="item.hasChildren">
          <template v-if="item.hasChildren">
            <RobotbasIcon v-if="!isExpanded" name="fas fa-folder" class="me-2" style="width: 1rem; height: 1rem;"
              :class="props.ui?.icon" />
            <RobotbasIcon v-else name="fas fa-folder-open" class="me-2" style="width: 1rem; height: 1rem;"
              :class="props.ui?.icon" />
          </template>
          <RobotbasIcon v-else :name="item.value.icon || 'lucide:file'" class="me-2" style="width: 1rem; height: 1rem;"
            :class="props.ui?.icon" />
        </slot>

        <slot name="item-label" :item="item">
          <div :class="props.ui?.label">
            {{ item.value.title }}
          </div>
        </slot>
      </slot>
    </RekaTreeItem>
  </TreeRoot>
</template>

<style scoped lang="scss">
.list-group-item[data-selected="true"],
.list-group-item.active {
  background-color: var(--bs-primary-bg-subtle, #cfe2ff);
  color: var(--bs-primary-text-emphasis, #084298);
}

.list-group-item:focus,
.list-group-item:hover {
  background-color: $primary-100;
  z-index: 1;
}

.list-group-item:focus {
  outline: 2px solid $primary-500;
  outline-offset: -2px;
}
</style>
