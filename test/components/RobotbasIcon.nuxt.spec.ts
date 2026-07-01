// @vitest-environment nuxt
import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import RobotbasIcon from '../../src/runtime/components/RobotbasIcon.vue';

describe('RobotbasIcon', () => {
  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(RobotbasIcon, {
      props: {
        name: 'fas fa-home'
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('match snapshot', async () => {
    const wrapper = await mountSuspended(RobotbasIcon, {
      props: {
        name: 'fas fa-home'
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders with correct class name', async () => {
    const wrapper = await mountSuspended(RobotbasIcon, {
      props: {
        name: 'fas fa-user'
      }
    });
    expect(wrapper.find('i').classes()).toContain('fas');
    expect(wrapper.find('i').classes()).toContain('fa-user');
  });

  it('renders different icon names', async () => {
    const wrapper = await mountSuspended(RobotbasIcon, {
      props: {
        name: 'lucide:settings'
      }
    });
    expect(wrapper.find('i').classes()).toContain('lucide:settings');
  });
});
