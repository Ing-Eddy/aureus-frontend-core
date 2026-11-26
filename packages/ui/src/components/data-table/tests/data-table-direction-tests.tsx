import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { DataTable } from "..";
import { paginationTexts, people, personColumns } from "./render-data-table";

function renderRightToLeft() {
  const user = userEvent.setup({ pointerEventsCheck: 0 });
  render(
    <div dir="rtl" style={{ direction: "rtl" }}>
      <TooltipProvider>
        <DataTable
          aria-label="People"
          data={people(3)}
          columns={personColumns.map((column) => ({ ...column, hideable: true }))}
          getRowId={(person) => person.id}
          columnToggle={{ label: "Columns" }}
          filters={{ label: "Filters", content: <p>Filter content</p> }}
          selection={{
            selectAllLabel: "Select all",
            selectRowLabel: (person) => `Select ${person.name}`,
            actionsLabel: "Actions",
            actions: [{ id: "archive", label: "Archive", onSelect: () => {} }],
          }}
          rowActions={{
            label: (person) => `Actions of ${person.name}`,
            items: () => [{ id: "open", label: "Open", onSelect: () => {} }],
          }}
          pagination={{ ...paginationTexts, pageSizes: [10, 20], pageSizeLabel: "Rows" }}
        />
      </TooltipProvider>
    </div>,
  );
  return user;
}

describe("DataTable in a right-to-left page", () => {
  it.each([
    ["the row actions", () => screen.getAllByRole("button", { name: /^Actions of/ })[0], "menu"],
    ["the column", () => screen.getByRole("button", { name: "Columns" }), "menu"],
    ["the page size", () => screen.getByRole("combobox", { name: "Rows" }), "listbox"],
  ] as const)("opens %s menu right to left", async (_, trigger, role) => {
    const user = renderRightToLeft();
    await user.click(trigger() as HTMLElement);
    expect(screen.getByRole(role).getAttribute("dir")).toBe("rtl");
  });

  it("opens the bulk actions menu right to left", async () => {
    const user = renderRightToLeft();
    await user.click(screen.getByRole("checkbox", { name: "Select all" }));
    await user.click(screen.getByRole("button", { name: /^Actions\s*3/ }));
    expect(screen.getByRole("menu").getAttribute("dir")).toBe("rtl");
  });

  it("opens the filters right to left", async () => {
    const user = renderRightToLeft();
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("dialog").getAttribute("dir")).toBe("rtl");
  });
});
