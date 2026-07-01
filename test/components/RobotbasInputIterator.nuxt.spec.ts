// @vitest-environment nuxt
import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { nextTick } from 'vue';
import RobotbasInputIterator from '../../src/runtime/components/RobotbasInputIterator.vue';

const valuesLabels = ['Jan', 'Feb', 'Mar'];

describe('RobotbasInputIterator', () => {
  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(RobotbasInputIterator, {
      props: {
        modelValue: 0,
        valuesLabels
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('match snapshot', async () => {
    const wrapper = await mountSuspended(RobotbasInputIterator, {
      props: {
        modelValue: 0,
        valuesLabels
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders the label for current modelValue', async () => {
    const wrapper = await mountSuspended(RobotbasInputIterator, {
      props: {
        modelValue: 1,
        valuesLabels
      }
    });
    const input = wrapper.find('input');
    expect((input.element as HTMLInputElement).value).toBe('Feb');
  });

  it('rotates when iterationMode is rotation', async () => {
    const wrapper = await mountSuspended(RobotbasInputIterator, {
      props: {
        modelValue: 2,
        valuesLabels
      }
    });
    await wrapper.find('[data-slot="trailing"]').trigger('click');
    await nextTick();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0]);
  });

  it('stops at bounds when iterationMode is limit', async () => {
    const wrapper = await mountSuspended(RobotbasInputIterator, {
      props: {
        modelValue: 0,
        iterationMode: 'limit',
        valuesLabels
      }
    });
    await wrapper.find('[data-slot="leading"]').trigger('click');
    await nextTick();
    expect(wrapper.emitted('update:modelValue') ?? []).toHaveLength(0);
  });
});

