import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SelectField } from "../select-field";
import { colors, countries, openList, trigger } from "./helpers";

const status = () => screen.getByRole("status");

describe("SelectField messages have no defaults", () => {
  it("placeholder: nothing without it, the text with it", () => {
    const { unmount } = render(<SelectField label="País" options={countries} />);
    expect(trigger().textContent).toBe("");
    unmount();
    render(<SelectField label="País" options={countries} placeholder="Elige un país" />);
    expect(trigger().textContent).toBe("Elige un país");
  });

  it("emptyMessage: nothing without it, the text with it", async () => {
    const { unmount } = render(<SelectField label="País" options={[]} />);
    await openList();
    expect(status().textContent).toBe("");
    unmount();
    render(<SelectField label="País" options={[]} emptyMessage="No hay países" />);
    await openList();
    expect(status().textContent).toBe("No hay países");
  });

  it("noResultsMessage: only in its situation", async () => {
    const { unmount } = render(
      <SelectField label="País" options={countries} searchable searchLabel="Buscar país" />,
    );
    await openList();
    await userEvent.keyboard("zzz");
    expect(status().textContent).toBe("");
    unmount();
    render(
      <SelectField
        label="País"
        options={countries}
        searchable
        searchLabel="Buscar país"
        noResultsMessage="Ningún país coincide"
      />,
    );
    await openList();
    expect(status().textContent).toBe("");
    await userEvent.keyboard("zzz");
    expect(status().textContent).toBe("Ningún país coincide");
    await userEvent.keyboard("{Backspace>3/}esp");
    expect(status().textContent).toBe("");
  });

  it("optionsLoadingMessage: shown while loading, if provided", async () => {
    render(
      <SelectField
        label="País"
        options={countries}
        searchable
        searchLabel="Buscar país"
        filter={false}
        optionsLoading
        optionsLoadingMessage="Buscando…"
      />,
    );
    await openList();
    expect(status().textContent).toBe("Buscando…");
  });

  it("maxSelectedMessage: shown at the limit, if provided", async () => {
    render(
      <SelectField
        label="Colores"
        options={colors}
        multiple
        multipleDisplay="summary"
        renderSummary={(s) => s.length}
        maxSelected={2}
        maxSelectedMessage="Máximo 2 colores"
        defaultValue={["red", "blue"]}
      />,
    );
    await openList(trigger("Colores"));
    expect(screen.getByText("Máximo 2 colores")).toBeTruthy();
  });
});
