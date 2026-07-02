// @vitest-environment nuxt
import { describe, expect, it } from "vitest";

import { mountSuspended } from "@nuxt/test-utils/runtime";
import SideBarLink from "../../src/runtime/components/SideBarLink.vue";

describe("sidebar link", () => {
  it("renders without crashing", async () => {
    const wrapper = await mountSuspended(SideBarLink, {
      props: { label: "link text" },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("match snapshot", async () => {
    const component = await mountSuspended(SideBarLink, {
      props: { label: "link text" },
    });
    expect(component.html()).toMatchSnapshot();
  });

  it("link text rendered", async () => {
    const component = await mountSuspended(SideBarLink, {
      props: { label: "link text" },
    });
    expect(component.html()).toContain("link text");
  });

  describe("with trailing icon", () => {
    it("match snapshot", async () => {
      const component = await mountSuspended(SideBarLink, {
        props: { label: "link text", trailingIcon: "fas fa-chevron-down" },
      });
      expect(component.html()).toMatchSnapshot();
    });

    it("emits event on chevron click", async () => {
      const wrapper = await mountSuspended(SideBarLink, {
        props: {
          label: "link text",
          toggle: "on",
          trailingIcon: "fas fa-chevron-down",
        },
      });

      const button = wrapper.find(".fa-chevron-down");
      expect(button.exists()).toBe(true);
      await button.trigger("click");
      expect(wrapper.emitted("toggle-click")).toBeTruthy();
    });
  });
});
