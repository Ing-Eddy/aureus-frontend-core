import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { names, paginationTexts, people, renderTable } from "./render-data-table";

const button = (name: string) => screen.getByRole("button", { name }) as HTMLButtonElement;

describe("pagination", () => {
  it("pages over the rows in the client", async () => {
    const { user } = renderTable({ data: people(25), pagination: paginationTexts });
    expect(button("Previous page").disabled).toBe(true);
    await user.click(button("Next page"));
    await user.click(button("Next page"));
    expect(names()).toHaveLength(5);
    expect(screen.getByText("Page 3 of 3")).toBeTruthy();
    expect(button("Next page").disabled).toBe(true);
  });

  it("page buttons jump to a page, named by pageLabel, with the current one marked", async () => {
    const { user } = renderTable({ data: people(95), pagination: paginationTexts });
    const pages = () =>
      screen.getAllByRole("button", { name: /^Page \d+ of 10$/ }).map((page) => page.textContent);
    expect(pages()).toEqual(["1", "2", "3", "4", "5", "10"]);
    expect(button("Page 1 of 10").getAttribute("aria-current")).toBe("page");
    await user.click(button("Page 10 of 10"));
    expect(names()).toHaveLength(5);
    expect(button("Page 10 of 10").getAttribute("aria-current")).toBe("page");
    expect(button("Page 1 of 10").hasAttribute("aria-current")).toBe(false);
    expect(pages()).toEqual(["1", "6", "7", "8", "9", "10"]);
    await user.click(button("Page 6 of 10"));
    expect(pages()).toEqual(["1", "5", "6", "7", "10"]);
  });

  it("the page-size select is named by pageSizeLabel, without visible text", () => {
    renderTable({
      data: people(25),
      pagination: { ...paginationTexts, pageSizes: [10, 20], pageSizeLabel: "Rows per page" },
    });
    expect(screen.getByRole("combobox", { name: "Rows per page" })).toBeTruthy();
    expect(screen.queryByText("Rows per page")).toBeNull();
  });

  it("first and last buttons with showFirstLast", async () => {
    const { user } = renderTable({
      data: people(25),
      pagination: {
        ...paginationTexts,
        showFirstLast: true,
        firstLabel: "First page",
        lastLabel: "Last page",
      },
    });
    await user.click(button("Last page"));
    expect(screen.getByText("Page 3 of 3")).toBeTruthy();
    await user.click(button("First page"));
    expect(screen.getByText("Page 1 of 3")).toBeTruthy();
  });

  it("shows rangeLabel when given", async () => {
    const { user } = renderTable({
      data: people(25),
      pagination: {
        ...paginationTexts,
        rangeLabel: (from, to, total) => `${from}–${to} of ${total}`,
      },
    });
    expect(screen.getByText("1–10 of 25")).toBeTruthy();
    await user.click(button("Next page"));
    await user.click(button("Next page"));
    expect(screen.getByText("21–25 of 25")).toBeTruthy();
  });

  it("the page-size select changes the size and returns to page 1", async () => {
    const onChange = vi.fn();
    const { user } = renderTable({
      data: people(45),
      pagination: {
        ...paginationTexts,
        pageSizes: [10, 20],
        pageSizeLabel: "Rows per page",
        defaultValue: { pageIndex: 3, pageSize: 10 },
        onChange,
      },
    });
    await user.click(screen.getByRole("combobox", { name: "Rows per page" }));
    await user.click(await screen.findByRole("option", { name: "20" }));
    expect(onChange).toHaveBeenLastCalledWith({ pageIndex: 0, pageSize: 20 });
    expect(names()).toHaveLength(20);
    expect(screen.getByText("Page 1 of 3")).toBeTruthy();
  });

  it("manual mode with pageCount", () => {
    renderTable({
      data: people(10),
      pagination: { ...paginationTexts, manual: true, pageCount: 7 },
    });
    expect(screen.getByText("Page 1 of 7")).toBeTruthy();
    expect(names()).toHaveLength(10);
  });

  it("without pagination every row is shown", () => {
    const { unmount } = renderTable({ data: people(30) });
    expect(names()).toHaveLength(30);
    unmount();
    renderTable({ data: people(30), pagination: false });
    expect(names()).toHaveLength(30);
    expect(document.querySelector('[data-slot="data-table-pagination"]')).toBeNull();
  });
});
