import { inject, provide, computed } from 'vue'
import type { ComputedRef, InjectionKey } from 'vue'
import type { RobotbasAvatarGroupProps } from '../components/RobotbasAvatarGroup.vue'

export const avatarGroupInjectionKey: InjectionKey<ComputedRef<{ size: RobotbasAvatarGroupProps['size'] }>> = Symbol('nuxt-ui.avatar-group')

export function useAvatarGroup(props: { size: RobotbasAvatarGroupProps['size'] }) {
  const avatarGroup = inject(avatarGroupInjectionKey, undefined)

  const size = computed(() => props.size ?? avatarGroup?.value.size)
  provide(avatarGroupInjectionKey, computed(() => ({ size: size.value })))

  return {
    size
  }
}
