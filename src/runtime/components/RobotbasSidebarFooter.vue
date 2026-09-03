<script lang="ts">
export interface RobotbasSidebarFooterUI {
  root?: string
  user?: string
  trigger?: string
  avatar?: string
  text?: string
  name?: string
  subtitle?: string
  menu?: string
}

export interface RobotbasSidebarFooterProps {
  /** Main line of the user block. */
  name?: string
  /** Second, dimmer line (the role in both apps). */
  subtitle?: string
  avatarUrl?: string
  avatarAlt?: string
  /**
   * Collapsed state: hides the two text lines and centres the avatar.
   *
   * Feed it from the sidebar's own slot prop, `#footer="{ compact }"`. It is
   * NOT injected: slot content resolves `inject` against the component that
   * OWNS the markup, not against the one that renders the `<slot/>`, so an
   * injected value would silently never arrive.
   */
  compact?: boolean
  /** Draw an `<hr>` above the user block. */
  separator?: boolean
  /** Width of that `<hr>` while expanded / compact. */
  separatorWidth?: number
  compactSeparatorWidth?: number
  ui?: RobotbasSidebarFooterUI
}

export interface RobotbasSidebarFooterSlots {
  /** The `<li>` items of the dropdown. `close` dismisses it. */
  default(props: { close: () => void, compact: boolean }): any
  separator(props: { compact: boolean }): any
  /**
   * Last child of the footer. Both apps hang their feedback modal here, which
   * keeps the consumer single-rooted (a fragment would break `wrapper.classes()`
   * in their tests, and any class the parent puts on the component).
   */
  append(props: { compact: boolean }): any
  avatar(props: { compact: boolean }): any
  /** Replaces the two text lines next to the avatar. */
  user(props: { compact: boolean }): any
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

withDefaults(defineProps<RobotbasSidebarFooterProps>(), {
  // Never leave the `<img>` without an `alt`: both apps feed it a username that
  // may not have loaded yet, and a missing attribute is an a11y violation.
  avatarAlt: '',
  compact: false,
  separator: false,
  separatorWidth: 178,
  compactSeparatorWidth: 50,
})

defineSlots<RobotbasSidebarFooterSlots>()

// The dropdown is driven here rather than by `data-bs-toggle`: the module can
// assume Bootstrap's CSS (the consumer loads it) but not its JS bundle, and
// without popper the menu would never be placed. See the CSS below.
const userEl = ref<HTMLElement | null>(null)
const open = ref(false)

onClickOutside(userEl, () => {
  open.value = false
})

function close() {
  open.value = false
}
</script>

<template>
  <div class="sidebar-footer" :class="[{ compact }, ui?.root]">
    <slot name="separator" :compact="compact">
      <hr v-if="separator" :width="compact ? compactSeparatorWidth : separatorWidth">
    </slot>

    <div ref="userEl" class="user btn-group dropend" :class="ui?.user">
      <div
        class="link-profile dropdown-toggle"
        :class="ui?.trigger"
        role="button"
        :aria-expanded="open"
        @click="open = !open"
      >
        <slot name="avatar" :compact="compact">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            :alt="avatarAlt"
            width="31"
            height="31"
            class="rounded-circle"
            :class="ui?.avatar"
          >
        </slot>

        <div class="text-and-supporting-text" :class="ui?.text">
          <slot name="user" :compact="compact">
            <div class="text2" :class="ui?.name">{{ name }}</div>
            <div class="supporting-text" :class="ui?.subtitle">{{ subtitle }}</div>
          </slot>
        </div>
      </div>

      <ul
        class="dropdown-menu"
        :class="[{ show: open }, ui?.menu]"
        style="z-index: 9999;"
      >
        <slot :close="close" :compact="compact" />
      </ul>
    </div>

    <slot name="append" :compact="compact" />
  </div>
</template>

<style lang="scss" scoped>
/* `:deep` and not a plain descendant selector: the dropdown items arrive
   through the slot, so they carry the CONSUMER's scope id, not this one. */
.user :deep(*) {
  text-decoration: none;
}

.sidebar-footer,
.sidebar-footer :deep(*) {
  box-sizing: border-box;
}

.sidebar-footer {
  padding: 0px 16px 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  align-self: stretch;
  flex-shrink: 0;
  position: relative;
}

.sidebar-footer.compact .text-and-supporting-text {
  display: none;
}

.sidebar-footer.compact .user {
  justify-content: center;
}

.user {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  flex-shrink: 0;
  position: relative;
}

.link-profile {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

// Bootstrap's dropdown JS is not loaded (the trigger lives in this component),
// so popper never places the menu: `dropend` is reproduced by hand.
.user .dropdown-menu {
  top: auto;
  bottom: 0;
  right: auto;
  left: 100%;
  margin-left: var(--bs-dropdown-spacer);
}

.text-and-supporting-text {
  display: flex;
  flex-direction: column;
  gap: 0px;
  align-items: flex-start;
  justify-content: flex-start;
  flex-shrink: 0;
  position: relative;
}

.text2 {
  color: var(--gray-900, #1a1c1e);
  text-align: left;
  font: var(--textsm-semibold, 600 14px/20px "Roboto", sans-serif);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100px;
}

.supporting-text {
  color: var(--gray-500, #75777a);
  text-align: left;
  font: var(--textsm-regular, 400 14px/20px "Roboto", sans-serif);
  position: relative;
}

.sidebar-footer hr {
  color: $gray-200;
}
</style>
