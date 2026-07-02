// @vitest-environment nuxt
import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import RobotbasSelectTree from '../../src/runtime/components/RobotbasSelectTree.vue';

const mockTreeItems = [
  {
    title: 'Category A',
    icon: 'fas fa-folder',
    children: [
      { title: 'Item A1', icon: 'fas fa-file' },
      { title: 'Item A2', icon: 'fas fa-file' }
    ]
  },
  {
    title: 'Category B',
    icon: 'fas fa-folder',
    children: [
      { title: 'Item B1', icon: 'fas fa-file' }
    ]
  }
];

describe('RobotbasSelectTree', () => {
  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(RobotbasSelectTree, {
      props: {
        items: mockTreeItems
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('match snapshot', async () => {
    const wrapper = await mountSuspended(RobotbasSelectTree, {
      props: {
        items: mockTreeItems
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders with placeholder', async () => {
    const wrapper = await mountSuspended(RobotbasSelectTree, {
      props: {
        items: mockTreeItems,
        placeholder: 'Select an item'
      }
    });
    expect(wrapper.text()).toContain('Select an item');
  });

  it('renders with disabled state', async () => {
    const wrapper = await mountSuspended(RobotbasSelectTree, {
      props: {
        items: mockTreeItems,
        disabled: true
      }
    });
    expect(wrapper.find('[data-slot="base"]').attributes('disabled')).toBeDefined();
  });

  it('renders with showIcons disabled', async () => {
    const wrapper = await mountSuspended(RobotbasSelectTree, {
      props: {
        items: mockTreeItems,
        showIcons: false
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders empty state when no items', async () => {
    const wrapper = await mountSuspended(RobotbasSelectTree, {
      props: {
        items: []
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
});
