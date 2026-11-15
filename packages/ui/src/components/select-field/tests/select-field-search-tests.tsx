import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectField } from "../select-field";
import { countries, openList, optionTexts } from "./helpers";

describe("SelectField search", () => {
  it("focuses a labelled search box and filters ignoring accents", async () => {
    render(
      <SelectField
        label="País"
        options={countries}
        searchable
        searchLabel="Buscar país"
        searchPlaceholder="Escribe para filtrar"
      />,
    );
    await openList();
    const search = screen.getByRole("combobox", { name: "Buscar país" });
    expect(document.activeElement).toBe(search);
    expect(search.getAttribute("placeholder")).toBe("Escribe para filtrar");
    await userEvent.keyboard("espana");
    expect(optionTexts()).toEqual(["España"]);
  });

  it("reports the search text and does not filter with filter={false}", async () => {
    const onSearchChange = vi.fn();
    render(
      <SelectField
        label="País"
        options={countries}
        searchable
        searchLabel="Buscar país"
        filter={false}
        onSearchChange={onSearchChange}
      />,
    );
    await openList();
    await userEvent.keyboard("zz");
    expect(onSearchChange).toHaveBeenLastCalledWith("zz");
    expect(optionTexts()).toHaveLength(4);
  });

  it("selects from the search box with the keyboard", async () => {
    const onValueChange = vi.fn();
    render(
      <SelectField
        label="País"
        options={countries}
        searchable
        searchLabel="Buscar país"
        onValueChange={onValueChange}
      />,
    );
    await openList();
    await userEvent.keyboard("fra{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("fr");
  });
});
