import { act, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppLayoutNavGroup, AppLayoutNavItem } from "..";
import { mockViewport, NARROW, renderAppLayout, WIDE } from "./render-app-layout";

afterEach(() => vi.unstubAllGlobals());

describe("Accessibility", () => {
  it("Sheet name: focus moves in and returns to the trigger", async () => {
    mockViewport(NARROW);
    const view = renderAppLayout({
      sidebar: { mobileTitle: "Navegación" },
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavItem label="Inicio" href="#inicio" />
        </AppLayoutNavGroup>
      ),
    });
    await view.user.click(view.trigger());
    const dialog = screen.getByRole("dialog", { name: "Navegación" });
    expect(dialog.contains(document.activeElement)).toBe(true);
    await view.user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.activeElement).toBe(view.trigger());
  });

  it("the trigger controls the desktop sidebar", () => {
    mockViewport(WIDE);
    const view = renderAppLayout();
    const controls = view.trigger().getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    expect(document.getElementById(controls ?? "")?.getAttribute("data-slot")).toBe(
      "app-layout-sidebar-container",
    );
  });

  it("collapsed items keep their accessible name", () => {
    mockViewport(WIDE);
    renderAppLayout({
      layout: { defaultOpen: false },
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavItem label="Usuarios" href="#u" />
        </AppLayoutNavGroup>
      ),
    });
    expect(screen.getByRole("link", { name: "Usuarios" })).toBeTruthy();
  });

  it("the skip link moves focus to main", async () => {
    mockViewport(WIDE);
    const view = renderAppLayout({ layout: { skipLinkLabel: "Saltar al contenido" } });
    await view.user.tab();
    const skip = screen.getByRole("link", { name: "Saltar al contenido" });
    expect(document.activeElement).toBe(skip);
    await view.user.keyboard("{Enter}");
    expect(document.activeElement).toBe(view.main());
  });

  it("the rail is named, not in the tab order and toggles", async () => {
    mockViewport(WIDE);
    const view = renderAppLayout({ sidebar: { rail: true, railLabel: "Alternar" } });
    const rail = screen.getByRole("button", { name: "Alternar" });
    expect(rail.getAttribute("tabindex")).toBe("-1");
    await view.user.click(rail);
    expect(view.sidebar()?.getAttribute("data-state")).toBe("collapsed");
  });

  it("renders no rail by default", () => {
    mockViewport(WIDE);
    renderAppLayout();
    expect(document.querySelector("[data-slot=app-layout-sidebar-rail]")).toBeNull();
  });
});

describe("Scrolling main area", () => {
  it("is a tab stop only while its content overflows", () => {
    mockViewport(WIDE);
    let overflow = false;
    const observers: Array<() => void> = [];
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          observers.push(callback);
        }
        observe() {}
        disconnect() {}
      },
    );
    const heights = vi.spyOn(HTMLElement.prototype, "scrollHeight", "get");
    heights.mockImplementation(() => (overflow ? 2000 : 0));
    const view = renderAppLayout();
    expect(view.main().getAttribute("tabindex")).toBe("-1");
    overflow = true;
    act(() => {
      for (const callback of observers) callback();
    });
    expect(view.main().getAttribute("tabindex")).toBe("0");
    heights.mockRestore();
  });
});
