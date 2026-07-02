
// @vitest-environment nuxt
import { describe, expect, it, vi } from "vitest";
import { mountSuspended } from '@nuxt/test-utils/runtime';
import SideBarCheckbox from "../../src/runtime/components/SideBarCheckbox.vue";



describe("SideBarCheckbox", () => {

  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(SideBarCheckbox, {
      props: {
        submenu: 0, text: "default_value"
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("match snapshot", async () => {
    const component = await mountSuspended(SideBarCheckbox, {
      props: {
        submenu: 0, text: "default_value"
      }
    });
    expect(component.html()).toMatchSnapshot();
  });

});
