import { screen } from "@testing-library/react";
import { createContext, useContext, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppLayoutTopbarActions } from "..";
import { mockViewport, renderAppLayout, WIDE } from "./render-app-layout";

afterEach(() => vi.unstubAllGlobals());

const PageContext = createContext("none");

function ContextReader() {
  return <span>{useContext(PageContext)}</span>;
}

function Pages() {
  const [page, setPage] = useState<"a" | "b" | "none">("a");
  return (
    <>
      <button type="button" onClick={() => setPage("b")}>
        Go B
      </button>
      <button type="button" onClick={() => setPage("none")}>
        Leave
      </button>
      {page === "a" ? (
        <AppLayoutTopbarActions>
          <button type="button">Action A</button>
        </AppLayoutTopbarActions>
      ) : null}
      {page === "b" ? (
        <AppLayoutTopbarActions>
          <button type="button">Action B</button>
        </AppLayoutTopbarActions>
      ) : null}
    </>
  );
}

function actionsArea() {
  const area = document.querySelector("[data-slot=app-layout-topbar-actions]");
  if (!area) throw new Error("no actions area");
  return area;
}

describe("Top bar", () => {
  it("renders the parts in reading order", () => {
    mockViewport(WIDE);
    renderAppLayout({
      layout: { defaultBreadcrumb: [{ label: "Home" }] },
      topbar: {
        divider: true,
        children: <span data-testid="middle" />,
        actions: <button type="button">Account</button>,
      },
    });
    const header = screen.getByRole("banner");
    const order = [...header.querySelectorAll("[data-slot]")]
      .map((node) => node.getAttribute("data-slot"))
      .filter((slot) =>
        [
          "app-layout-sidebar-trigger",
          "separator",
          "app-layout-breadcrumb",
          "app-layout-topbar-actions",
        ].includes(slot ?? ""),
      );
    expect(order).toEqual([
      "app-layout-sidebar-trigger",
      "separator",
      "app-layout-breadcrumb",
      "app-layout-topbar-actions",
    ]);
    const middle = screen.getByTestId("middle");
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(
      breadcrumb.compareDocumentPosition(middle) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("has no divider by default", () => {
    mockViewport(WIDE);
    renderAppLayout();
    expect(screen.getByRole("banner").querySelector("[data-slot=separator]")).toBeNull();
  });

  it("trigger={false} and breadcrumb={false}", () => {
    mockViewport(WIDE);
    renderAppLayout({
      layout: { defaultBreadcrumb: [{ label: "Home" }] },
      topbar: {
        trigger: false,
        triggerLabel: undefined,
        breadcrumb: false,
        breadcrumbLabel: undefined,
      },
    });
    expect(screen.queryByRole("button", { name: "Toggle sidebar" })).toBeNull();
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("Page actions: portals come before the actions prop, in mount order", () => {
    mockViewport(WIDE);
    renderAppLayout({
      topbar: { actions: <button type="button">Account</button> },
      children: (
        <>
          <AppLayoutTopbarActions>
            <button type="button">Exportar</button>
          </AppLayoutTopbarActions>
          <AppLayoutTopbarActions>
            <button type="button">Imprimir</button>
          </AppLayoutTopbarActions>
        </>
      ),
    });
    const names = [...actionsArea().querySelectorAll("button")].map((button) => button.textContent);
    expect(names).toEqual(["Exportar", "Imprimir", "Account"]);
  });

  it("Leaving the page and mounting later", async () => {
    mockViewport(WIDE);
    const view = renderAppLayout({
      topbar: { actions: <button type="button">Account</button> },
      children: <Pages />,
    });
    expect(actionsArea().textContent).toBe("Action AAccount");
    await view.user.click(screen.getByRole("button", { name: "Go B" }));
    expect(actionsArea().textContent).toBe("Action BAccount");
    await view.user.click(screen.getByRole("button", { name: "Leave" }));
    expect(actionsArea().textContent).toBe("Account");
  });

  it("keeps the context of the place where it is written", () => {
    mockViewport(WIDE);
    renderAppLayout({
      children: (
        <PageContext.Provider value="from-page">
          <AppLayoutTopbarActions>
            <ContextReader />
          </AppLayoutTopbarActions>
        </PageContext.Provider>
      ),
    });
    expect(actionsArea().textContent).toBe("from-page");
  });
});
