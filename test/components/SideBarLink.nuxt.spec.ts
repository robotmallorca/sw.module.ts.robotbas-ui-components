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

  describe("as dropdown header", () => {
    it("renders a button with aria-expanded when it has no link", async () => {
      const component = await mountSuspended(SideBarLink, {
        props: { label: "Settings", expandable: true, open: false },
      });

      const root = component.find(".sidebarlink");
      expect(root.element.tagName).toBe("BUTTON");
      expect(root.attributes("aria-expanded")).toBe("false");
      expect(root.attributes("data-state")).toBe("closed");
    });

    it("draws its default chevron in CSS, depending on no icon pack", async () => {
      const component = await mountSuspended(SideBarLink, {
        props: { label: "Settings", expandable: true },
      });

      expect(component.find(".sidebarlink-caret").exists()).toBe(true);
      // El pack de iconos es devDependency del playground: el componente
      // publicado no puede asumirlo, así que no debe emitir clases de ninguno.
      expect(component.html()).not.toContain("fa-");
      expect(component.html()).not.toContain("bi-");
    });

    it("lets trailingIcon replace the CSS chevron", async () => {
      const component = await mountSuspended(SideBarLink, {
        props: { label: "Settings", expandable: true, trailingIcon: "fas fa-chevron-down" },
      });

      expect(component.find(".fa-chevron-down").exists()).toBe(true);
      expect(component.find(".sidebarlink-caret").exists()).toBe(false);
    });

    it("toggles from the default chevron too", async () => {
      const component = await mountSuspended(SideBarLink, {
        props: { label: "Settings", expandable: true },
      });

      await component.find(".sidebarlink-caret").trigger("click");
      expect(component.emitted("toggle-click")).toBeTruthy();
    });

    it("exposes the open state so the chevron can rotate", async () => {
      const component = await mountSuspended(SideBarLink, {
        props: { label: "Settings", expandable: true, open: true },
      });

      expect(component.find(".sidebarlink").attributes("data-state")).toBe("open");
      expect(component.find(".sidebarlink-toggle").exists()).toBe(true);
    });

    it("stays a link when it has its own route, and only the chevron toggles", async () => {
      const component = await mountSuspended(SideBarLink, {
        props: { label: "Settings", link: "/settings", expandable: true },
      });

      expect(component.find(".sidebarlink").element.tagName).toBe("A");
      await component.find(".sidebarlink-toggle").trigger("click");
      expect(component.emitted("toggle-click")).toHaveLength(1);
    });
  });

  describe("as dropdown child", () => {
    it("gets the nesting level class that draws the rail", async () => {
      const component = await mountSuspended(SideBarLink, {
        props: { label: "General", link: "/settings/general", submenu: 1 },
      });

      expect(component.find(".sidebarlink").classes()).toContain("submenu-1");
    });

    it("has no level class at root level", async () => {
      const component = await mountSuspended(SideBarLink, {
        props: { label: "General", link: "/settings/general" },
      });

      const classes = component.find(".sidebarlink").classes();
      expect(classes).not.toContain("submenu-0");
      expect(classes).not.toContain("submenu-1");
    });
  });
});
