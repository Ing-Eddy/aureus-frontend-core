import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadioGroupField } from "../radio-group-field";
import { plans, radio, renderField } from "./helpers";

describe("RadioGroupField extras", () => {
  it("selects a card from its empty area", async () => {
    const onValueChange = vi.fn();
    const { container } = renderField(
      <RadioGroupField
        label="Plan"
        options={plans}
        appearance="card"
        onValueChange={onValueChange}
      />,
    );
    const cards = container.querySelectorAll<HTMLElement>("[data-slot=radio-row]");
    await userEvent.click(cards[1] as HTMLElement);
    expect(onValueChange).toHaveBeenLastCalledWith("pro");
  });

  it("puts every radio at the end with radioPosition='end'", () => {
    const { container } = renderField(
      <RadioGroupField label="Plan" options={plans} radioPosition="end" />,
    );
    const rows = [...container.querySelectorAll("[data-slot=radio-row]")];
    expect(rows.every((row) => row.getAttribute("data-position") === "end")).toBe(true);
  });

  it("keeps the selection when the checked radio is clicked, by default", async () => {
    const onValueChange = vi.fn();
    renderField(
      <RadioGroupField
        label="Plan"
        options={plans}
        defaultValue="pro"
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(radio("Pro"));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(radio("Pro").getAttribute("aria-checked")).toBe("true");
  });

  it("unchecks the checked radio with deselectable, by pointer and with Space", async () => {
    const onValueChange = vi.fn();
    renderField(
      <RadioGroupField
        label="Plan"
        options={plans}
        defaultValue="pro"
        deselectable
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(radio("Pro"));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(radio("Pro").getAttribute("aria-checked")).toBe("false");
    await userEvent.click(radio("Team"));
    radio("Team").focus();
    await userEvent.keyboard(" ");
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("keeps every other default when one extra is set", () => {
    const { container } = renderField(
      <>
        <RadioGroupField label="A" options={plans} appearance="card" />
        <RadioGroupField label="B" options={plans} columns={3} />
        <RadioGroupField label="C" options={plans} deselectable />
      </>,
    );
    const groups = screen.getAllByRole("radiogroup");
    expect(groups.map((group) => group.getAttribute("data-layout"))).toEqual([
      "vertical",
      "vertical",
      "vertical",
    ]);
    const firstRows = groups.map((group) =>
      group.querySelector("[data-slot=radio-row]")?.getAttribute("data-appearance"),
    );
    expect(firstRows).toEqual(["card", "plain", "plain"]);
    expect(container.querySelectorAll("[data-state=checked]")).toHaveLength(0);
  });
});
