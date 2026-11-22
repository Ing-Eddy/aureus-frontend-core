import { act, type RenderResult, render } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import type { ReactNode } from "react";
import { vi } from "vitest";
import {
  AppLayout,
  AppLayoutInset,
  AppLayoutMain,
  type AppLayoutProps,
  AppLayoutSidebar,
  AppLayoutSidebarContent,
  AppLayoutSidebarFooter,
  AppLayoutSidebarHeader,
  type AppLayoutSidebarProps,
  AppLayoutTopbar,
  type AppLayoutTopbarProps,
} from "..";

/**
 * A `matchMedia` driven by a settable viewport width: `(min-width: Npx)` and `(max-width: Npx)`
 * match against it, every other query is false. Changing the width notifies the listeners.
 */
export function mockViewport(initialWidth: number) {
  let width = initialWidth;
  const listeners = new Set<() => void>();
  const matches = (query: string) => {
    const min = /\(min-width:\s*(\d+)px\)/.exec(query);
    if (min) return width >= Number(min[1]);
    const max = /\(max-width:\s*(\d+)px\)/.exec(query);
    if (max) return width <= Number(max[1]);
    return false;
  };
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      media: query,
      get matches() {
        return matches(query);
      },
      onchange: null,
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
      addListener: (listener: () => void) => listeners.add(listener),
      removeListener: (listener: () => void) => listeners.delete(listener),
      dispatchEvent: () => false,
    })),
  );
  return {
    resize(next: number) {
      width = next;
      act(() => {
        for (const listener of listeners) listener();
      });
    },
  };
}

export const WIDE = 1280;
export const NARROW = 375;

export interface RenderAppLayoutOptions {
  layout?: Omit<AppLayoutProps, "children">;
  sidebar?: Partial<AppLayoutSidebarProps>;
  topbar?: Partial<AppLayoutTopbarProps>;
  /** The sidebar content (the navigation). */
  nav?: ReactNode;
  /** The main content. */
  children?: ReactNode;
  /** Wraps the layout, for example in `<div dir="rtl">`. */
  wrapper?: (layout: ReactNode) => ReactNode;
}

export interface RenderedAppLayout extends RenderResult {
  user: UserEvent;
  trigger: () => HTMLElement;
  sidebar: () => HTMLElement | null;
  main: () => HTMLElement;
}

/** A complete layout: sidebar with header, content and footer, top bar and main area. */
export function renderAppLayout({
  layout,
  sidebar,
  topbar,
  nav,
  children,
  wrapper = (node) => node,
}: RenderAppLayoutOptions = {}): RenderedAppLayout {
  const user = userEvent.setup({ pointerEventsCheck: 0 });
  const sidebarProps = { mobileTitle: "Navigation", ...sidebar } as AppLayoutSidebarProps;
  const topbarProps = {
    triggerLabel: "Toggle sidebar",
    breadcrumbLabel: "Breadcrumb",
    ...topbar,
  } as AppLayoutTopbarProps;
  const view = render(
    wrapper(
      <AppLayout {...layout}>
        <AppLayoutSidebar {...sidebarProps}>
          <AppLayoutSidebarHeader>Header</AppLayoutSidebarHeader>
          <AppLayoutSidebarContent>{nav}</AppLayoutSidebarContent>
          <AppLayoutSidebarFooter>Footer</AppLayoutSidebarFooter>
        </AppLayoutSidebar>
        <AppLayoutInset>
          <AppLayoutTopbar {...topbarProps} />
          <AppLayoutMain>{children ?? <p>Page</p>}</AppLayoutMain>
        </AppLayoutInset>
      </AppLayout>,
    ),
  );
  return {
    ...view,
    user,
    trigger: () => view.getByRole("button", { name: "Toggle sidebar", hidden: true }),
    sidebar: () => document.querySelector<HTMLElement>("[data-slot=app-layout-sidebar]"),
    main: () => view.getByRole("main", { hidden: true }),
  };
}
