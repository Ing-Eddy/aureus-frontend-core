import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { type UseFieldA11yOptions, useFieldA11y } from "./use-field-a11y";

const base: UseFieldA11yOptions = { hasHelper: false, hasInfo: false };

describe("useFieldA11y", () => {
  it("uses the consumer's id and derives the helper and info ids from it", () => {
    const { result } = renderHook(() => useFieldA11y({ ...base, id: "email" }));
    expect(result.current.inputId).toBe("email");
    expect(result.current.helperId).toBe("email-helper");
    expect(result.current.infoId).toBe("email-info");
  });

  it("generates a stable id when none is given", () => {
    const { result, rerender } = renderHook(() => useFieldA11y(base));
    const first = result.current.inputId;
    rerender();
    expect(first).toBeTruthy();
    expect(result.current.inputId).toBe(first);
  });

  it("builds aria-describedby as user + helper + info", () => {
    const { result } = renderHook(() =>
      useFieldA11y({ id: "x", describedBy: "external", hasHelper: true, hasInfo: true }),
    );
    expect(result.current.inputProps["aria-describedby"]).toBe("external x-helper x-info");
  });

  it("omits aria-describedby when there is nothing to describe", () => {
    const { result } = renderHook(() => useFieldA11y(base));
    expect(result.current.inputProps["aria-describedby"]).toBeUndefined();
  });

  it("maps required, error and loading to ARIA and data attributes", () => {
    const { result } = renderHook(() =>
      useFieldA11y({ ...base, required: true, error: true, loading: true }),
    );
    expect(result.current.inputProps).toMatchObject({
      disabled: true,
      "aria-required": true,
      "aria-invalid": true,
      "aria-busy": true,
    });
    expect(result.current.rootProps).toEqual({
      "data-invalid": true,
      "data-disabled": undefined,
      "data-loading": true,
    });
  });

  it("disables the input when disabled or loading", () => {
    expect(
      renderHook(() => useFieldA11y({ ...base, disabled: true })).result.current,
    ).toMatchObject({ isDisabled: true, rootProps: { "data-disabled": true } });
    expect(
      renderHook(() => useFieldA11y({ ...base, loading: true })).result.current.isDisabled,
    ).toBe(true);
    expect(renderHook(() => useFieldA11y(base)).result.current.isDisabled).toBe(false);
  });
});
