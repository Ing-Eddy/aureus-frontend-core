import type { ChangeEvent, FocusEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { type ControllerContext, mapControllerToField } from "./map-controller-to-field";

function context(overrides: Partial<ControllerContext["field"]> = {}, message?: string) {
  const field = {
    name: "username",
    value: "ada",
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
    disabled: false,
    ...overrides,
  };
  const fieldState = {
    invalid: Boolean(message),
    isTouched: false,
    isDirty: false,
    isValidating: false,
    error: message ? { type: "min", message } : undefined,
  };
  return { field, fieldState } as ControllerContext;
}

describe("mapControllerToField", () => {
  it("maps name, value and state", () => {
    const mapped = mapControllerToField(context({ disabled: true }, "Too short"), {});
    expect(mapped).toMatchObject({
      name: "username",
      value: "ada",
      disabled: true,
      error: true,
      errorMessage: "Too short",
    });
  });

  it("has no error without a field error", () => {
    const mapped = mapControllerToField(context(), {});
    expect(mapped.error).toBe(false);
    expect(mapped.errorMessage).toBeUndefined();
  });

  it("replaces null and undefined values with the empty value", () => {
    expect(mapControllerToField(context({ value: undefined }), {}).value).toBe("");
    expect(mapControllerToField(context({ value: null }), {}).value).toBe("");
    expect(mapControllerToField(context({ value: null }), {}, 0).value).toBe(0);
  });

  it("calls react-hook-form's handlers before the user's", () => {
    const ctx = context();
    const calls: string[] = [];
    vi.mocked(ctx.field.onChange).mockImplementation(() => calls.push("rhf change"));
    vi.mocked(ctx.field.onBlur).mockImplementation(() => calls.push("rhf blur"));
    const mapped = mapControllerToField<HTMLInputElement>(ctx, {
      onChange: () => calls.push("user change"),
      onBlur: () => calls.push("user blur"),
    });

    mapped.onChange({ target: { value: "x" } } as ChangeEvent<HTMLInputElement>);
    mapped.onBlur({} as FocusEvent<HTMLInputElement>);

    expect(calls).toEqual(["rhf change", "user change", "rhf blur", "user blur"]);
  });

  it("merges react-hook-form's ref with the user's", () => {
    const ctx = context();
    const userRef = vi.fn();
    const node = document.createElement("input");

    mapControllerToField<HTMLInputElement>(ctx, { ref: userRef }).ref(node);

    expect(ctx.field.ref).toHaveBeenCalledWith(node);
    expect(userRef).toHaveBeenCalledWith(node);
  });
});
