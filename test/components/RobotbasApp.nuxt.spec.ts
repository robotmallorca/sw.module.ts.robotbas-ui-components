// @vitest-environment nuxt
import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import RobotbasApp from '../../src/runtime/components/RobotbasApp.vue';

describe('RobotbasApp', () => {
  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(RobotbasApp);
    expect(wrapper.exists()).toBe(true);
  });

  it('match snapshot', async () => {
    const wrapper = await mountSuspended(RobotbasApp);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders slot content', async () => {
    const wrapper = await mountSuspended(RobotbasApp, {
      slots: {
        default: () => '<div>Application Content</div>'
      }
    });
    expect(wrapper.html()).toContain('Application Content');
  });

  it('renders with toaster disabled', async () => {
    const wrapper = await mountSuspended(RobotbasApp, {
      props: {
        toaster: null
      },
      slots: {
        default: () => '<div>No Toaster</div>'
      }
    });
    expect(wrapper.html()).toContain('No Toaster');
  });

  it('renders with custom toaster props', async () => {
    const wrapper = await mountSuspended(RobotbasApp, {
      props: {
        toaster: {
          position: 'top-right',
          duration: 3000
        }
      },
      slots: {
        default: () => '<div>Content</div>'
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with custom portal target', async () => {
    const wrapper = await mountSuspended(RobotbasApp, {
      props: {
        portal: '#custom-portal'
      },
      slots: {
        default: () => '<div>Content</div>'
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with tooltip provider props', async () => {
    const wrapper = await mountSuspended(RobotbasApp, {
      props: {
        tooltip: {
          delayDuration: 200
        }
      },
      slots: {
        default: () => '<div>Content</div>'
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
});
