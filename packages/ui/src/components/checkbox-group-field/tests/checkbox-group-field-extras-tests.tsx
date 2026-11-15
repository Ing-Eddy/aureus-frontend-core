import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckboxGroupField } from "../checkbox-group-field";
import { box, channels, renderField } from "./helpers";

describe("CheckboxGroupField extras", () => {
  it("select all checks the enabled options and shows the mixed state", async () => {
    const onValueChange = vi.fn();
    renderField(
      <CheckboxGroupField
        label="Channels"
        options={channels}
        selectAll={{ label: "All channels" }}
        onValueChange={onValueChange}
      />,
    );
    const all = box("All channels");
    expect(all.getAttribute("aria-checked")).toBe("false");
    await userEvent.click(box("SMS"));
    expect(all.getAttribute("aria-checked")).toBe("mixed");
    await userEvent.click(all);
    expect(onValueChange).toHaveBeenLastCalledWith(["email", "sms", "slack"]);
    expect(all.getAttribute("aria-checked")).toBe("true");
    await userEvent.click(all);
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("select all stops at the limit and clears from there", async () => {
    const onValueChange = vi.fn();
    renderField(
      <CheckboxGroupField
        label="Channels"
        options={channels}
        selectAll={{ label: "All channels" }}
        maxSelected={2}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(box("All channels"));
    expect(onValueChange).toHaveBeenLastCalledWith(["email", "sms"]);
    await userEvent.click(box("All channels"));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("disables unchecked options at the limit, with the message only when provided", async () => {
    const { container } = renderField(
      <>
        <CheckboxGroupField
          label="Silent"
          options={[
            { value: "a", label: "A1" },
            { value: "b", label: "B1" },
          ]}
          maxSelected={1}
        />
        <CheckboxGroupField
          label="Channels"
          options={channels}
          maxSelected={2}
          maxSelectedMessage="Up to 2 channels"
        />
      </>,
    );
    const [silent, withMessage] = [
      ...container.querySelectorAll("[data-slot=checkbox-group-limit]"),
    ];
    await userEvent.click(box("A1"));
    expect((box("B1") as HTMLButtonElement).disabled).toBe(true);
    expect(silent?.textContent).toBe("");

    await userEvent.click(box(/^Email/));
    await userEvent.click(box("SMS"));
    expect((box("Slack") as HTMLButtonElement).disabled).toBe(true);
    expect(withMessage?.textContent).toBe("Up to 2 channels");
    await userEvent.click(box("SMS"));
    expect((box("Slack") as HTMLButtonElement).disabled).toBe(false);
    expect(withMessage?.textContent).toBe("");
  });

  it("toggles a card from its empty area", async () => {
    const onValueChange = vi.fn();
    const { container } = renderField(
      <CheckboxGroupField
        label="Channels"
        options={channels}
        appearance="card"
        onValueChange={onValueChange}
      />,
    );
    const cards = container.querySelectorAll<HTMLElement>("[data-slot=checkbox-row]");
    await userEvent.click(cards[1] as HTMLElement);
    expect(onValueChange).toHaveBeenLastCalledWith(["sms"]);
  });

  it("puts every box at the end with checkboxPosition='end'", () => {
    const { container } = renderField(
      <CheckboxGroupField label="Channels" options={channels} checkboxPosition="end" />,
    );
    const rows = [...container.querySelectorAll("[data-slot=checkbox-row]")];
    expect(rows.every((row) => row.getAttribute("data-position") === "end")).toBe(true);
  });

  it("keeps every other default when one extra is set", () => {
    const { container } = renderField(
      <>
        <CheckboxGroupField label="A" options={channels} appearance="card" />
        <CheckboxGroupField label="B" options={channels} columns={3} />
        <CheckboxGroupField label="C" options={channels} maxSelected={1} />
      </>,
    );
    const groups = [...container.querySelectorAll("[data-slot=checkbox-group-options]")];
    expect(groups.map((group) => group.getAttribute("data-orientation"))).toEqual([
      "vertical",
      "vertical",
      "vertical",
    ]);
    const firstRows = groups.map((group) =>
      group.querySelector("[data-slot=checkbox-row]")?.getAttribute("data-appearance"),
    );
    expect(firstRows).toEqual(["card", "plain", "plain"]);
    expect(
      screen
        .getAllByRole("checkbox")
        .filter((checkbox) => checkbox.getAttribute("aria-checked") === "true"),
    ).toHaveLength(0);
  });
});
