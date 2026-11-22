import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { DataTableSelectionOptions } from "../types";
import { type Person, paginationTexts, people, renderTable } from "./render-data-table";

const texts = {
  selectRowLabel: (person: Person) => `Select ${person.name}`,
  selectAllLabel: "Select all",
};
const box = (name: string) => screen.getByRole("checkbox", { name });
const checked = (name: string) => box(name).getAttribute("aria-checked");

describe("selection", () => {
  it("selects all rows of the page, with indeterminate in between", async () => {
    const onChange = vi.fn();
    const { user } = renderTable({
      data: people(25),
      selection: { ...texts, onChange },
      pagination: paginationTexts,
    });
    await user.click(box("Select Ada 1"));
    expect(checked("Select all")).toBe("mixed");
    await user.click(box("Select all"));
    const [state, rows] = onChange.mock.calls.at(-1) ?? [];
    expect(Object.keys(state)).toHaveLength(10);
    expect(rows).toHaveLength(10);
    expect(checked("Select all")).toBe("true");
  });

  it("selectAllScope all selects every row", async () => {
    const onChange = vi.fn();
    const { user } = renderTable({
      data: people(25),
      selection: { ...texts, selectAllScope: "all", onChange },
      pagination: paginationTexts,
    });
    await user.click(box("Select all"));
    expect(Object.keys(onChange.mock.calls.at(-1)?.[0])).toHaveLength(25);
  });

  it("single mode keeps one row and has no header checkbox", async () => {
    const { user } = renderTable({
      selection: { mode: "single", selectRowLabel: texts.selectRowLabel },
    });
    expect(screen.queryByRole("checkbox", { name: "Select all" })).toBeNull();
    await user.click(box("Select Ada 1"));
    await user.click(box("Select Grace 2"));
    expect(checked("Select Ada 1")).toBe("false");
    expect(checked("Select Grace 2")).toBe("true");
  });

  it("canSelect disables rows", () => {
    renderTable({ selection: { ...texts, canSelect: (person) => person.id !== "p2" } });
    expect(box("Select Grace 2").hasAttribute("disabled")).toBe(true);
    expect(box("Select Ada 1").hasAttribute("disabled")).toBe(false);
  });

  it("marks selected rows", async () => {
    const { user } = renderTable({ selection: texts });
    await user.click(box("Select Ada 1"));
    const row = screen.getByText("Ada 1").closest("tr") as HTMLElement;
    expect(row.getAttribute("data-state")).toBe("selected");
    expect(row.getAttribute("aria-selected")).toBe("true");
  });

  it("shows the actions button only with a selection, and actions get the rows", async () => {
    const onDelete = vi.fn();
    const selection: DataTableSelectionOptions<Person> = {
      ...texts,
      actionsLabel: "Actions",
      actions: [
        { id: "delete", label: "Delete", variant: "destructive", onSelect: onDelete },
        {
          id: "archive",
          label: "Archive",
          disabled: (rows) => rows.length > 1,
          onSelect: () => {},
        },
      ],
    };
    const { user } = renderTable({ selection });
    expect(screen.queryByRole("button", { name: /Actions/ })).toBeNull();
    await user.click(box("Select Ada 1"));
    await user.click(box("Select Grace 2"));
    await user.click(screen.getByRole("button", { name: /Actions/ }));
    const menu = screen.getByRole("menu");
    expect(
      within(menu).getByRole("menuitem", { name: "Archive" }).getAttribute("aria-disabled"),
    ).toBe("true");
    await user.click(within(menu).getByRole("menuitem", { name: "Delete" }));
    const [rows, clear] = onDelete.mock.calls[0] ?? [];
    expect(rows.map((person: Person) => person.name)).toEqual(["Ada 1", "Grace 2"]);
    clear();
    expect(await screen.findByRole("checkbox", { name: "Select Ada 1" })).toBeTruthy();
    expect(checked("Select Ada 1")).toBe("false");
    expect(screen.queryByRole("button", { name: /Actions/ })).toBeNull();
  });

  it("hidden actions depend on the selection, and the button hides with every action hidden", async () => {
    const { user } = renderTable({
      selection: {
        ...texts,
        actionsLabel: "Actions",
        actions: [
          { id: "merge", label: "Merge", hidden: (rows) => rows.length < 2, onSelect: () => {} },
        ],
      },
    });
    await user.click(box("Select Ada 1"));
    expect(screen.queryByRole("button", { name: /Actions/ })).toBeNull();
    await user.click(box("Select Grace 2"));
    await user.click(screen.getByRole("button", { name: /Actions/ }));
    expect(within(screen.getByRole("menu")).getByRole("menuitem", { name: "Merge" })).toBeTruthy();
  });

  it("renderActions shows the consumer's content", async () => {
    const { user } = renderTable({
      selection: {
        ...texts,
        actionsLabel: "Actions",
        renderActions: (rows) => <p>{rows.length} rows</p>,
      },
    });
    await user.click(box("Select Ada 1"));
    await user.click(screen.getByRole("button", { name: /Actions/ }));
    expect(screen.getByText("1 rows")).toBeTruthy();
  });

  it("selectedLabel announces the count", async () => {
    const { user } = renderTable({
      selection: { ...texts, selectedLabel: (count) => `${count} selected` },
    });
    await user.click(box("Select Ada 1"));
    const status = screen
      .getAllByRole("status")
      .find((element) => element.textContent === "1 selected");
    expect(status).toBeTruthy();
  });
});
