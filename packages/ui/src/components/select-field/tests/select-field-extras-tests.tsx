import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectField } from "../select-field";
import { colors, countries, openList, trigger } from "./helpers";

describe("SelectField extras", () => {
  it("renders group titles and descriptions, and disables options", async () => {
    render(<SelectField label="País" options={countries} />);
    await openList();
    expect(screen.getByText("Europa")).toBeTruthy();
    expect(screen.getByText("América")).toBeTruthy();
    expect(screen.getByText("Peso mexicano")).toBeTruthy();
    expect(screen.getByRole("option", { name: "Chile" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("disables unselected options at maxSelected", async () => {
    render(
      <SelectField
        label="Colores"
        options={colors}
        multiple
        multipleDisplay="summary"
        renderSummary={(s) => s.length}
        maxSelected={2}
        defaultValue={["red", "blue"]}
      />,
    );
    await openList(trigger("Colores"));
    expect(screen.getByRole("option", { name: "Verde" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
    expect(screen.getByRole("option", { name: "Rojo" }).getAttribute("aria-disabled")).not.toBe(
      "true",
    );
  });

  it("selects all enabled options and shows a mixed state", async () => {
    const onValueChange = vi.fn();
    render(
      <SelectField
        label="Colores"
        options={[...colors, { value: "black", label: "Negro", disabled: true }]}
        multiple
        multipleDisplay="summary"
        renderSummary={(s) => s.length}
        selectAll={{ label: "Todos los colores" }}
        defaultValue={["red"]}
        onValueChange={onValueChange}
      />,
    );
    await openList(trigger("Colores"));
    const all = screen.getByRole("option", { name: "Todos los colores" });
    expect(all.getAttribute("aria-checked")).toBe("mixed");
    // The list opens on the selected option (Rojo); Home moves to "select all".
    await userEvent.keyboard("{Home}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["red", "blue", "green", "yellow"]);
    expect(
      screen.getByRole("option", { name: "Todos los colores" }).getAttribute("aria-checked"),
    ).toBe("true");
  });

  it("offers to create the typed value and calls onCreate", async () => {
    const onCreate = vi.fn();
    const onValueChange = vi.fn();
    render(
      <SelectField
        label="País"
        options={countries}
        searchable
        searchLabel="Buscar país"
        creatable
        createLabel={(query) => `Crear "${query}"`}
        onCreate={onCreate}
        onValueChange={onValueChange}
      />,
    );
    await openList();
    await userEvent.keyboard("Perú");
    expect(screen.getByRole("option", { name: 'Crear "Perú"' })).toBeTruthy();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onCreate).toHaveBeenCalledWith("Perú");
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
