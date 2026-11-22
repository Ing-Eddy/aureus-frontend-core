import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AppLayout,
  AppLayoutBreadcrumb,
  type AppLayoutLinkProps,
  AppLayoutNavGroup,
  AppLayoutNavItem,
  AppLayoutNavSubItem,
  AppLayoutNavSubmenu,
} from "..";
import { mockViewport, WIDE } from "./render-app-layout";

afterEach(() => vi.unstubAllGlobals());

/** A stand-in for a router link: it records the target and never reloads the document. */
function fakeRouter() {
  const visits: string[] = [];
  const renderLink = ({ href, onClick, ...props }: AppLayoutLinkProps) => (
    <a
      {...props}
      href={href}
      data-router-link=""
      onClick={(event) => {
        onClick?.(event);
        event.preventDefault();
        visits.push(href);
      }}
    />
  );
  return { visits, renderLink };
}

describe("Router-agnostic links", () => {
  it("React Router link: every link goes through renderLink", async () => {
    mockViewport(WIDE);
    const router = fakeRouter();
    const user = userEvent.setup();
    render(
      <AppLayout
        renderLink={router.renderLink}
        defaultBreadcrumb={[{ label: "Ventas", href: "/ventas" }, { label: "Hoy" }]}
      >
        <AppLayoutBreadcrumb label="Breadcrumb" />
        <AppLayoutNavGroup>
          <AppLayoutNavItem label="Pedidos" href="/ventas/pedidos" active />
          <AppLayoutNavSubmenu label="Docs" defaultOpen>
            <AppLayoutNavSubItem label="Facturas" href="/facturas" />
          </AppLayoutNavSubmenu>
        </AppLayoutNavGroup>
      </AppLayout>,
    );
    for (const link of screen.getAllByRole("link")) {
      expect(link.hasAttribute("data-router-link")).toBe(true);
    }
    const item = screen.getByRole("link", { name: "Pedidos" });
    expect(item.getAttribute("aria-current")).toBe("page");
    expect(item.className).toContain("rounded-md");
    await user.click(item);
    await user.click(screen.getByRole("link", { name: "Facturas" }));
    await user.click(
      within(screen.getByRole("navigation", { name: "Breadcrumb" })).getByRole("link", {
        name: "Ventas",
      }),
    );
    expect(router.visits).toEqual(["/ventas/pedidos", "/facturas", "/ventas"]);
  });

  it("renders a plain anchor without renderLink", () => {
    mockViewport(WIDE);
    render(
      <AppLayout>
        <AppLayoutNavGroup>
          <AppLayoutNavItem label="Pedidos" href="/pedidos" />
        </AppLayoutNavGroup>
      </AppLayout>,
    );
    const link = screen.getByRole("link", { name: "Pedidos" });
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/pedidos");
  });
});
