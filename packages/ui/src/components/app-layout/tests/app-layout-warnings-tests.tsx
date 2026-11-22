import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AppLayout,
  AppLayoutBreadcrumb,
  AppLayoutNavGroup,
  AppLayoutNavItem,
  AppLayoutSidebar,
  AppLayoutSidebarTrigger,
  AppLayoutTopbar,
  type AppLayoutTopbarProps,
} from "..";
import { mockViewport, renderAppLayout, WIDE } from "./render-app-layout";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** Renders untyped props, as plain JavaScript would. */
const untyped = <T,>(props: Record<string, unknown>) => props as T;

describe("Development warnings", () => {
  it.each([
    [
      "triggerLabel",
      () => <AppLayoutTopbar {...untyped<AppLayoutTopbarProps>({ breadcrumbLabel: "b" })} />,
    ],
    [
      "breadcrumbLabel",
      () => <AppLayoutTopbar {...untyped<AppLayoutTopbarProps>({ triggerLabel: "t" })} />,
    ],
    ["mobileTitle", () => <AppLayoutSidebar {...untyped<{ mobileTitle: string }>({})} />],
    [
      "railLabel",
      () => (
        <AppLayoutSidebar {...untyped<{ mobileTitle: string }>({ mobileTitle: "m", rail: true })} />
      ),
    ],
    [
      "mobileCloseLabel",
      () => (
        <AppLayoutSidebar
          {...untyped<{ mobileTitle: string }>({ mobileTitle: "m", mobileCloseButton: true })}
        />
      ),
    ],
    ["label", () => <AppLayoutSidebarTrigger {...untyped<{ label: string }>({})} />],
    [
      "ellipsisLabel",
      () => <AppLayoutBreadcrumb {...untyped<{ label: string }>({ label: "b", maxItems: 3 })} />,
    ],
    [
      "`label`, its accessible name",
      () => (
        <AppLayoutNavGroup>
          <AppLayoutNavItem {...untyped<{ label: string }>({})} />
        </AppLayoutNavGroup>
      ),
    ],
    [
      "`actions` needs `label`",
      () => (
        <AppLayoutNavGroup>
          <AppLayoutNavItem
            label="x"
            actions={untyped({ items: [{ id: "a", label: "A", onSelect: () => {} }] })}
          />
        </AppLayoutNavGroup>
      ),
    ],
  ])("names %s once", (text, element) => {
    mockViewport(WIDE);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = render(<AppLayout>{element()}</AppLayout>);
    view.rerender(<AppLayout>{element()}</AppLayout>);
    const matching = warn.mock.calls.filter(([message]) => String(message).includes(text));
    expect(matching).toHaveLength(1);
    expect(String(matching[0]?.[0])).toMatch(/^AppLayout: /);
  });

  it("logs nothing when every text is given", () => {
    mockViewport(WIDE);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderAppLayout({
      sidebar: {
        rail: true,
        railLabel: "Rail",
        mobileCloseButton: true,
        mobileCloseLabel: "Close",
      },
      nav: (
        <AppLayoutNavGroup label="Main">
          <AppLayoutNavItem
            label="Docs"
            actions={{ label: "More", items: [{ id: "a", label: "A", onSelect: () => {} }] }}
          />
        </AppLayoutNavGroup>
      ),
    });
    expect(warn).not.toHaveBeenCalled();
  });
});
