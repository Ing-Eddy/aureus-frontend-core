import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { names, paginationTexts, people, renderTable, searchTexts } from "./render-data-table";

const input = () => screen.getByRole("textbox", { name: "Search people" }) as HTMLInputElement;

afterEach(() => {
  vi.useRealTimers();
});

describe("search", () => {
  it("applies on Enter and on the search button", async () => {
    const onSearch = vi.fn();
    const { user } = renderTable({ data: people(16), search: { ...searchTexts, onSearch } });
    await user.type(input(), "ada{Enter}");
    expect(onSearch).toHaveBeenLastCalledWith("ada");
    expect(names()).toEqual(["Ada 1", "Ada 9"]);
    await user.clear(input());
    await user.type(input(), "  grace ");
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(onSearch).toHaveBeenLastCalledWith("grace");
    expect(names()).toEqual(["Grace 2", "Grace 10"]);
  });

  it("does not search while typing in submit mode", async () => {
    const onSearch = vi.fn();
    const { user } = renderTable({ search: { ...searchTexts, onSearch } });
    await user.type(input(), "ada");
    expect(onSearch).not.toHaveBeenCalled();
    expect(names()).toHaveLength(5);
  });

  it("searches after debounceMs in change mode", () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    renderTable({ search: { ...searchTexts, trigger: "change", debounceMs: 300, onSearch } });
    fireEvent.change(input(), { target: { value: "ad" } });
    act(() => vi.advanceTimersByTime(200));
    fireEvent.change(input(), { target: { value: "ada" } });
    act(() => vi.advanceTimersByTime(299));
    expect(onSearch).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("ada");
    expect(names()).toEqual(["Ada 1"]);
  });

  it("clear empties the input, searches for nothing, restores the rows and keeps focus", async () => {
    const onSearch = vi.fn();
    const { user } = renderTable({ search: { ...searchTexts, onSearch } });
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
    await user.type(input(), "ada{Enter}");
    expect(names()).toEqual(["Ada 1"]);
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input().value).toBe("");
    expect(onSearch).toHaveBeenLastCalledWith("");
    expect(names()).toHaveLength(5);
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
    expect(document.activeElement).toBe(input());
  });

  it("filters across columns and returns to the first page", async () => {
    const { user } = renderTable({
      data: people(30),
      search: searchTexts,
      pagination: { ...paginationTexts, defaultValue: { pageIndex: 2, pageSize: 10 } },
    });
    expect(screen.getByText("Page 3 of 3")).toBeTruthy();
    await user.type(input(), "user1{Enter}");
    expect(screen.getByText("Page 1 of 2")).toBeTruthy();
    expect(names()[0]).toBe("Ada 1");
  });

  it("the input value is controllable", async () => {
    const onValueChange = vi.fn();
    const { user } = renderTable({ search: { ...searchTexts, value: "x", onValueChange } });
    expect(input().value).toBe("x");
    await user.type(input(), "y");
    expect(onValueChange).toHaveBeenCalledWith("xy");
    expect(input().value).toBe("x");
  });
});
