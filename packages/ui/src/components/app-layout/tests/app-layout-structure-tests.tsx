import { render, renderHook, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AppLayoutMain,
  AppLayoutNav,
  AppLayoutNavGroup,
  AppLayoutNavItem,
  AppLayoutSidebar,
  AppLayoutSidebarContent,
  AppLayoutTopbar,
  AppLayoutTopbarActions,
  useAppLayoutBreadcrumb,
  useAppLayoutBreadcrumbItems,
  useAppLayoutMain,
  useAppLayoutSidebar,
} from "..";
import { mockViewport, renderAppLayout, WIDE } from "./render-app-layout";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("AppLayout structure", () => {
  it("fills the viewport without page scroll", () => {
    mockViewport(WIDE);
    renderAppLayout();
    const root = document.querySelector("[data-slot=app-layout]");
    expect(root?.className).toContain("h-svh");
    expect(root?.className).toContain("overflow-hidden");
  });

  it("Long page content: only main scrolls in the inset", () => {
    mockViewport(WIDE);
    const view = renderAppLayout({ children: <div style={{ height: 3000 }}>Long</div> });
    const main = view.main();
    expect(main.className).toContain("overflow-y-auto");
    expect(main.className).toContain("min-h-0");
    const topbar = document.querySelector("[data-slot=app-layout-topbar]");
    expect(topbar?.className).toContain("shrink-0");
    expect(topbar?.closest("main")).toBeNull();
  });

  it("Long navigation: only the sidebar content scrolls", () => {
    mockViewport(WIDE);
    renderAppLayout();
    const content = document.querySelector("[data-slot=app-layout-sidebar-content]");
    const header = document.querySelector("[data-slot=app-layout-sidebar-header]");
    const footer = document.querySelector("[data-slot=app-layout-sidebar-footer]");
    expect(content?.className).toContain("overflow-y-auto");
    expect(content?.className).toContain("min-h-0");
    expect(header?.className).toContain("shrink-0");
    expect(footer?.className).toContain("shrink-0");
    expect(header?.className).not.toContain("overflow");
  });

  it("Minimum padding: the main content box is always padded", () => {
    mockViewport(WIDE);
    renderAppLayout({ children: <span data-testid="child">child</span> });
    const box = screen.getByTestId("child").parentElement;
    expect(box?.getAttribute("data-slot")).toBe("app-layout-main-content");
    expect(box?.className).toContain("p-4");
  });

  it("is the only main landmark", () => {
    mockViewport(WIDE);
    renderAppLayout();
    expect(screen.getAllByRole("main")).toHaveLength(1);
  });

  it("renders no skip link by default", () => {
    mockViewport(WIDE);
    renderAppLayout();
    expect(document.querySelector("[data-slot=app-layout-skip-link]")).toBeNull();
  });

  it("passes className and attributes to the parts", () => {
    mockViewport(WIDE);
    renderAppLayout({
      layout: { className: "custom-root", "aria-busy": true },
      sidebar: { className: "custom-sidebar" },
      topbar: { className: "custom-topbar" },
    });
    const root = document.querySelector("[data-slot=app-layout]");
    expect(root?.className).toContain("custom-root");
    expect(root?.getAttribute("aria-busy")).toBe("true");
    expect(document.querySelector("[data-slot=app-layout-sidebar-container]")?.className).toContain(
      "custom-sidebar",
    );
    expect(document.querySelector("[data-slot=app-layout-topbar]")?.className).toContain(
      "custom-topbar",
    );
  });
});

describe("Part outside the root", () => {
  const silence = () => vi.spyOn(console, "error").mockImplementation(() => {});

  it.each([
    ["AppLayoutTopbar", () => <AppLayoutTopbar triggerLabel="t" breadcrumbLabel="b" />],
    ["AppLayoutSidebar", () => <AppLayoutSidebar mobileTitle="m" />],
    ["AppLayoutSidebarContent", () => <AppLayoutSidebarContent />],
    ["AppLayoutMain", () => <AppLayoutMain />],
    ["AppLayoutNav", () => <AppLayoutNav items={[]} />],
    ["AppLayoutNavGroup", () => <AppLayoutNavGroup />],
    ["AppLayoutNavItem", () => <AppLayoutNavItem label="x" />],
    ["AppLayoutTopbarActions", () => <AppLayoutTopbarActions />],
  ])("%s throws outside AppLayout", (name, element) => {
    silence();
    expect(() => render(element())).toThrow(`${name} must be used inside AppLayout.`);
  });

  it.each([
    ["useAppLayoutSidebar", () => useAppLayoutSidebar()],
    ["useAppLayoutBreadcrumb", () => useAppLayoutBreadcrumb()],
    ["useAppLayoutBreadcrumbItems", () => useAppLayoutBreadcrumbItems([])],
    ["useAppLayoutMain", () => useAppLayoutMain()],
  ])("Hook outside the root: %s throws", (name, hook) => {
    silence();
    expect(() => renderHook(hook)).toThrow(`${name} must be used inside AppLayout.`);
  });
});
