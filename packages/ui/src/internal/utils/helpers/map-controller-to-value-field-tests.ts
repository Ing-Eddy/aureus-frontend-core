import type { FocusEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import type { ControllerContext } from "./map-controller-to-field";
import { mapControllerToValueField } from "./map-controller-to-value-field";

function context(value: unknown, message?: string) {
  return {
    field: {
      name: "amount",
      value,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
      disabled: false,
    },
    fieldState: {
      invalid: Boolean(message),
      isTouched: false,
      isDirty: false,
      isValidating: false,
      error: message ? { type: "min", message } : undefined,
    },
  } as ControllerContext;
}

describe("mapControllerToValueField", () => {
  it("uses the empty value for undefined and keeps numbers", () => {
    expect(mapControllerToValueField(context(undefined), {}, null).value).toBeNull();
    expect(mapControllerToValueField(context(12.5), {}, null).value).toBe(12.5);
  });

  it("stores the value itself, then calls the user's handler", () => {
    const ctx = context(1);
    const calls: string[] = [];
    vi.mocked(ctx.field.onChange).mockImplementation(() => calls.push("rhf"));
    const mapped = mapControllerToValueField<HTMLInputElement, number | null>(
      ctx,
      { onValueChange: () => calls.push("user") },
      null,
    );
    mapped.onValueChange(42);
    expect(ctx.field.onChange).toHaveBeenCalledWith(42);
    expect(calls).toEqual(["rhf", "user"]);
  });

  it("composes blur, merges refs and maps the error", () => {
    const ctx = context(1, "Too small");
    const onBlur = vi.fn();
    const userRef = vi.fn();
    const mapped = mapControllerToValueField<HTMLInputElement, number | null>(
      ctx,
      { onBlur, ref: userRef },
      null,
    );
    mapped.onBlur({} as FocusEvent<HTMLInputElement>);
    const node = document.createElement("input");
    mapped.ref(node);
    expect(ctx.field.onBlur).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
    expect(ctx.field.ref).toHaveBeenCalledWith(node);
    expect(userRef).toHaveBeenCalledWith(node);
    expect(mapped).toMatchObject({ error: true, errorMessage: "Too small", name: "amount" });
  });
});
