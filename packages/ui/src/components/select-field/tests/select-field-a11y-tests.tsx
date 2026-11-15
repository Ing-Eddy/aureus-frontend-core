import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { SelectField } from "../select-field";
import { countries, openList, trigger } from "./helpers";

describe("SelectField accessibility", () => {
  it("is a labelled combobox with the field's descriptions and states", () => {
    render(
      <TooltipProvider>
        <SelectField
          label="País"
          options={countries}
          required
          helperText="Donde vives"
          info="Para impuestos"
          error
        />
      </TooltipProvider>,
    );
    const button = trigger();
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("aria-haspopup")).toBe("listbox");
    expect(button.getAttribute("aria-required")).toBe("true");
    expect(button.getAttribute("aria-invalid")).toBe("true");
    const described = (button.getAttribute("aria-describedby") ?? "")
      .split(" ")
      .map((id) => document.getElementById(id)?.textContent);
    expect(described).toEqual(["Donde vives", "Para impuestos"]);
  });

  it("names the clear and chip buttons with the developer's texts", () => {
    render(
      <SelectField
        label="País"
        options={countries}
        multiple
        multipleDisplay="chips"
        removeChipLabel={(option) => `Quitar ${option.label}`}
        clearable
        clearLabel="Vaciar"
        defaultValue={["es"]}
      />,
    );
    expect(screen.getByRole("button", { name: "Quitar España" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Vaciar" })).toBeTruthy();
  });

  it("names the listbox with the field label, with and without search", async () => {
    render(
      <TooltipProvider>
        <SelectField label="País" options={countries} />
        <SelectField label="Ciudad" options={countries} searchable searchLabel="Buscar ciudad" />
      </TooltipProvider>,
    );
    await openList();
    expect(await screen.findByRole("listbox", { name: "País" })).toBeTruthy();
    await openList(trigger(/^Ciudad/));
    expect(await screen.findByRole("listbox", { name: "Ciudad" })).toBeTruthy();
  });

  it("names the search popup, which is a dialog, with the search label", async () => {
    render(
      <TooltipProvider>
        <SelectField label="País" options={countries} searchable searchLabel="Buscar país" />
      </TooltipProvider>,
    );
    await openList();
    expect(await screen.findByRole("dialog", { name: "Buscar país" })).toBeTruthy();
  });
});
