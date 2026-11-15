import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectField } from "../select-field";
import { countries, openList, optionTexts, trigger } from "./helpers";

describe("SelectField single", () => {
  it("opens, selects with the keyboard, closes and returns focus", async () => {
    const onValueChange = vi.fn();
    render(<SelectField label="País" options={countries} onValueChange={onValueChange} />);
    await openList();
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(optionTexts()).toEqual(["España", "Francia", "MéxicoPeso mexicano", "Chile"]);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("fr");
    expect(trigger().textContent).toBe("Francia");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger());
  });

  it("closes with Escape and returns focus", async () => {
    render(<SelectField label="País" options={countries} />);
    await openList();
    await userEvent.keyboard("{Escape}");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger());
  });

  it("follows a controlled value", () => {
    const { rerender } = render(
      <SelectField label="País" options={countries} value="es" onValueChange={() => {}} />,
    );
    expect(trigger().textContent).toBe("España");
    rerender(<SelectField label="País" options={countries} value="mx" onValueChange={() => {}} />);
    expect(trigger().textContent).toBe("México");
  });

  it("can stay open after a pick with closeOnSelect={false}", async () => {
    render(<SelectField label="País" options={countries} closeOnSelect={false} />);
    await openList();
    await userEvent.keyboard("{Enter}");
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
  });

  it("clears with the clear button, named by clearLabel", async () => {
    const onValueChange = vi.fn();
    render(
      <SelectField
        label="País"
        options={countries}
        defaultValue="es"
        clearable
        clearLabel="Quitar país"
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Quitar país" }));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(screen.queryByRole("button", { name: "Quitar país" })).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });
});
