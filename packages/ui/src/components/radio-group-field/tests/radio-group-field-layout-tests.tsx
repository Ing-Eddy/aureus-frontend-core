import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RadioGroupField } from "../radio-group-field";
import { plans, renderField } from "./helpers";

describe("RadioGroupField layout", () => {
  it("stacks the options with vertical arrows by default", () => {
    renderField(<RadioGroupField label="Plan" options={plans} />);
    const group = screen.getByRole("radiogroup");
    expect(group.className).toContain("flex-col");
    expect(group.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("places them inline with horizontal arrows", () => {
    renderField(<RadioGroupField label="Plan" options={plans} orientation="horizontal" />);
    const group = screen.getByRole("radiogroup");
    expect(group.className).toContain("flex-wrap");
    expect(group.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("uses a container-query grid with columns, and both arrow axes", () => {
    const { container } = renderField(<RadioGroupField label="Plan" options={plans} columns={3} />);
    const group = screen.getByRole("radiogroup");
    expect(group.getAttribute("data-columns")).toBe("3");
    expect(group.className).toContain("@lg:grid-cols-3");
    expect(group.hasAttribute("aria-orientation")).toBe(false);
    expect(container.querySelector("[data-slot=radio-group-container]")?.className).toContain(
      "@container",
    );
  });
});
