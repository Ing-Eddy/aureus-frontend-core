import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { SwitchField } from "../switch-field";
import { renderField, toggle } from "./helpers";

describe("SwitchField states", () => {
  it("does not change while loading, and shows the spinner in the thumb", async () => {
    const onValueChange = vi.fn();
    const { container } = renderField(
      <SwitchField switchLabel="Sync" loading onValueChange={onValueChange} />,
    );
    await userEvent.click(toggle("Sync"));
    await userEvent.click(screen.getByText("Sync"));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(toggle("Sync").getAttribute("aria-busy")).toBe("true");
    expect(
      container.querySelector("[data-slot=switch-thumb] [data-slot=switch-spinner]"),
    ).not.toBeNull();
  });

  it("does not change while disabled", async () => {
    const onValueChange = vi.fn();
    renderField(<SwitchField switchLabel="Sync" disabled onValueChange={onValueChange} />);
    await userEvent.click(toggle("Sync"));
    expect(onValueChange).not.toHaveBeenCalled();
    expect((toggle("Sync") as HTMLButtonElement).disabled).toBe(true);
  });

  it("shows the error message in place of the helper text", () => {
    renderField(
      <SwitchField switchLabel="I agree" helperText="Help" error errorMessage="Required." />,
    );
    expect(screen.getByRole("alert").textContent).toBe("Required.");
  });

  it("forwards the ref to the switch", () => {
    const ref = createRef<HTMLButtonElement>();
    renderField(<SwitchField switchLabel="Alerts" ref={ref} />);
    expect(ref.current).toBe(toggle("Alerts"));
  });
});
