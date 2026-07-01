// @vitest-environment nuxt
import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import RobotbasButton from '../../src/runtime/components/RobotbasButton.vue';

describe('RobotbasButton', () => {
  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(RobotbasButton, {
      props: {
        label: 'Click me'
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('match snapshot', async () => {
    const wrapper = await mountSuspended(RobotbasButton, {
      props: {
        label: 'Click me'
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders label text', async () => {
    const wrapper = await mountSuspended(RobotbasButton, {
      props: {
        label: 'Submit'
      }
    });
    expect(wrapper.text()).toContain('Submit');
  });

  it('renders with leading icon', async () => {
    const wrapper = await mountSuspended(RobotbasButton, {
      props: {
        label: 'Save',
        leadingIcon: 'fas fa-save'
      }
    });
    expect(wrapper.find('i.fas.fa-save').exists()).toBe(true);
  });

  it('renders with badge', async () => {
    const wrapper = await mountSuspended(RobotbasButton, {
      props: {
        label: 'Messages',
        badge: 3
      }
    });
    expect(wrapper.html()).toContain('3');
  });

  it('renders slot content instead of label', async () => {
    const wrapper = await mountSuspended(RobotbasButton, {
      props: {
        label: 'Default Label'
      },
      slots: {
        default: () => 'Custom Button Text'
      }
    });
    expect(wrapper.text()).toContain('Custom Button Text');
  });
});
