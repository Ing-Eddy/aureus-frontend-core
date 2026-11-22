import { act, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AppLayoutNavGroup,
  AppLayoutNavItem,
  type UseAppLayoutSidebarResult,
  useAppLayoutSidebar,
} from "..";
import { mockViewport, NARROW, renderAppLayout, WIDE } from "./render-app-layout";

afterEach(() => vi.unstubAllGlobals());

/** Exposes the sidebar hook of the rendered layout. */
function HookProbe({ onValue }: { onValue: (value: UseAppLayoutSidebarResult) => void }) {
  onValue(useAppLayoutSidebar());
  return null;
}

const nav = (
  <AppLayoutNavGroup label="Main">
    <AppLayoutNavItem label="Home" href="#home" />
    <AppLayoutNavItem label="Reports" onSelect={() => {}} />
  </AppLayoutNavGroup>
);

describe("Sidebar state", () => {
  it("Uncontrolled toggle", async () => {
    mockViewport(WIDE);
    const onOpenChange = vi.fn();
    const view = renderAppLayout({ layout: { onOpenChange } });
    expect(view.sidebar()?.getAttribute("data-state")).toBe("expanded");
    expect(view.trigger().getAttribute("aria-expanded")).toBe("true");
    await view.user.click(view.trigger());
    expect(view.sidebar()?.getAttribute("data-state")).toBe("collapsed");
    expect(view.trigger().getAttribute("aria-expanded")).toBe("false");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("defaultOpen={false} starts collapsed", () => {
    mockViewport(WIDE);
    const view = renderAppLayout({ layout: { defaultOpen: false } });
    expect(view.sidebar()?.getAttribute("data-state")).toBe("collapsed");
  });

  it("Controlled state ignores the toggle", async () => {
    mockViewport(WIDE);
    const onOpenChange = vi.fn();
    const view = renderAppLayout({ layout: { open: true, onOpenChange } });
    await view.user.click(view.trigger());
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(view.sidebar()?.getAttribute("data-state")).toBe("expanded");
  });

  it("Not collapsible", () => {
    mockViewport(WIDE);
    let hook: UseAppLayoutSidebarResult | undefined;
    const view = renderAppLayout({
      sidebar: { collapsible: "none" },
      children: <HookProbe onValue={(value) => (hook = value)} />,
    });
    act(() => hook?.setOpen(false));
    expect(hook?.open).toBe(false);
    expect(hook?.state).toBe("expanded");
    expect(view.sidebar()?.getAttribute("data-state")).toBe("expanded");
    expect(view.sidebar()?.className).toContain("w-(--app-layout-sidebar-width)");
  });

  it("collapsed widths follow collapsible", async () => {
    mockViewport(WIDE);
    const icon = renderAppLayout();
    await icon.user.click(icon.trigger());
    expect(icon.sidebar()?.className).toContain(
      "w-[calc(var(--app-layout-sidebar-width-icon)+1px)]",
    );
    icon.unmount();
    const offcanvas = renderAppLayout({ sidebar: { collapsible: "offcanvas" } });
    await offcanvas.user.click(offcanvas.trigger());
    expect(offcanvas.sidebar()?.className).toContain("w-0");
    const container = document.querySelector("[data-slot=app-layout-sidebar-container]");
    expect(container?.hasAttribute("inert")).toBe(true);
  });

  it("sets the width variables", () => {
    mockViewport(WIDE);
    const view = renderAppLayout({ sidebar: { width: "20rem", collapsedWidth: "4rem" } });
    const style = view.sidebar()?.getAttribute("style") ?? "";
    expect(style).toContain("--app-layout-sidebar-width: 20rem");
    expect(style).toContain("--app-layout-sidebar-width-icon: 4rem");
  });
});

describe("Mobile sheet", () => {
  it("Narrow viewport", async () => {
    mockViewport(NARROW);
    const view = renderAppLayout({ nav });
    expect(view.sidebar()).toBeNull();
    expect(view.trigger().getAttribute("aria-expanded")).toBe("false");
    expect(view.trigger().hasAttribute("aria-controls")).toBe(false);
    await view.user.click(view.trigger());
    const dialog = screen.getByRole("dialog", { name: "Navigation" });
    expect(dialog.textContent).toContain("Home");
    expect(view.trigger().getAttribute("aria-controls")).toBe(dialog.id);
  });

  it("Navigate from the sheet", async () => {
    mockViewport(NARROW);
    const onMobileOpenChange = vi.fn();
    const view = renderAppLayout({ nav, layout: { onMobileOpenChange } });
    await view.user.click(view.trigger());
    await view.user.click(screen.getByRole("link", { name: "Home" }));
    expect(onMobileOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes after a button item too", async () => {
    mockViewport(NARROW);
    const view = renderAppLayout({ nav });
    await view.user.click(view.trigger());
    await view.user.click(screen.getByRole("button", { name: "Reports" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("Keep the sheet open", async () => {
    mockViewport(NARROW);
    const view = renderAppLayout({ nav, layout: { closeMobileOnNavigate: false } });
    await view.user.click(view.trigger());
    await view.user.click(screen.getByRole("link", { name: "Home" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("Crossing the breakpoint", async () => {
    const viewport = mockViewport(1024);
    const view = renderAppLayout();
    await view.user.click(view.trigger());
    expect(view.sidebar()?.getAttribute("data-state")).toBe("collapsed");
    viewport.resize(600);
    expect(view.sidebar()).toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();
    viewport.resize(1024);
    expect(view.sidebar()?.getAttribute("data-state")).toBe("collapsed");
  });

  it("uses a custom breakpoint", () => {
    mockViewport(900);
    const view = renderAppLayout({ layout: { breakpoint: 1024 } });
    expect(view.sidebar()).toBeNull();
  });

  it("is desktop without matchMedia", () => {
    vi.stubGlobal("matchMedia", undefined);
    const view = renderAppLayout();
    expect(view.sidebar()?.getAttribute("data-state")).toBe("expanded");
  });

  it("Toggle in mobile mode", () => {
    mockViewport(NARROW);
    let hook: UseAppLayoutSidebarResult | undefined;
    renderAppLayout({ children: <HookProbe onValue={(value) => (hook = value)} /> });
    act(() => hook?.toggle());
    expect(hook?.mobileOpen).toBe(true);
    expect(hook?.open).toBe(true);
    expect(hook?.isMobile).toBe(true);
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("controlled mobileOpen", async () => {
    mockViewport(NARROW);
    const onMobileOpenChange = vi.fn();
    const view = renderAppLayout({ layout: { mobileOpen: false, onMobileOpenChange } });
    await view.user.click(view.trigger());
    expect(onMobileOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("defaultMobileOpen opens the sheet", () => {
    mockViewport(NARROW);
    renderAppLayout({ layout: { defaultMobileOpen: true } });
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("optional close button and description", async () => {
    mockViewport(NARROW);
    const view = renderAppLayout({
      sidebar: { mobileCloseButton: true, mobileCloseLabel: "Close", mobileDescription: "Links" },
    });
    await view.user.click(view.trigger());
    const dialog = screen.getByRole("dialog", { name: "Navigation", description: "Links" });
    expect(dialog).toBeTruthy();
    await view.user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("Sidebar hook", () => {
  it("returns the state and configuration", () => {
    mockViewport(WIDE);
    let hook: UseAppLayoutSidebarResult | undefined;
    renderAppLayout({
      sidebar: { variant: "floating", collapsible: "offcanvas" },
      children: <HookProbe onValue={(value) => (hook = value)} />,
    });
    expect(hook).toMatchObject({
      state: "expanded",
      open: true,
      isMobile: false,
      mobileOpen: false,
      side: "start",
      collapsible: "offcanvas",
      variant: "floating",
    });
    act(() => hook?.toggle());
    expect(hook?.state).toBe("collapsed");
  });
});
