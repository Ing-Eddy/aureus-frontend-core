import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { type Person, renderTable } from "./render-data-table";

const expansion = {
  renderDetail: (person: Person) => `Detail of ${person.name}`,
  expandLabel: (person: Person, expanded: boolean) =>
    `${expanded ? "Collapse" : "Expand"} ${person.name}`,
};

describe("rows", () => {
  it("expands a row into a detail row", async () => {
    const onChange = vi.fn();
    const { user } = renderTable({ expansion: { ...expansion, onChange } });
    const toggle = screen.getByRole("button", { name: "Expand Ada 1" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    await user.click(toggle);
    expect(screen.getByText("Detail of Ada 1")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Collapse Ada 1" }).getAttribute("aria-expanded"),
    ).toBe("true");
    expect(onChange).toHaveBeenLastCalledWith({ p1: true });
    const detail = screen.getByText("Detail of Ada 1").closest("td") as HTMLElement;
    expect(detail.getAttribute("colspan")).toBe("4");
  });

  it("single collapses the others", async () => {
    const { user } = renderTable({ expansion: { ...expansion, single: true } });
    await user.click(screen.getByRole("button", { name: "Expand Ada 1" }));
    await user.click(screen.getByRole("button", { name: "Expand Grace 2" }));
    expect(screen.queryByText("Detail of Ada 1")).toBeNull();
    expect(screen.getByText("Detail of Grace 2")).toBeTruthy();
  });

  it("canExpand hides the toggle", () => {
    renderTable({ expansion: { ...expansion, canExpand: (person) => person.id === "p1" } });
    expect(screen.getByRole("button", { name: "Expand Ada 1" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Expand Grace 2" })).toBeNull();
  });

  it("row actions receive the row", async () => {
    const onEdit = vi.fn();
    const { user } = renderTable({
      rowActions: {
        label: (person) => `Actions for ${person.name}`,
        items: () => [{ id: "edit", label: "Edit", onSelect: onEdit }],
      },
    });
    await user.click(screen.getByRole("button", { name: "Actions for Grace 2" }));
    await user.click(within(screen.getByRole("menu")).getByRole("menuitem", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: "p2" }));
  });

  it("hidden row actions are left out, and a row without visible actions has no menu", async () => {
    const { user } = renderTable({
      rowActions: {
        label: (person) => `Actions for ${person.name}`,
        items: (person) =>
          [
            { id: "edit", label: "Edit", onSelect: () => {} },
            { id: "delete", label: "Delete", hidden: person.id === "p2", onSelect: () => {} },
            { id: "archive", label: "Archive", disabled: person.id === "p1", onSelect: () => {} },
          ].map((item) => (person.id === "p3" ? { ...item, hidden: true } : item)),
      },
    });
    expect(screen.queryByRole("button", { name: "Actions for Alan 3" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Actions for Grace 2" }));
    const menu = screen.getByRole("menu");
    expect(within(menu).queryByRole("menuitem", { name: "Delete" })).toBeNull();
    expect(within(menu).getByRole("menuitem", { name: "Edit" })).toBeTruthy();
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Actions for Ada 1" }));
    expect(
      within(screen.getByRole("menu"))
        .getByRole("menuitem", { name: "Archive" })
        .getAttribute("aria-disabled"),
    ).toBe("true");
  });

  it("onRowClick on click and on Enter, never from controls", async () => {
    const onRowClick = vi.fn();
    const { user } = renderTable({
      onRowClick,
      expansion,
    });
    const row = screen.getByText("Ada 1").closest("tr") as HTMLElement;
    expect(row.getAttribute("tabindex")).toBe("0");
    await user.click(screen.getByText("Ada 1"));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick.mock.calls[0]?.[0]).toEqual(expect.objectContaining({ id: "p1" }));
    row.focus();
    fireEvent.keyDown(row, { key: "Enter" });
    expect(onRowClick).toHaveBeenCalledTimes(2);
    await user.click(screen.getByRole("button", { name: "Expand Ada 1" }));
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });

  it("rows are not focusable without onRowClick or highlight.rows", () => {
    renderTable();
    const row = screen.getByText("Ada 1").closest("tr") as HTMLElement;
    expect(row.hasAttribute("tabindex")).toBe(false);
  });
});
