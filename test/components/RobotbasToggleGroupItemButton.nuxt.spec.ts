// @vitest-environment nuxt
import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import RobotbasToggleGroupItemButton from '../../src/runtime/components/RobotbasToggleGroupItemButton.vue';
import RobotbasToggleGroup from '../../src/runtime/components/RobotbasToggleGroup.vue';
import { h } from 'vue';

describe('RobotbasToggleGroupItemButton', () => {
  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(RobotbasToggleGroup, {
      slots: {
        default: () => h(RobotbasToggleGroupItemButton, { value: 'test', label: 'Test' })
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('match snapshot', async () => {
    const wrapper = await mountSuspended(RobotbasToggleGroup, {
      slots: {
        default: () => h(RobotbasToggleGroupItemButton, { value: 'test', label: 'Test' })
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders with label', async () => {
    const wrapper = await mountSuspended(RobotbasToggleGroup, {
      slots: {
        default: () => h(RobotbasToggleGroupItemButton, { value: 'test', label: 'Toggle Me' })
      }
    });
    expect(wrapper.text()).toContain('Toggle Me');
  });

  it('renders with leading icon', async () => {
    const wrapper = await mountSuspended(RobotbasToggleGroup, {
      slots: {
        default: () => h(RobotbasToggleGroupItemButton, {
          value: 'test',
          label: 'With Icon',
          leadingIcon: 'fas fa-star'
        })
      }
    });
    expect(wrapper.find('i.fas.fa-star').exists()).toBe(true);
  });

  it('renders with badge', async () => {
    const wrapper = await mountSuspended(RobotbasToggleGroup, {
      slots: {
        default: () => h(RobotbasToggleGroupItemButton, {
          value: 'test',
          label: 'With Badge',
          badge: 5
        })
      }
    });
    expect(wrapper.html()).toContain('5');
  });
});
