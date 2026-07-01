// @vitest-environment nuxt
import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { h } from 'vue';
import RobotbasToggleGroup from '../../src/runtime/components/RobotbasToggleGroup.vue';
import RobotbasToggleGroupItemButton from '../../src/runtime/components/RobotbasToggleGroupItemButton.vue';

describe('RobotbasToggleGroup', () => {
  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(RobotbasToggleGroup);
    expect(wrapper.exists()).toBe(true);
  });

  it('match snapshot', async () => {
    const wrapper = await mountSuspended(RobotbasToggleGroup);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders with toggle items', async () => {
    const wrapper = await mountSuspended(RobotbasToggleGroup, {
      slots: {
        default: () => [
          h(RobotbasToggleGroupItemButton, { value: 'a', label: 'Option A' }),
          h(RobotbasToggleGroupItemButton, { value: 'b', label: 'Option B' })
        ]
      }
    });
    expect(wrapper.text()).toContain('Option A');
    expect(wrapper.text()).toContain('Option B');
  });

  it('renders with horizontal orientation by default', async () => {
    const wrapper = await mountSuspended(RobotbasToggleGroup);
    expect(wrapper.attributes('data-orientation')).toBe('horizontal');
  });

  it('renders with vertical orientation', async () => {
    const wrapper = await mountSuspended(RobotbasToggleGroup, {
      props: {
        orientation: 'vertical'
      }
    });
    expect(wrapper.attributes('data-orientation')).toBe('vertical');
  });

  it('has btn-group class by default', async () => {
    const wrapper = await mountSuspended(RobotbasToggleGroup);
    expect(wrapper.classes()).toContain('btn-group');
  });
});
