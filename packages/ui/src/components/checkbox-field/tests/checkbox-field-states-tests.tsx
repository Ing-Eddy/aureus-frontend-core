import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { CheckboxField } from "../checkbox-field";
import { box, renderField } from "./helpers";

describe("CheckboxField states", () => {
  it("does not change while loading, and shows a spinner", async () => {
    const onValueChange = vi.fn();
    renderField(
      <CheckboxField
        loadingLabel="Loading"
        checkboxLabel="Sync"
        loading
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(box("Sync"));
    await userEvent.click(screen.getByText("Sync"));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(box("Sync").getAttribute("aria-busy")).toBe("true");
    expect(screen.getByLabelText("Loading")).toBeTruthy();
  });

  it("does not change while disabled", async () => {
    const onValueChange = vi.fn();
    renderField(<CheckboxField checkboxLabel="Sync" disabled onValueChange={onValueChange} />);
    await userEvent.click(box("Sync"));
    expect(onValueChange).not.toHaveBeenCalled();
    expect((box("Sync") as HTMLButtonElement).disabled).toBe(true);
  });

  it("shows the error message in place of the helper text", () => {
    renderField(
      <CheckboxField checkboxLabel="I accept" helperText="Help" error errorMessage="Required." />,
    );
    expect(screen.getByRole("alert").textContent).toBe("Required.");
    expect(screen.queryByText("Help")).toBeNull();
  });

  it("forwards the ref to the box", () => {
    const ref = createRef<HTMLButtonElement>();
    renderField(<CheckboxField checkboxLabel="I accept" ref={ref} />);
    expect(ref.current).toBe(box("I accept"));
  });
});
