import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SwitchField } from "../switch-field";
import { renderField, toggle } from "./helpers";

describe("SwitchField extras", () => {
  it("places the switch at the end, in a card, and small", async () => {
    const onValueChange = vi.fn();
    const { container } = renderField(
      <SwitchField
        switchLabel="Compact mode"
        switchPosition="end"
        appearance="card"
        size="sm"
        onValueChange={onValueChange}
      />,
    );
    const row = container.querySelector("[data-slot=switch-row]") as HTMLElement;
    expect(row.getAttribute("data-position")).toBe("end");
    expect(row.getAttribute("data-appearance")).toBe("card");
    expect(toggle("Compact mode").getAttribute("data-size")).toBe("sm");
    await userEvent.click(row);
    expect(onValueChange).toHaveBeenLastCalledWith(true);
  });

  it("shows the state label and thumb icon of the current state", async () => {
    renderField(
      <SwitchField
        switchLabel="Alerts"
        stateLabels={{ on: "Yes", off: "No" }}
        thumbIcons={{ on: <svg data-testid="on" />, off: <svg data-testid="off" /> }}
      />,
    );
    expect(screen.getByText("Yes").className).toContain("invisible");
    expect(screen.getByTestId("off")).toBeTruthy();
    await userEvent.click(toggle("Alerts"));
    expect(screen.getByText("No").className).toContain("invisible");
    expect(screen.getByTestId("on")).toBeTruthy();
  });

  it("toggles from its state label", async () => {
    const onValueChange = vi.fn();
    renderField(
      <SwitchField
        switchLabel="Alerts"
        stateLabels={{ on: "On", off: "Off" }}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByText("Off"));
    expect(onValueChange).toHaveBeenLastCalledWith(true);
  });

  it("keeps every other default when one extra is set", () => {
    const { container } = renderField(
      <>
        <SwitchField switchLabel="A" appearance="card" />
        <SwitchField switchLabel="B" size="sm" />
        <SwitchField switchLabel="C" stateLabels={{ on: "On", off: "Off" }} />
      </>,
    );
    const rows = [...container.querySelectorAll("[data-slot=switch-row]")];
    expect(rows.map((row) => row.getAttribute("data-appearance"))).toEqual([
      "card",
      "plain",
      "plain",
    ]);
    expect(rows.map((row) => row.getAttribute("data-position"))).toEqual([
      "start",
      "start",
      "start",
    ]);
    expect(screen.getAllByRole("switch").map((sw) => sw.getAttribute("data-size"))).toEqual([
      "default",
      "sm",
      "default",
    ]);
  });
});
