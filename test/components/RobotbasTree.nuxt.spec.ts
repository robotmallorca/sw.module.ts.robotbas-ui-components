// @vitest-environment nuxt
import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import RobotbasTree from '../../src/runtime/components/RobotbasTree.vue';

const mockTreeItems = [
  {
    title: 'Documents',
    icon: 'fas fa-folder',
    children: [
      { title: 'File 1.txt', icon: 'fas fa-file' },
      { title: 'File 2.txt', icon: 'fas fa-file' }
    ]
  },
  {
    title: 'Images',
    icon: 'fas fa-folder',
    children: [
      { title: 'Photo.jpg', icon: 'fas fa-image' }
    ]
  }
];

describe('RobotbasTree', () => {
  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(RobotbasTree, {
      props: {
        items: mockTreeItems
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('match snapshot', async () => {
    const wrapper = await mountSuspended(RobotbasTree, {
      props: {
        items: mockTreeItems
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders tree items', async () => {
    const wrapper = await mountSuspended(RobotbasTree, {
      props: {
        items: mockTreeItems
      }
    });
    expect(wrapper.text()).toContain('Documents');
    expect(wrapper.text()).toContain('Images');
  });

  it('renders with title', async () => {
    const wrapper = await mountSuspended(RobotbasTree, {
      props: {
        items: mockTreeItems,
        title: 'File Explorer'
      }
    });
    expect(wrapper.text()).toContain('File Explorer');
  });

  it('renders with default expanded items', async () => {
    const wrapper = await mountSuspended(RobotbasTree, {
      props: {
        items: mockTreeItems,
        defaultExpanded: ['Documents']
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with custom getKey function', async () => {
    const wrapper = await mountSuspended(RobotbasTree, {
      props: {
        items: mockTreeItems,
        getKey: (item: any) => `custom-${item.title}`
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
});
