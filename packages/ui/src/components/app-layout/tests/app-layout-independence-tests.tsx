import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AppLayoutNavGroup,
  AppLayoutNavItem,
  type UseAppLayoutSidebarResult,
  useAppLayoutSidebar,
} from "..";
import { mockViewport, NARROW, renderAppLayout, WIDE } from "./render-app-layout";

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

function HookProbe({ onValue }: { onValue: (value: UseAppLayoutSidebarResult) => void }) {
  onValue(useAppLayoutSidebar());
  return null;
}

describe("Independent layout props", () => {
  it("Variant keeps collapsing", async () => {
    mockViewport(WIDE);
    const view = renderAppLayout({ sidebar: { variant: "floating" } });
    await view.user.click(view.trigger());
    expect(view.sidebar()?.getAttribute("data-collapsible")).toBe("icon");
  });

  it("side does not change variant or collapsible", () => {
    mockViewport(WIDE);
    let hook: UseAppLayoutSidebarResult | undefined;
    renderAppLayout({
      layout: { defaultSide: "end" },
      children: <HookProbe onValue={(value) => (hook = value)} />,
    });
    expect(hook?.variant).toBe("sidebar");
    expect(hook?.collapsible).toBe("icon");
  });

  it("breakpoint does not change open", () => {
    mockViewport(NARROW);
    let hook: UseAppLayoutSidebarResult | undefined;
    renderAppLayout({
      layout: { breakpoint: 1024 },
      children: <HookProbe onValue={(value) => (hook = value)} />,
    });
    expect(hook?.open).toBe(true);
  });

  it("persistKey does not bind a shortcut", () => {
    mockViewport(WIDE);
    const add = vi.spyOn(window, "addEventListener");
    renderAppLayout({ layout: { persistKey: "k" } });
    expect(add.mock.calls.some(([type]) => type === "keydown")).toBe(false);
    add.mockRestore();
  });

  it("rail does not change collapsible", () => {
    mockViewport(WIDE);
    let hook: UseAppLayoutSidebarResult | undefined;
    renderAppLayout({
      sidebar: { rail: true, railLabel: "Rail" },
      children: <HookProbe onValue={(value) => (hook = value)} />,
    });
    expect(hook?.collapsible).toBe("icon");
  });

  it("actions on an item do not change its link", () => {
    mockViewport(WIDE);
    renderAppLayout({
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavItem
            label="Docs"
            href="/docs"
            actions={{ label: "More", items: [{ id: "a", label: "A", onSelect: () => {} }] }}
          />
        </AppLayoutNavGroup>
      ),
    });
    expect(screen.getByRole("link", { name: "Docs" }).getAttribute("href")).toBe("/docs");
  });

  it("closeMobileOnNavigate does not change the desktop state", async () => {
    mockViewport(WIDE);
    const view = renderAppLayout({
      layout: { closeMobileOnNavigate: true },
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavItem label="Docs" href="#docs" />
        </AppLayoutNavGroup>
      ),
    });
    await view.user.click(screen.getByRole("link", { name: "Docs" }));
    expect(view.sidebar()?.getAttribute("data-state")).toBe("expanded");
  });

  it("Max width keeps padding", () => {
    mockViewport(WIDE);
    renderAppLayout({ children: <span data-testid="child" /> });
    const box = screen.getByTestId("child").parentElement;
    expect(box?.className).toContain("p-4");
  });

  it("the defaults are neutral", () => {
    mockViewport(WIDE);
    let hook: UseAppLayoutSidebarResult | undefined;
    renderAppLayout({ children: <HookProbe onValue={(value) => (hook = value)} /> });
    expect(hook).toMatchObject({
      open: true,
      mobileOpen: false,
      side: "start",
      variant: "sidebar",
      collapsible: "icon",
    });
    expect(localStorage.length).toBe(0);
  });
});
