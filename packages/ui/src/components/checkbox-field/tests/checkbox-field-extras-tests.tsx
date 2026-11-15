import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckboxField } from "../checkbox-field";
import { box, renderField } from "./helpers";

describe("CheckboxField extras", () => {
  it("shows the mixed state and reports the checked value when activated", async () => {
    const onValueChange = vi.fn();
    renderField(
      <CheckboxField
        checkboxLabel="Select all"
        indeterminate
        checkedValue="all"
        uncheckedValue="none"
        onValueChange={onValueChange}
      />,
    );
    expect(box("Select all").getAttribute("aria-checked")).toBe("mixed");
    await userEvent.click(box("Select all"));
    expect(onValueChange).toHaveBeenLastCalledWith("all");
    // Visual only: the consumer clears it.
    expect(box("Select all").getAttribute("aria-checked")).toBe("mixed");
  });

  it("places the box after the text with checkboxPosition='end'", () => {
    const { container } = renderField(
      <CheckboxField checkboxLabel="Compact mode" checkboxPosition="end" />,
    );
    const slot = container.querySelector("[data-slot=checkbox-box-slot]");
    expect(slot?.className).toContain("order-last");
    expect(container.querySelector("[data-slot=checkbox-row]")?.getAttribute("data-position")).toBe(
      "end",
    );
  });

  it("toggles from anywhere in a card once, but not from its link or action", async () => {
    const onValueChange = vi.fn();
    const onAction = vi.fn();
    const { container } = renderField(
      <CheckboxField
        checkboxLabel={
          <>
            Compact mode <a href="#more">more</a>
          </>
        }
        appearance="card"
        action={{ children: "Edit", onClick: onAction }}
        onValueChange={onValueChange}
      />,
    );
    const card = container.querySelector("[data-slot=checkbox-row]") as HTMLElement;
    await userEvent.click(card);
    expect(onValueChange).toHaveBeenLastCalledWith(true);
    await userEvent.click(screen.getByText(/Compact mode/));
    expect(onValueChange).toHaveBeenLastCalledWith(false);
    await userEvent.click(screen.getByRole("link", { name: "more" }));
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("keeps every other default when one extra is set", () => {
    const { container } = renderField(
      <>
        <CheckboxField checkboxLabel="Plain" />
        <CheckboxField checkboxLabel="Card" appearance="card" />
        <CheckboxField checkboxLabel="End" checkboxPosition="end" />
        <CheckboxField checkboxLabel="Mixed" indeterminate />
      </>,
    );
    const rows = [...container.querySelectorAll("[data-slot=checkbox-row]")];
    expect(rows.map((row) => row.getAttribute("data-appearance"))).toEqual([
      "plain",
      "card",
      "plain",
      "plain",
    ]);
    expect(rows.map((row) => row.getAttribute("data-position"))).toEqual([
      "start",
      "start",
      "end",
      "start",
    ]);
    expect(box("Card").getAttribute("aria-checked")).toBe("false");
    expect(box("End").getAttribute("aria-checked")).toBe("false");
  });

  it("indents the helper under the text only in a plain row with the box at the start", () => {
    const { container } = renderField(
      <>
        <CheckboxField checkboxLabel="A" helperText="Plain" />
        <CheckboxField checkboxLabel="B" helperText="Card" appearance="card" />
        <CheckboxField checkboxLabel="C" helperText="End" checkboxPosition="end" />
      </>,
    );
    const helpers = [...container.querySelectorAll("[data-slot=field-description]")];
    expect(helpers.map((helper) => helper.className.includes("ps-6"))).toEqual([
      true,
      false,
      false,
    ]);
  });
});
