import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectField } from "../select-field";
import { colors, openList, trigger } from "./helpers";

const chipsProps = {
  label: "Colores",
  options: colors,
  multiple: true as const,
  multipleDisplay: "chips" as const,
  removeChipLabel: (option: { label: string }) => `Quitar ${option.label}`,
};

describe("SelectField multiple", () => {
  it("toggles options and stays open", async () => {
    const onValueChange = vi.fn();
    render(<SelectField {...chipsProps} onValueChange={onValueChange} />);
    await openList(trigger("Colores"));
    await userEvent.keyboard("{Enter}{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["red", "blue"]);
    expect(trigger("Colores").getAttribute("aria-expanded")).toBe("true");
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["red"]);
  });

  it("closes after each pick with closeOnSelect", async () => {
    render(<SelectField {...chipsProps} closeOnSelect />);
    await openList(trigger("Colores"));
    await userEvent.keyboard("{Enter}");
    expect(trigger("Colores").getAttribute("aria-expanded")).toBe("false");
  });

  it("shows removable chips beside the button", async () => {
    const onValueChange = vi.fn();
    render(
      <SelectField {...chipsProps} defaultValue={["red", "blue"]} onValueChange={onValueChange} />,
    );
    const remove = screen.getByRole("button", { name: "Quitar Azul" });
    expect(trigger("Colores").contains(remove)).toBe(false);
    await userEvent.click(remove);
    expect(onValueChange).toHaveBeenLastCalledWith(["red"]);
    expect(document.activeElement).toBe(trigger("Colores"));
  });

  it("removes the last chip with Backspace", async () => {
    const onValueChange = vi.fn();
    render(
      <SelectField {...chipsProps} defaultValue={["red", "blue"]} onValueChange={onValueChange} />,
    );
    trigger("Colores").focus();
    await userEvent.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenLastCalledWith(["red"]);
  });

  it("keeps the selected labels in the button for screen readers", () => {
    render(<SelectField {...chipsProps} defaultValue={["red", "blue"]} />);
    expect(trigger("Colores").textContent).toBe("Rojo, Azul");
  });

  it("shows the developer's summary", () => {
    render(
      <SelectField
        label="Colores"
        options={colors}
        multiple
        multipleDisplay="summary"
        renderSummary={(selected) => `${selected.length} seleccionados`}
        defaultValue={["red", "blue", "green"]}
      />,
    );
    expect(trigger("Colores").textContent).toBe("3 seleccionados");
  });
});
