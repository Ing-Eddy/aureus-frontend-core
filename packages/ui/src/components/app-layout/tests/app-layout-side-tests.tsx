import { act, screen } from "@testing-library/react";
import type React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { type UseAppLayoutSidebarResult, useAppLayoutSidebar } from "..";
import { mockViewport, NARROW, renderAppLayout, WIDE } from "./render-app-layout";

afterEach(() => vi.unstubAllGlobals());

function HookProbe({ onValue }: { onValue: (value: UseAppLayoutSidebarResult) => void }) {
  onValue(useAppLayoutSidebar());
  return null;
}

const rtl = (node: React.ReactNode) => <div dir="rtl">{node}</div>;

describe("Logical, changeable side", () => {
  it("Default side", () => {
    mockViewport(WIDE);
    const view = renderAppLayout();
    expect(view.sidebar()?.getAttribute("data-side")).toBe("start");
    expect(view.sidebar()?.className).toContain("order-first");
    const container = document.querySelector("[data-slot=app-layout-sidebar-container]");
    expect(container?.className).toContain("border-e");
    expect(view.trigger().querySelector("svg")?.getAttribute("class")).toContain("panel-left");
  });

  it("Right-to-left page", () => {
    mockViewport(WIDE);
    const view = renderAppLayout({ wrapper: rtl });
    // `order-first` puts the sidebar at the inline start, which is the right edge in RTL.
    expect(view.sidebar()?.className).toContain("order-first");
    expect(view.trigger().querySelector("svg")?.getAttribute("class")).toContain("panel-right");
  });

  it("Change the side from the hook", () => {
    mockViewport(WIDE);
    const onSideChange = vi.fn();
    let hook: UseAppLayoutSidebarResult | undefined;
    const view = renderAppLayout({
      layout: { onSideChange },
      children: <HookProbe onValue={(value) => (hook = value)} />,
    });
    const main = view.main();
    act(() => hook?.setSide("end"));
    expect(onSideChange).toHaveBeenCalledWith("end");
    expect(view.sidebar()?.getAttribute("data-side")).toBe("end");
    expect(view.sidebar()?.className).toContain("order-last");
    const container = document.querySelector("[data-slot=app-layout-sidebar-container]");
    expect(container?.className).toContain("border-s");
    expect(view.main()).toBe(main);
    expect(view.trigger().querySelector("svg")?.getAttribute("class")).toContain("panel-right");
  });

  it("controlled side", () => {
    mockViewport(WIDE);
    let hook: UseAppLayoutSidebarResult | undefined;
    const view = renderAppLayout({
      layout: { side: "end" },
      children: <HookProbe onValue={(value) => (hook = value)} />,
    });
    act(() => hook?.setSide("start"));
    expect(view.sidebar()?.getAttribute("data-side")).toBe("end");
  });

  it.each([
    ["start", undefined, "left"],
    ["end", undefined, "right"],
    ["start", rtl, "right"],
    ["end", rtl, "left"],
  ] as const)("the sheet of side %s opens from the physical edge", async (side, wrapper, edge) => {
    mockViewport(NARROW);
    const view = renderAppLayout({ layout: { defaultSide: side }, wrapper });
    await view.user.click(view.trigger());
    expect(screen.getByRole("dialog").getAttribute("data-side")).toBe(edge);
  });
});
