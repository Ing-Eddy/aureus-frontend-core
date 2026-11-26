import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type React from "react";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AppLayout,
  AppLayoutNav,
  type AppLayoutNavEntry,
  AppLayoutNavGroup,
  AppLayoutNavItem,
  AppLayoutNavSeparator,
  AppLayoutNavSkeleton,
  AppLayoutNavSubItem,
  AppLayoutNavSubmenu,
} from "..";
import { mockViewport, renderAppLayout, WIDE } from "./render-app-layout";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Navigation items", () => {
  it("Clickable item", async () => {
    mockViewport(WIDE);
    const onSelect = vi.fn();
    const view = renderAppLayout({
      nav: (
        <AppLayoutNavGroup label="Main">
          <AppLayoutNavItem label="Inicio" href="#inicio" onSelect={onSelect} />
        </AppLayoutNavGroup>
      ),
    });
    const item = screen.getByRole("link", { name: "Inicio" }).closest("li");
    expect(item && within(item).getAllByRole("link")).toHaveLength(1);
    expect(item && within(item).queryByRole("button")).toBeNull();
    await view.user.click(screen.getByRole("link", { name: "Inicio" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(window.location.hash).toBe("#inicio");
  });

  it("is a button without href", async () => {
    mockViewport(WIDE);
    const onSelect = vi.fn();
    const view = renderAppLayout({
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavItem label="Refresh" onSelect={onSelect} />
        </AppLayoutNavGroup>
      ),
    });
    await view.user.click(screen.getByRole("button", { name: "Refresh" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("Item with actions", async () => {
    mockViewport(WIDE);
    const onRename = vi.fn();
    const onItem = vi.fn();
    const view = renderAppLayout({
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavItem
            label="Proyecto"
            href="#proyecto"
            onSelect={onItem}
            actions={{
              label: "Más acciones",
              items: [
                { id: "rename", label: "Renombrar", onSelect: onRename },
                { id: "hidden", label: "Oculta", hidden: true, onSelect: () => {} },
                {
                  id: "delete",
                  label: "Borrar",
                  variant: "destructive",
                  disabled: true,
                  onSelect: () => {},
                },
              ],
            }}
          />
        </AppLayoutNavGroup>
      ),
    });
    await view.user.click(screen.getByRole("button", { name: "Más acciones" }));
    const menu = screen.getByRole("menu");
    expect(
      within(menu)
        .getAllByRole("menuitem")
        .map((item) => item.textContent),
    ).toEqual(["Renombrar", "Borrar"]);
    await view.user.click(within(menu).getByRole("menuitem", { name: "Renombrar" }));
    expect(onRename).toHaveBeenCalledTimes(1);
    expect(onItem).not.toHaveBeenCalled();
  });

  it("shows no actions button when every action is hidden", () => {
    mockViewport(WIDE);
    renderAppLayout({
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavItem
            label="Proyecto"
            actions={{
              label: "Más",
              items: [{ id: "a", label: "A", hidden: true, onSelect: () => {} }],
            }}
          />
        </AppLayoutNavGroup>
      ),
    });
    expect(screen.queryByRole("button", { name: "Más" })).toBeNull();
  });

  it("showActionsOnHover only adds the hover classes", () => {
    mockViewport(WIDE);
    renderAppLayout({
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavItem
            label="Uno"
            actions={{
              label: "Acciones uno",
              items: [{ id: "a", label: "A", onSelect: () => {} }],
            }}
          />
          <AppLayoutNavItem
            label="Dos"
            showActionsOnHover
            actions={{
              label: "Acciones dos",
              items: [{ id: "a", label: "A", onSelect: () => {} }],
            }}
          />
        </AppLayoutNavGroup>
      ),
    });
    expect(screen.getByRole("button", { name: "Acciones uno" }).className).not.toContain(
      "pointer-fine:opacity-0",
    );
    expect(screen.getByRole("button", { name: "Acciones dos" }).className).toContain(
      "pointer-fine:opacity-0",
    );
  });

  it("marks the active item from active and from isActive", () => {
    mockViewport(WIDE);
    renderAppLayout({
      layout: { isActive: (href) => href === "/b" },
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavItem label="A" href="/a" />
          <AppLayoutNavItem label="B" href="/b" />
          <AppLayoutNavItem label="C" href="/c" active />
          <AppLayoutNavItem label="D" href="/b" active={false} />
        </AppLayoutNavGroup>
      ),
    });
    const current = (name: string) =>
      screen.getByRole("link", { name }).getAttribute("aria-current");
    expect(current("A")).toBeNull();
    expect(current("B")).toBe("page");
    expect(current("C")).toBe("page");
    expect(current("D")).toBeNull();
  });

  it("disabled items cannot be chosen", async () => {
    mockViewport(WIDE);
    const onSelect = vi.fn();
    const view = renderAppLayout({
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavItem label="Locked" href="/locked" disabled onSelect={onSelect} />
        </AppLayoutNavGroup>
      ),
    });
    const button = screen.getByRole("button", { name: "Locked" });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(screen.queryByRole("link", { name: "Locked" })).toBeNull();
    await view.user.click(button);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("renders a badge outside the accessible name", () => {
    mockViewport(WIDE);
    renderAppLayout({
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavItem label="Inbox" href="/inbox" badge="12" />
        </AppLayoutNavGroup>
      ),
    });
    expect(screen.getByRole("link", { name: "Inbox" })).toBeTruthy();
    expect(document.querySelector("[data-slot=app-layout-nav-badge]")?.textContent).toBe("12");
  });

  it("asChild renders the consumer's element with the icon and label", () => {
    mockViewport(WIDE);
    renderAppLayout({
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavItem label="Custom" icon={<svg data-testid="icon" />} active asChild>
            {/* biome-ignore lint/a11y/useAnchorContent: the item fills the content. */}
            <a href="/custom" data-router="yes" />
          </AppLayoutNavItem>
        </AppLayoutNavGroup>
      ),
    });
    const link = screen.getByRole("link", { name: "Custom" });
    expect(link.getAttribute("data-router")).toBe("yes");
    expect(link.getAttribute("aria-current")).toBe("page");
    expect(within(link).getByTestId("icon")).toBeTruthy();
  });

  it("separators are list items inside a group and divs outside", () => {
    mockViewport(WIDE);
    renderAppLayout({
      nav: (
        <>
          <AppLayoutNavGroup>
            <AppLayoutNavItem label="A" />
            <AppLayoutNavSeparator />
          </AppLayoutNavGroup>
          <AppLayoutNavSeparator />
        </>
      ),
    });
    const separators = document.querySelectorAll("[data-slot=app-layout-nav-separator]");
    expect([...separators].map((node) => node.tagName)).toEqual(["LI", "DIV"]);
  });

  it("skeletons render the same markup every time", () => {
    mockViewport(WIDE);
    const markup = () => {
      const view = render(
        <AppLayout>
          <AppLayoutNavGroup>
            <AppLayoutNavSkeleton showIcon />
            <AppLayoutNavSkeleton width="40%" />
          </AppLayoutNavGroup>
        </AppLayout>,
      );
      const html = view.container.innerHTML;
      view.unmount();
      return html;
    };
    const first = markup();
    expect(markup()).toBe(first);
    expect(first).toContain("--app-layout-skeleton-width: 40%");
  });
});

const navigate = vi.fn();

/** Like a router's link: runs the received handler, then navigates unless it was prevented. */
function RouterLink({ to, onClick, children, ...rest }: ComponentProps<"a"> & { to: string }) {
  return (
    <a
      {...rest}
      href={to}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

describe("asChild with a router link", () => {
  beforeEach(() => navigate.mockClear());

  it("marks a disabled item and sub-item, and never activates them", async () => {
    mockViewport(WIDE);
    const onSelect = vi.fn();
    const onClick = vi.fn();
    const view = renderAppLayout({
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavItem label="Billing" disabled asChild onSelect={onSelect}>
            <RouterLink to="/billing" onClick={onClick} />
          </AppLayoutNavItem>
          <AppLayoutNavSubmenu label="Sales" defaultOpen>
            <AppLayoutNavSubItem label="Reports" disabled asChild onSelect={onSelect}>
              <RouterLink to="/reports" onClick={onClick} />
            </AppLayoutNavSubItem>
          </AppLayoutNavSubmenu>
        </AppLayoutNavGroup>
      ),
    });
    for (const name of ["Billing", "Reports"]) {
      const link = screen.getByRole("link", { name });
      expect(link.getAttribute("aria-disabled")).toBe("true");
      expect(link.tabIndex).toBe(-1);
      // `fireEvent` returns false when the default, the browser's navigation, was prevented.
      expect(fireEvent.click(link)).toBe(false);
      await view.user.click(link);
    }
    expect(navigate).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it.each([
    ["pointer", false],
    ["keyboard", true],
  ])("navigates from the collapsed flyout with the %s", async (_, keyboard) => {
    mockViewport(WIDE);
    const onSelect = vi.fn();
    const view = renderAppLayout({
      layout: { defaultOpen: false },
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavSubmenu label="Sales">
            <AppLayoutNavSubItem label="Reports" active asChild onSelect={onSelect}>
              <RouterLink to="/reports" />
            </AppLayoutNavSubItem>
          </AppLayoutNavSubmenu>
        </AppLayoutNavGroup>
      ),
    });
    await view.user.click(screen.getByRole("button", { name: "Sales" }));
    const entry = screen.getByRole("menuitem", { name: "Reports" });
    expect(entry.getAttribute("href")).toBe("/reports");
    expect(entry.getAttribute("aria-current")).toBe("page");
    if (keyboard) {
      act(() => entry.focus());
      await view.user.keyboard("{Enter}");
    } else await view.user.click(entry);
    expect(navigate).toHaveBeenCalledExactlyOnceWith("/reports");
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("does not navigate from a disabled flyout entry", async () => {
    mockViewport(WIDE);
    const view = renderAppLayout({
      layout: { defaultOpen: false },
      nav: (
        <AppLayoutNavGroup>
          <AppLayoutNavSubmenu label="Sales">
            <AppLayoutNavSubItem label="Reports" disabled asChild>
              <RouterLink to="/reports" />
            </AppLayoutNavSubItem>
          </AppLayoutNavSubmenu>
        </AppLayoutNavGroup>
      ),
    });
    await view.user.click(screen.getByRole("button", { name: "Sales" }));
    const entry = screen.getByRole("menuitem", { name: "Reports" });
    expect(entry.getAttribute("aria-disabled")).toBe("true");
    expect(fireEvent.click(entry)).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });
});

describe("Groups", () => {
  it("names the list with its title", () => {
    mockViewport(WIDE);
    renderAppLayout({
      nav: (
        <AppLayoutNavGroup label="Ventas">
          <AppLayoutNavItem label="Orders" />
        </AppLayoutNavGroup>
      ),
    });
    expect(screen.getByRole("list", { name: "Ventas" })).toBeTruthy();
  });

  it("a collapsible group toggles its rows", async () => {
    mockViewport(WIDE);
    const view = renderAppLayout({
      nav: (
        <AppLayoutNavGroup label="Ventas" collapsible>
          <AppLayoutNavItem label="Orders" />
        </AppLayoutNavGroup>
      ),
    });
    const title = screen.getByRole("button", { name: "Ventas" });
    expect(title.getAttribute("aria-expanded")).toBe("true");
    await view.user.click(title);
    expect(title.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("button", { name: "Orders" })).toBeNull();
    await view.user.click(title);
    expect(screen.getByRole("button", { name: "Orders" })).toBeTruthy();
  });

  it("defaultOpen={false} starts closed", () => {
    mockViewport(WIDE);
    renderAppLayout({
      nav: (
        <AppLayoutNavGroup label="Ventas" collapsible defaultOpen={false}>
          <AppLayoutNavItem label="Orders" />
        </AppLayoutNavGroup>
      ),
    });
    expect(screen.queryByRole("button", { name: "Orders" })).toBeNull();
  });
});

describe("Submenus", () => {
  const submenu = (props: Partial<React.ComponentProps<typeof AppLayoutNavSubmenu>> = {}) => (
    <AppLayoutNavGroup>
      <AppLayoutNavSubmenu label="Ventas" {...props}>
        <AppLayoutNavSubItem label="Pedidos" href="/pedidos" />
        <AppLayoutNavSubItem label="Facturas" href="/facturas" />
      </AppLayoutNavSubmenu>
    </AppLayoutNavGroup>
  );

  it("expands and collapses", async () => {
    mockViewport(WIDE);
    const onOpenChange = vi.fn();
    const view = renderAppLayout({ nav: submenu({ onOpenChange }) });
    const trigger = screen.getByRole("button", { name: "Ventas" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("link", { name: "Pedidos" })).toBeNull();
    await view.user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("link", { name: "Pedidos" })).toBeTruthy();
    await view.user.click(trigger);
    expect(screen.queryByRole("link", { name: "Pedidos" })).toBeNull();
  });

  it("Submenu with an active child", () => {
    mockViewport(WIDE);
    renderAppLayout({ layout: { isActive: (href) => href === "/facturas" }, nav: submenu() });
    const trigger = screen.getByRole("button", { name: "Ventas" });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("data-active")).toBe("true");
    expect(screen.getByRole("link", { name: "Facturas" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("opens when a child becomes active later", () => {
    mockViewport(WIDE);
    const view = renderAppLayout({ nav: submenu() });
    expect(screen.getByRole("button", { name: "Ventas" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
    view.rerender(<AppLayout isActive={(href) => href === "/pedidos"}>{submenu()}</AppLayout>);
    expect(screen.getByRole("button", { name: "Ventas" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("a controlled submenu ignores the toggle and the active child", async () => {
    mockViewport(WIDE);
    const onOpenChange = vi.fn();
    const view = renderAppLayout({
      layout: { isActive: (href) => href === "/facturas" },
      nav: submenu({ open: false, onOpenChange }),
    });
    const trigger = screen.getByRole("button", { name: "Ventas" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await view.user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("Configuration-driven navigation", () => {
  const config: AppLayoutNavEntry[] = [
    { type: "item", id: "home", label: "Inicio", href: "/" },
    {
      type: "group",
      id: "sales",
      label: "Ventas",
      items: [
        { type: "item", id: "orders", label: "Pedidos", href: "/pedidos", badge: "3" },
        { type: "separator", id: "sep" },
        {
          type: "submenu",
          id: "docs",
          label: "Documentos",
          items: [
            { id: "invoices", label: "Facturas", href: "/facturas" },
            { id: "quotes", label: "Presupuestos", href: "/presupuestos", hidden: true },
          ],
        },
      ],
    },
    {
      type: "group",
      id: "admin",
      label: "Admin",
      hidden: true,
      items: [{ type: "item", id: "users", label: "Usuarios", href: "/usuarios" }],
    },
    {
      type: "group",
      id: "empty",
      label: "Vacío",
      items: [{ type: "item", id: "ghost", label: "Fantasma", hidden: true }],
    },
  ];

  const jsx = (
    <nav data-slot="app-layout-nav">
      <AppLayoutNavGroup>
        <AppLayoutNavItem label="Inicio" href="/" />
      </AppLayoutNavGroup>
      <AppLayoutNavGroup label="Ventas">
        <AppLayoutNavItem label="Pedidos" href="/pedidos" badge="3" />
        <AppLayoutNavSeparator />
        <AppLayoutNavSubmenu label="Documentos">
          <AppLayoutNavSubItem label="Facturas" href="/facturas" />
        </AppLayoutNavSubmenu>
      </AppLayoutNavGroup>
    </nav>
  );

  /** The markup without generated ids, which differ between renders. */
  const normalized = (node: Element) =>
    node.outerHTML.replace(/(id|aria-labelledby|aria-controls)="[^"]*"/g, '$1=""');

  it("Same output as JSX", () => {
    mockViewport(WIDE);
    const fromConfig = render(
      <AppLayout>
        <AppLayoutNav items={config} />
      </AppLayout>,
    );
    const configHtml = normalized(fromConfig.container.querySelector("nav") as Element);
    fromConfig.unmount();
    const fromJsx = render(<AppLayout>{jsx}</AppLayout>);
    expect(normalized(fromJsx.container.querySelector("nav") as Element)).toBe(configHtml);
  });

  it("Role filtering", () => {
    mockViewport(WIDE);
    render(
      <AppLayout>
        <AppLayoutNav items={config} />
      </AppLayout>,
    );
    expect(screen.queryByText("Admin")).toBeNull();
    expect(screen.queryByText("Usuarios")).toBeNull();
    expect(screen.queryByText("Vacío")).toBeNull();
    // The untitled group and "Ventas"; the closed submenu list is hidden.
    expect(screen.getAllByRole("list")).toHaveLength(2);
  });

  it("warns about duplicate ids", () => {
    mockViewport(WIDE);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <AppLayout>
        <AppLayoutNav
          items={[
            { type: "item", id: "a", label: "A" },
            {
              type: "submenu",
              id: "b",
              label: "B",
              items: [{ id: "a", label: "Again" }],
            },
          ]}
        />
      </AppLayout>,
    );
    expect(warn).toHaveBeenCalledWith("AppLayout: AppLayoutNav has duplicate ids: a.");
  });
});
