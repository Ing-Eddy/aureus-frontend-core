import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { DataTable } from "..";
import { paginationTexts, people, personColumns, renderTable } from "./render-data-table";

const row = (name: string) => screen.getByText(name).closest("tr") as HTMLElement;
const header = (name: string) =>
  screen.getByRole("columnheader", { name: new RegExp(`^${name}`) }) as HTMLElement;

describe("keyboard and ARIA", () => {
  it("focusable rows share one tab stop, and the arrows, Home and End move between them", () => {
    renderTable({ highlight: { rows: true } });
    expect(row("Ada 1").tabIndex).toBe(0);
    expect(row("Grace 2").tabIndex).toBe(-1);

    row("Ada 1").focus();
    fireEvent.keyDown(row("Ada 1"), { key: "ArrowDown" });
    expect(document.activeElement).toBe(row("Grace 2"));
    expect(row("Grace 2").tabIndex).toBe(0);
    expect(row("Ada 1").tabIndex).toBe(-1);

    fireEvent.keyDown(row("Grace 2"), { key: "End" });
    expect(document.activeElement).toBe(row("Katherine 5"));
    fireEvent.keyDown(row("Katherine 5"), { key: "ArrowDown" });
    expect(document.activeElement).toBe(row("Katherine 5"));
    fireEvent.keyDown(row("Katherine 5"), { key: "Home" });
    expect(document.activeElement).toBe(row("Ada 1"));
    fireEvent.keyDown(row("Ada 1"), { key: "ArrowUp" });
    expect(document.activeElement).toBe(row("Ada 1"));
  });

  it("the marked row is the tab stop and has aria-current", () => {
    renderTable({ highlight: { rows: true, defaultValue: { rowId: "p3" } } });
    expect(row("Alan 3").getAttribute("aria-current")).toBe("true");
    expect(row("Alan 3").tabIndex).toBe(0);
    expect(row("Ada 1").tabIndex).toBe(-1);
    expect(row("Ada 1").hasAttribute("aria-current")).toBe(false);
  });

  it("markable headers share one tab stop; Enter and Space mark with aria-current", () => {
    renderTable({ highlight: { columns: true } });
    expect(header("Name").tabIndex).toBe(0);
    expect(header("Email").tabIndex).toBe(-1);

    header("Name").focus();
    fireEvent.keyDown(header("Name"), { key: "ArrowRight" });
    expect(document.activeElement).toBe(header("Email"));
    fireEvent.keyDown(header("Email"), { key: "Enter" });
    expect(header("Email").getAttribute("aria-current")).toBe("true");
    expect(header("Email").hasAttribute("data-highlight-column")).toBe(true);
    fireEvent.keyDown(header("Email"), { key: " " });
    expect(header("Email").hasAttribute("aria-current")).toBe(false);
    fireEvent.keyDown(header("Email"), { key: "End" });
    expect(document.activeElement).toBe(header("Age"));
  });

  it("header arrows are mirrored in RTL", () => {
    render(
      <div dir="rtl" style={{ direction: "rtl" }}>
        <TooltipProvider>
          <DataTable
            aria-label="People"
            data={people(2)}
            columns={personColumns}
            highlight={{ columns: true }}
          />
        </TooltipProvider>
      </div>,
    );
    header("Name").focus();
    fireEvent.keyDown(header("Name"), { key: "ArrowLeft" });
    expect(document.activeElement).toBe(header("Email"));
  });

  it("headers are not focusable without highlight.columns", () => {
    renderTable();
    expect(header("Name").hasAttribute("tabindex")).toBe(false);
  });

  it("the expand button controls its detail row", async () => {
    const { user } = renderTable({
      expansion: {
        renderDetail: (person) => `Detail of ${person.name}`,
        expandLabel: (person) => `Expand ${person.name}`,
      },
    });
    const button = screen.getByRole("button", { name: "Expand Ada 1" });
    expect(button.hasAttribute("aria-controls")).toBe(false);
    await user.click(button);
    const id = button.getAttribute("aria-controls") ?? "";
    expect(document.getElementById(id)?.textContent).toBe("Detail of Ada 1");
  });

  it("the error state is an alert", () => {
    renderTable({ error: { content: "Could not load" } });
    expect(screen.getByRole("alert").textContent).toContain("Could not load");
  });

  it("the range label announces page changes, or the page label without it", () => {
    const { unmount } = renderTable({ data: people(25), pagination: paginationTexts });
    expect(screen.getByText("Page 1 of 3").getAttribute("aria-live")).toBe("polite");
    unmount();
    renderTable({
      data: people(25),
      pagination: {
        ...paginationTexts,
        rangeLabel: (from, to, total) => `${from}-${to} of ${total}`,
      },
    });
    expect(screen.getByText("1-10 of 25").getAttribute("aria-live")).toBe("polite");
    // The page label then only names the page buttons.
    expect(screen.queryByText("Page 1 of 3")).toBeNull();
  });
});
