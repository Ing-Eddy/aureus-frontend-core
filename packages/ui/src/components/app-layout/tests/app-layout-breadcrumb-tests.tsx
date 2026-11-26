import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { StrictMode, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AppLayout,
  AppLayoutBreadcrumb,
  type AppLayoutBreadcrumbItem,
  type UseAppLayoutBreadcrumbResult,
  useAppLayoutBreadcrumb,
  useAppLayoutBreadcrumbItems,
} from "..";
import { mockViewport, WIDE } from "./render-app-layout";

afterEach(() => vi.unstubAllGlobals());

function Page({ items }: { items: AppLayoutBreadcrumbItem[] }) {
  useAppLayoutBreadcrumbItems(items);
  return null;
}

function Probe({ onValue }: { onValue: (value: UseAppLayoutBreadcrumbResult) => void }) {
  onValue(useAppLayoutBreadcrumb());
  return null;
}

function Shell() {
  const [outer, setOuter] = useState(true);
  const [inner, setInner] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setOuter(false)}>
        drop outer
      </button>
      <button type="button" onClick={() => setInner(false)}>
        drop inner
      </button>
      {outer ? <Page items={[{ label: "Outer" }]} /> : null}
      {inner ? <Page items={[{ label: "Inner" }]} /> : null}
    </>
  );
}

function Section({ children }: { children?: React.ReactNode }) {
  useAppLayoutBreadcrumbItems([{ label: "Section" }]);
  return <>{children}</>;
}

function Nested({ strict = false }: { strict?: boolean }) {
  const [page, setPage] = useState<string | null>("Invoice 1");
  const tree = (
    <Section>
      <button type="button" onClick={() => setPage("Invoice 2")}>
        next page
      </button>
      <button type="button" onClick={() => setPage(null)}>
        close page
      </button>
      {page ? <Page key={page} items={[{ label: page }]} /> : null}
    </Section>
  );
  return strict ? <StrictMode>{tree}</StrictMode> : tree;
}

const counter = { renders: 0 };

function Counter() {
  counter.renders += 1;
  return <AppLayoutBreadcrumb label="Breadcrumb" />;
}

function trail() {
  const nav = screen.queryByRole("navigation", { name: "Breadcrumb" });
  if (!nav) return [];
  return within(nav)
    .getAllByRole("listitem")
    .map((item) => item.textContent);
}

function renderBreadcrumb(
  children: React.ReactNode,
  defaultBreadcrumb?: AppLayoutBreadcrumbItem[],
) {
  mockViewport(WIDE);
  return render(
    <AppLayout defaultBreadcrumb={defaultBreadcrumb}>
      <AppLayoutBreadcrumb label="Breadcrumb" />
      {children}
    </AppLayout>,
  );
}

describe("nested breadcrumb callers", () => {
  it.each([false, true])(
    "shows the page's trail over its section when both mount together (strict mode: %s)",
    async (strict) => {
      const user = userEvent.setup();
      renderBreadcrumb(<Nested strict={strict} />);
      expect(trail()).toEqual(["Invoice 1"]);
      await user.click(screen.getByRole("button", { name: "next page" }));
      expect(trail()).toEqual(["Invoice 2"]);
      await user.click(screen.getByRole("button", { name: "close page" }));
      expect(trail()).toEqual(["Section"]);
    },
  );
});

describe("Breadcrumb state", () => {
  it("renders nothing for an empty trail", () => {
    renderBreadcrumb(null);
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("starts with defaultBreadcrumb", () => {
    renderBreadcrumb(null, [{ label: "Home", href: "/" }, { label: "Today" }]);
    expect(trail()).toEqual(["Home", "Today"]);
  });

  it("Page sets its trail", () => {
    renderBreadcrumb(<Page items={[{ label: "Ventas", href: "/ventas" }, { label: "F-001" }]} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    const link = within(nav).getByRole("link", { name: "Ventas" });
    expect(link.getAttribute("href")).toBe("/ventas");
    const current = within(nav).getByText("F-001");
    expect(current.getAttribute("aria-current")).toBe("page");
    expect(within(nav).queryByRole("link", { name: "F-001" })).toBeNull();
  });

  it("Trail restored, also with nested callers unmounted in either order", async () => {
    const user = userEvent.setup();
    renderBreadcrumb(<Shell />, [{ label: "Base" }]);
    expect(trail()).toEqual(["Inner"]);
    await user.click(screen.getByRole("button", { name: "drop outer" }));
    expect(trail()).toEqual(["Inner"]);
    await user.click(screen.getByRole("button", { name: "drop inner" }));
    expect(trail()).toEqual(["Base"]);
  });

  it("updates on change and not on an equal inline array", () => {
    mockViewport(WIDE);
    const view = render(
      <AppLayout>
        <Counter />
        <Page items={[{ label: "One" }]} />
      </AppLayout>,
    );
    const before = counter.renders;
    view.rerender(
      <AppLayout>
        <Counter />
        <Page items={[{ label: "One" }]} />
      </AppLayout>,
    );
    expect(counter.renders - before).toBeLessThanOrEqual(1);
    view.rerender(
      <AppLayout>
        <Counter />
        <Page items={[{ label: "Two" }]} />
      </AppLayout>,
    );
    expect(trail()).toEqual(["Two"]);
  });

  it("Imperative update and the other functions", () => {
    let hook: UseAppLayoutBreadcrumbResult | undefined;
    renderBreadcrumb(<Probe onValue={(value) => (hook = value)} />);
    act(() =>
      hook?.setItems([
        { id: "sales", label: "Ventas", href: "/ventas" },
        { id: "invoice", label: "F-001" },
      ]),
    );
    act(() => hook?.update("invoice", { label: "F-002" }));
    expect(trail()).toEqual(["Ventas", "F-002"]);
    act(() => hook?.push({ id: "line", label: "Line 1" }));
    expect(trail()).toEqual(["Ventas", "F-002", "Line 1"]);
    act(() => hook?.pop());
    expect(hook?.items.map((item) => item.label)).toEqual(["Ventas", "F-002"]);
    act(() => hook?.clear());
    expect(trail()).toEqual([]);
  });

  it("renders buttons for onSelect and plain text otherwise", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    renderBreadcrumb(null, [{ label: "Back", onSelect }, { label: "Plain" }, { label: "Here" }]);
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("link", { name: "Plain" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Plain" })).toBeNull();
  });

  it("uses a custom separator", () => {
    mockViewport(WIDE);
    render(
      <AppLayout defaultBreadcrumb={[{ label: "A" }, { label: "B" }]}>
        <AppLayoutBreadcrumb label="Breadcrumb" separator="/" />
      </AppLayout>,
    );
    const separator = document.querySelector("[data-slot=breadcrumb-separator]");
    expect(separator?.textContent).toBe("/");
    expect(separator?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("Collapsed middle items", () => {
  const six = ["One", "Two", "Three", "Four", "Five", "Six"].map((label) => ({
    label,
    href: `/${label.toLowerCase()}`,
  }));

  it("shows the first, the menu and the last", async () => {
    mockViewport(WIDE);
    const user = userEvent.setup();
    render(
      <AppLayout defaultBreadcrumb={six}>
        <AppLayoutBreadcrumb label="Breadcrumb" maxItems={3} ellipsisLabel="Más" />
      </AppLayout>,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(
      within(nav)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["One"]);
    expect(within(nav).getByText("Six").getAttribute("aria-current")).toBe("page");
    await user.click(within(nav).getByRole("button", { name: "Más" }));
    const menu = screen.getByRole("menu");
    expect(
      within(menu)
        .getAllByRole("menuitem")
        .map((item) => item.textContent),
    ).toEqual(["Two", "Three", "Four", "Five"]);
  });

  it("keeps short trails whole", () => {
    mockViewport(WIDE);
    render(
      <AppLayout defaultBreadcrumb={six.slice(0, 2)}>
        <AppLayoutBreadcrumb label="Breadcrumb" maxItems={3} ellipsisLabel="Más" />
      </AppLayout>,
    );
    expect(screen.queryByRole("button", { name: "Más" })).toBeNull();
  });

  it("a larger maxItems keeps more items at the end", () => {
    mockViewport(WIDE);
    render(
      <AppLayout defaultBreadcrumb={six}>
        <AppLayoutBreadcrumb label="Breadcrumb" maxItems={4} ellipsisLabel="Más" />
      </AppLayout>,
    );
    expect(trail()).toEqual(["One", "", "Five", "Six"]);
  });
});
