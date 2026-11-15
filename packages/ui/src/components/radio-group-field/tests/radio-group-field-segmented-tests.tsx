import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadioGroupField } from "../radio-group-field";
import { plans, renderField } from "./helpers";

describe("RadioGroupField segmented", () => {
  it("renders each option as a radio named by its label, without descriptions", async () => {
    const onValueChange = vi.fn();
    const { container } = renderField(
      <RadioGroupField
        label="Plan"
        options={plans}
        appearance="segmented"
        onValueChange={onValueChange}
      />,
    );
    const segments = container.querySelectorAll("[data-slot=radio-segment]");
    expect(segments).toHaveLength(4);
    expect(screen.getByRole("radio", { name: "Free" })).toBeTruthy();
    expect(screen.queryByText("Up to 3 projects")).toBeNull();
    expect((screen.getByRole("radio", { name: "Enterprise" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Pro" }));
    expect(onValueChange).toHaveBeenLastCalledWith("pro");
    expect(screen.getByRole("radio", { name: "Pro" }).getAttribute("data-state")).toBe("checked");
  });

  it("shows the other input below the track", async () => {
    const { container } = renderField(
      <RadioGroupField
        label="Plan"
        options={plans}
        appearance="segmented"
        otherOption={{ label: "Other", inputLabel: "Other plan" }}
      />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Other" }));
    const input = screen.getByRole("textbox", { name: "Other plan" });
    expect(screen.getByRole("radiogroup").contains(input)).toBe(false);
    expect(container.querySelector("[data-slot=radio-group-container]")?.contains(input)).toBe(
      true,
    );
  });
});
