import { screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppLayoutNavGroup, AppLayoutNavItem, AppLayoutNavSubItem, AppLayoutNavSubmenu } from "..";
import { mockViewport, renderAppLayout, WIDE } from "./render-app-layout";

afterEach(() => vi.unstubAllGlobals());

function letterOf(name: string) {
  const control = screen.queryByRole("link", { name }) ?? screen.getByRole("button", { name });
  return control.querySelector("[data-slot=app-layout-nav-letter]")?.textContent ?? null;
}

const nav = (
  <>
    <AppLayoutNavGroup label="Main">
      <AppLayoutNavItem label="Usuarios" href="#usuarios" />
      <AppLayoutNavItem label="ítems" href="#items" />
      <AppLayoutNavItem label="🚀 Lanzamientos" href="#lanzamientos" />
      <AppLayoutNavItem
        label="Inicio"
        href="#inicio"
        icon={<svg data-testid="home-icon" />}
        badge="4"
        actions={{ label: "Más", items: [{ id: "a", label: "A", onSelect: () => {} }] }}
      />
      <AppLayoutNavItem label="Sin tooltip" href="#none" tooltip={false} />
    </AppLayoutNavGroup>
    <AppLayoutNavGroup label="Ventas">
      <AppLayoutNavSubmenu label="Documentos">
        <AppLayoutNavSubItem label="Pedidos" href="#pedidos" />
        <AppLayoutNavSubItem label="Facturas" href="#facturas" />
        <AppLayoutNavSubItem label="Presupuestos" onSelect={() => {}} />
      </AppLayoutNavSubmenu>
    </AppLayoutNavGroup>
  </>
);

describe("Collapsed presentation", () => {
  it("Letter fallback", () => {
    mockViewport(WIDE);
    renderAppLayout({ layout: { defaultOpen: false }, nav });
    const link = screen.getByRole("link", { name: "Usuarios" });
    expect(letterOf("Usuarios")).toBe("U");
    const letter = link.querySelector("[data-slot=app-layout-nav-letter]");
    expect(letter?.getAttribute("aria-hidden")).toBe("true");
    expect(link.querySelector("[data-slot=app-layout-nav-label]")?.className).toBe("sr-only");
  });

  it("Accented and emoji labels", () => {
    mockViewport(WIDE);
    renderAppLayout({ layout: { defaultOpen: false }, nav });
    expect(letterOf("ítems")).toBe("Í");
    expect(letterOf("🚀 Lanzamientos")).toBe("🚀");
  });

  it("shows the icon instead of a letter, and hides badges and actions", () => {
    mockViewport(WIDE);
    renderAppLayout({ layout: { defaultOpen: false }, nav });
    const link = screen.getByRole("link", { name: "Inicio" });
    expect(within(link).getByTestId("home-icon")).toBeTruthy();
    expect(letterOf("Inicio")).toBeNull();
    expect(document.querySelector("[data-slot=app-layout-nav-badge]")).toBeNull();
    expect(screen.queryByRole("button", { name: "Más" })).toBeNull();
  });

  it("Expanded item without icon", () => {
    mockViewport(WIDE);
    renderAppLayout({ nav });
    expect(letterOf("Usuarios")).toBeNull();
    expect(
      screen
        .getByRole("link", { name: "Usuarios" })
        .querySelector("[data-slot=app-layout-nav-label]")?.className,
    ).not.toContain("sr-only");
  });

  it("hides group titles but keeps the lists named", () => {
    mockViewport(WIDE);
    renderAppLayout({ layout: { defaultOpen: false }, nav });
    expect(screen.getByRole("list", { name: "Main" })).toBeTruthy();
    const title = document.querySelector("[data-slot=app-layout-nav-group-label]");
    expect(title?.className).toContain("sr-only");
    const groups = document.querySelectorAll("[data-slot=app-layout-nav-group]");
    expect(groups[1]?.className).toContain("not-first:border-t");
  });

  it("shows the label as a tooltip on focus while collapsed", async () => {
    mockViewport(WIDE);
    const view = renderAppLayout({ layout: { defaultOpen: false }, nav });
    await view.user.tab(); // the sidebar trigger is after the sidebar, so start from the first item
    screen.getByRole("link", { name: "Usuarios" }).focus();
    expect(await screen.findByRole("tooltip")).toBeTruthy();
    expect(screen.getByRole("tooltip").textContent).toBe("Usuarios");
  });

  it("shows no tooltip while expanded or with tooltip={false}", async () => {
    mockViewport(WIDE);
    renderAppLayout({ nav });
    screen.getByRole("link", { name: "Usuarios" }).focus();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("Collapsed submenu", async () => {
    mockViewport(WIDE);
    const view = renderAppLayout({ layout: { defaultOpen: false }, nav });
    const trigger = screen.getByRole("button", { name: "Documentos" });
    expect(letterOf("Documentos")).toBe("D");
    expect(screen.queryByRole("link", { name: "Pedidos" })).toBeNull();
    await view.user.click(trigger);
    const menu = screen.getByRole("menu");
    expect(
      within(menu)
        .getAllByRole("menuitem")
        .map((item) => item.textContent),
    ).toEqual(["Pedidos", "Facturas", "Presupuestos"]);
    expect(menu.textContent).toContain("Documentos");
    await view.user.click(within(menu).getByRole("menuitem", { name: "Facturas" }));
    expect(window.location.hash).toBe("#facturas");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("the flyout opens towards the content", async () => {
    mockViewport(WIDE);
    const ltr = renderAppLayout({ layout: { defaultOpen: false }, nav });
    await ltr.user.click(screen.getByRole("button", { name: "Documentos" }));
    expect(screen.getByRole("menu").getAttribute("data-side")).toBe("right");
    ltr.unmount();
    const rtl = renderAppLayout({
      layout: { defaultOpen: false },
      nav,
      wrapper: (node) => <div dir="rtl">{node}</div>,
    });
    await rtl.user.click(screen.getByRole("button", { name: "Documentos" }));
    expect(screen.getByRole("menu").getAttribute("data-side")).toBe("left");
  });

  it("a collapsed submenu stays active from its sub-items", () => {
    mockViewport(WIDE);
    renderAppLayout({
      layout: { defaultOpen: false, isActive: (href) => href === "#pedidos" },
      nav,
    });
    expect(screen.getByRole("button", { name: "Documentos" }).getAttribute("data-active")).toBe(
      "true",
    );
  });

  it("offcanvas keeps the expanded presentation", async () => {
    mockViewport(WIDE);
    const view = renderAppLayout({ sidebar: { collapsible: "offcanvas" }, nav });
    await view.user.click(view.trigger());
    expect(document.querySelector("[data-slot=app-layout-nav-letter]")).toBeNull();
  });
});
