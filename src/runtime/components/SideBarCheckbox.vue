<script setup lang="ts">
import { ref, watch } from "vue";

interface SideBarCheckboxProps {
  submenu: 0 | 1 | 2;
  text: string;
  modelValue?: boolean;
  elementId?: string;
  textBold?: boolean;
}

const props = withDefaults(defineProps<SideBarCheckboxProps>(), {
  submenu: 0,
  textBold: false
});
const emit = defineEmits(['update:modelValue', 'value-changed'])
const isSelected = ref(props.modelValue)

watch(isSelected, (newValue, oldValue) => {
  emit('value-changed', props.elementId, newValue)
})
watch(() => props.modelValue, (newValue) => {
  isSelected.value = newValue
})
</script>

<template>
  <div class="sidebar-checkbox"
    :class="{ 'selected': isSelected, 'submenu-1': submenu == 1, 'submenu-2': submenu == 2 }">
    <div class="form-check">
      <input v-model="isSelected" class="form-check-input" type="checkbox" value="" :id="elementId">
      <label class="form-check-label sidebar-checkbox-label" :class="{ 'text-bold': textBold }" :for="elementId">
        <slot>{{ text }}</slot>
      </label>
    </div>
  </div>
</template>

<style lang="scss">
.sidebar-checkbox {
  background: $white;
  border-radius: 8px;
  padding: 0px 12px 0px 16px;
  display: flex;
  flex-direction: row;
  gap: 27px;
  align-items: center;
  justify-content: flex-start;
  width: 178px;
  position: relative;
  overflow: hidden;
}

.sidebar-checkbox-label {
  color: $gray-600;
  text-align: left;
  font: $textmd-regular;
  position: relative;
}

.sidebar-checkbox-label.text-bold {
  color: $gray-700;
  font: $textmd-bold;
}

/* variant styles */
.sidebar-checkbox.selected .sidebar-checkbox-label {
  color: $primary-500;
}

.sidebar-checkbox:hover .sidebar-checkbox-label {
  color: $primary-700;
}

.sidebar-checkbox.submenu-1 {
  padding: 0px 12px 0px 32px;
}

.sidebar-checkbox.submenu-2 {
  padding: 0px 12px 0px 48px;
}
</style>
