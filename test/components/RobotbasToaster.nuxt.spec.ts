// @vitest-environment nuxt
import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import RobotbasToaster from '../../src/runtime/components/RobotbasToaster.vue';

describe('RobotbasToaster', () => {
  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(RobotbasToaster);
    expect(wrapper.exists()).toBe(true);
  });

  it('match snapshot', async () => {
    const wrapper = await mountSuspended(RobotbasToaster);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders with custom position', async () => {
    const wrapper = await mountSuspended(RobotbasToaster, {
      props: {
        position: 'top-right'
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with expand disabled', async () => {
    const wrapper = await mountSuspended(RobotbasToaster, {
      props: {
        expand: false
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with custom duration', async () => {
    const wrapper = await mountSuspended(RobotbasToaster, {
      props: {
        duration: 3000
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with progress disabled', async () => {
    const wrapper = await mountSuspended(RobotbasToaster, {
      props: {
        progress: false
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with custom max toasts', async () => {
    const wrapper = await mountSuspended(RobotbasToaster, {
      props: {
        max: 3
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders slot content', async () => {
    const wrapper = await mountSuspended(RobotbasToaster, {
      slots: {
        default: () => '<div>App Content</div>'
      }
    });
    expect(wrapper.html()).toContain('App Content');
  });
});
