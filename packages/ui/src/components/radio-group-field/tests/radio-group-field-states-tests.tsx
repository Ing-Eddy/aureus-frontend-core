import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { RadioGroupField } from "../radio-group-field";
import { plans, radio, renderField } from "./helpers";

describe("RadioGroupField states", () => {
  it("locks every radio while loading, with a spinner, aria-busy and aria-disabled", async () => {
    const onValueChange = vi.fn();
    renderField(
      <RadioGroupField label="Plan" options={plans} loading onValueChange={onValueChange} />,
    );
    expect(screen.getAllByRole("radio").every((r) => (r as HTMLButtonElement).disabled)).toBe(true);
    await userEvent.click(radio("Pro"));
    expect(onValueChange).not.toHaveBeenCalled();
    const group = screen.getByRole("radiogroup", { name: "Plan" });
    expect(group.getAttribute("aria-busy")).toBe("true");
    expect(group.getAttribute("aria-disabled")).toBe("true");
    expect(screen.getByLabelText("Loading")).toBeTruthy();
  });

  it("locks every radio while disabled", () => {
    renderField(<RadioGroupField label="Plan" options={plans} disabled />);
    expect(screen.getAllByRole("radio").every((r) => (r as HTMLButtonElement).disabled)).toBe(true);
    expect(screen.getByRole("radiogroup").getAttribute("aria-disabled")).toBe("true");
  });

  it("fires onBlur only when focus leaves the group", async () => {
    const onBlur = vi.fn();
    renderField(
      <>
        <RadioGroupField
          label="Plan"
          options={plans}
          otherOption={{ label: "Other", inputLabel: "Other plan" }}
          defaultValue="Custom"
          onBlur={onBlur}
        />
        <button type="button">After</button>
      </>,
    );
    await userEvent.tab();
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Other plan" }));
    expect(onBlur).not.toHaveBeenCalled();
    await userEvent.tab();
    expect(document.activeElement?.textContent).toBe("After");
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("forwards the ref to the radiogroup", () => {
    const ref = createRef<HTMLDivElement>();
    renderField(<RadioGroupField label="Plan" options={plans} ref={ref} />);
    expect(ref.current?.getAttribute("role")).toBe("radiogroup");
  });
});
