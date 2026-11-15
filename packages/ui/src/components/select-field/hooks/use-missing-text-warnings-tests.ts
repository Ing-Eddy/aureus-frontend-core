import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { missingTexts, useMissingTextWarnings } from "./use-missing-text-warnings";

describe("missing feature texts", () => {
  it("names each enabled feature without its text", () => {
    expect(missingTexts({})).toEqual([]);
    expect(missingTexts({ searchable: true })).toEqual(["`searchable` needs `searchLabel`"]);
    expect(missingTexts({ clearable: true })).toEqual(["`clearable` needs `clearLabel`"]);
    expect(missingTexts({ multiple: true })).toEqual([
      '`multiple` needs `multipleDisplay` ("chips" or "summary")',
    ]);
    expect(missingTexts({ multiple: true, multipleDisplay: "chips" })).toEqual([
      '`multipleDisplay="chips"` needs `removeChipLabel`',
    ]);
    expect(missingTexts({ multiple: true, multipleDisplay: "summary" })).toEqual([
      '`multipleDisplay="summary"` needs `renderSummary`',
    ]);
    expect(missingTexts({ selectAll: {} })).toEqual(["`selectAll` needs `selectAll.label`"]);
    expect(missingTexts({ creatable: true, createLabel: () => "", onCreate: () => {} })).toEqual([
      "`creatable` needs `searchable`",
    ]);
  });

  it("warns once per problem", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = renderHook(() =>
      useMissingTextWarnings("SelectField", { clearable: true }),
    );
    rerender();
    expect(warn).toHaveBeenCalledOnce();
    expect(warn).toHaveBeenCalledWith("SelectField: `clearable` needs `clearLabel`.");
    warn.mockRestore();
  });
});
