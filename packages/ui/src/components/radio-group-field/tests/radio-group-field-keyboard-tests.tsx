import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadioGroupField } from "../radio-group-field";
import { plans, radio, renderField } from "./helpers";

describe("RadioGroupField keyboard (jsdom part; arrows are asserted in Chromium)", () => {
  it("enters on the first enabled radio, then leaves on the next Tab", async () => {
    renderField(
      <>
        <RadioGroupField label="Plan" options={plans} />
        <button type="button">After</button>
      </>,
    );
    await userEvent.tab();
    expect(document.activeElement).toBe(radio(/^Free/));
    await userEvent.tab();
    expect(document.activeElement?.textContent).toBe("After");
  });

  it("enters on the checked radio", async () => {
    renderField(<RadioGroupField label="Plan" options={plans} defaultValue="team" />);
    await userEvent.tab();
    expect(document.activeElement).toBe(radio("Team"));
  });

  it("checks the focused radio with Space", async () => {
    const onValueChange = vi.fn();
    renderField(<RadioGroupField label="Plan" options={plans} onValueChange={onValueChange} />);
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(onValueChange).toHaveBeenLastCalledWith("free");
  });
});
