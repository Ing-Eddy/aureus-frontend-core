import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SliderControl } from "../slider-control";
import { lenientSchema, renderInForm } from "./render-in-form";

const save = () => userEvent.click(screen.getByRole("button", { name: "Save" }));
const thumb = (name: string) => screen.getByRole("slider", { name });

function Both() {
  return (
    <>
      <SliderControl name="volume" label="Volumen" />
      <SliderControl
        name="price"
        label="Precio"
        range
        min={0}
        max={1000}
        step={10}
        thumbLabels={["Precio mínimo", "Precio máximo"]}
      />
    </>
  );
}

describe("SliderControl in a form", () => {
  it("stores a number and a pair", async () => {
    const { onSubmit } = renderInForm(<Both />);
    fireEvent.keyDown(thumb("Volumen"), { key: "ArrowRight" });
    fireEvent.keyDown(thumb("Precio máximo"), { key: "PageDown" });
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ volume: 41, price: [200, 700] });
  });

  it("treats a missing value as min, or [min, max] for a range", () => {
    renderInForm(<Both />, {});
    expect(thumb("Volumen").getAttribute("aria-valuenow")).toBe("0");
    expect(thumb("Precio mínimo").getAttribute("aria-valuenow")).toBe("0");
    expect(thumb("Precio máximo").getAttribute("aria-valuenow")).toBe("1000");
  });

  it("shows the schema message, marks the thumbs invalid and focuses the first one", async () => {
    const { onSubmit } = renderInForm(<Both />, { volume: 40, price: [200, 250] });
    await save();
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe("El rango debe ser de al menos 100."),
    );
    expect(thumb("Precio mínimo").getAttribute("aria-invalid")).toBe("true");
    expect(thumb("Precio máximo").getAttribute("aria-invalid")).toBe("true");
    expect(thumb("Volumen").hasAttribute("aria-invalid")).toBe(false);
    expect(document.activeElement).toBe(thumb("Precio mínimo"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits a value typed in the linked input once it is committed", async () => {
    const { onSubmit } = renderInForm(
      <SliderControl name="volume" label="Volumen" withInput inputLabel="Exacto" />,
      { volume: 40, price: [0, 100] },
      lenientSchema,
    );
    const input = screen.getByRole("spinbutton", { name: "Exacto" });
    await userEvent.clear(input);
    await userEvent.type(input, "70");
    expect(thumb("Volumen").getAttribute("aria-valuenow")).toBe("40");
    await userEvent.tab();
    expect(thumb("Volumen").getAttribute("aria-valuenow")).toBe("70");
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ volume: 70, price: [0, 100] });
  });

  it("leaves disabled values out and keeps loading values", async () => {
    const { onSubmit } = renderInForm(
      <>
        <SliderControl name="volume" label="Volumen" disabled />
        <SliderControl
          name="price"
          label="Precio"
          range
          max={1000}
          thumbLabels={["Mínimo", "Máximo"]}
          loading
          loadingLabel="Cargando"
        />
      </>,
      { volume: 40, price: [200, 800] },
      lenientSchema,
    );
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ volume: undefined, price: [200, 800] });
  });
});
