import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { DataTableColumn } from "../types";
import { type Person, renderTable, searchTexts } from "./render-data-table";

const toolbarControls = () => {
  const header = document.querySelector('[data-slot="data-table-header"]') as HTMLElement;
  return Array.from(header.querySelectorAll("input, button, [data-testid]")).map(
    (element) =>
      element.getAttribute("aria-label") ??
      element.getAttribute("data-testid") ??
      element.textContent,
  );
};

describe("toolbar actions", () => {
  it("are icon buttons named by their label, and run onClick", async () => {
    const onClick = vi.fn();
    const { user } = renderTable({
      toolbarActions: [{ id: "export", label: "Export", icon: <svg />, onClick }],
    });
    const button = screen.getByRole("button", { name: "Export" });
    expect(button.textContent).toBe("");
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("showLabel shows the text; disabled and hidden apply", () => {
    renderTable({
      toolbarActions: [
        { id: "new", label: "New employee", showLabel: true, onClick: () => {} },
        { id: "print", label: "Print", icon: <svg />, disabled: true, onClick: () => {} },
        { id: "purge", label: "Purge", icon: <svg />, hidden: true, onClick: () => {} },
      ],
    });
    expect(screen.getByRole("button", { name: "New employee" }).textContent).toBe("New employee");
    expect(screen.getByRole("button", { name: "Print" }).hasAttribute("disabled")).toBe(true);
    expect(screen.queryByRole("button", { name: "Purge" })).toBeNull();
  });

  it("with every action hidden and nothing else, there is no header", () => {
    renderTable({
      toolbarActions: [{ id: "a", label: "A", icon: <svg />, hidden: true, onClick: () => {} }],
    });
    expect(document.querySelector('[data-slot="data-table-header"]')).toBeNull();
  });
});

describe("header", () => {
  it("shows the title and subtitle, and names the table from the title", () => {
    renderTable({ "aria-label": undefined, header: { title: "People", subtitle: "Everyone" } });
    expect(screen.getByText("Everyone")).toBeTruthy();
    expect(screen.getByRole("table", { name: "People" })).toBeTruthy();
  });

  it("orders the toolbar: search, the slot, custom actions, reload, filters and columns", () => {
    renderTable({
      header: { toolbar: <span data-testid="slot" /> },
      toolbarActions: [
        { id: "export", label: "Export", icon: <svg />, onClick: () => {} },
        { id: "print", label: "Print", icon: <svg />, onClick: () => {} },
      ],
      search: searchTexts,
      reload: { label: "Reload", onReload: () => {} },
      filters: { label: "Filters", content: null },
      columnToggle: { label: "Columns" },
    });
    expect(toolbarControls()).toEqual([
      "Search people",
      "Search",
      "slot",
      "Export",
      "Print",
      "Reload",
      "Filters",
      "Columns",
    ]);
  });

  it("header={false} renders nothing, and an empty header is not rendered", () => {
    const { unmount } = renderTable({ header: false, search: searchTexts });
    expect(document.querySelector('[data-slot="data-table-header"]')).toBeNull();
    unmount();
    renderTable({ header: {} });
    expect(document.querySelector('[data-slot="data-table-header"]')).toBeNull();
  });

  it("reload calls onReload and spins while loading", async () => {
    const onReload = vi.fn();
    const { user } = renderTable({
      reload: { label: "Reload", onReload },
      loading: true,
      loadingLabel: "Loading",
    });
    await user.click(screen.getByRole("button", { name: "Reload" }));
    expect(onReload).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: "Reload" }).querySelector("svg")?.getAttribute("class"),
    ).toContain("animate-spin");
  });

  it("the filters popover shows the slot and the count, and is controllable", async () => {
    const onOpenChange = vi.fn();
    const { user } = renderTable({
      filters: { label: "Filters", content: <p>Status filter</p>, activeCount: 3, onOpenChange },
    });
    const button = screen.getByRole("button", { name: "Filters" });
    const description = button.getAttribute("aria-describedby") ?? "";
    expect(document.getElementById(description)?.textContent).toBe("3");
    await user.click(button);
    expect(screen.getByText("Status filter")).toBeTruthy();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Status filter")).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  it("filters open is controlled", () => {
    renderTable({ filters: { label: "Filters", content: <p>Status filter</p>, open: true } });
    expect(screen.getByText("Status filter")).toBeTruthy();
  });

  it("the columns menu hides and shows columns, and groups disappear with their last leaf", async () => {
    const onChange = vi.fn();
    const columns: DataTableColumn<Person>[] = [
      { accessorKey: "name", header: "Name" },
      {
        id: "contact",
        header: "Contact",
        columns: [{ accessorKey: "email", header: "Email", hideable: true }],
      },
    ];
    const { user } = renderTable({ columns, columnToggle: { label: "Columns", onChange } });
    await user.click(screen.getByRole("button", { name: "Columns" }));
    const menu = screen.getByRole("menu");
    expect(
      within(menu)
        .getAllByRole("menuitemcheckbox")
        .map((item) => item.textContent),
    ).toEqual(["Email"]);
    await user.click(within(menu).getByRole("menuitemcheckbox", { name: "Email" }));
    expect(onChange).toHaveBeenLastCalledWith({ email: false });
    expect(screen.queryByRole("columnheader", { name: "Email" })).toBeNull();
    expect(screen.queryByRole("columnheader", { name: "Contact" })).toBeNull();
  });

  it("the columns button shows the hidden count as its badge and description", async () => {
    const { user } = renderTable({
      columnToggle: { label: "Columns", defaultValue: { email: false } },
    });
    // Kept from before the menu opens: the open menu hides the rest of the page from roles.
    const trigger = screen.getByRole("button", { name: "Columns" });
    const button = () => trigger;
    // aria-describedby may also hold the tooltip's id while the tooltip is open.
    const badge = () => {
      const ids = button().getAttribute("aria-describedby")?.split(/\s+/) ?? [];
      return document.querySelector(ids.map((id) => `#${CSS.escape(id)}`).join(", ") || "#none");
    };
    expect(badge()?.textContent).toBe("1");
    expect(badge()?.getAttribute("aria-hidden")).toBe("true");
    // The name stays the label: the badge is outside the button.
    expect(button().textContent).toBe("");

    await user.click(button());
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Name" }));
    expect(badge()?.textContent).toBe("2");
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Name" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Email" }));
    expect(button().hasAttribute("aria-describedby")).toBe(false);
    expect(document.querySelector('[data-slot="data-table-toolbar-badge"]')).toBeNull();
  });

  it("columns that cannot be hidden never count", () => {
    renderTable({
      columns: [{ accessorKey: "name", header: "Name" }],
      columnToggle: { label: "Columns", defaultValue: { name: false } },
    });
    expect(screen.getByRole("button", { name: "Columns" }).hasAttribute("aria-describedby")).toBe(
      false,
    );
  });
});
