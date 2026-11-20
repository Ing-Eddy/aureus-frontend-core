import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DateSelectionControl } from "../date-selection-control";
import { lenientSchema, renderInForm } from "./render-in-form";

const months = { previousMonthLabel: "Mes anterior", nextMonthLabel: "Mes siguiente" } as const;
const ends = {
  openCalendarLabel: "Abrir calendario",
  startLabel: "Llegada",
  endLabel: "Salida",
} as const;
const save = () => userEvent.click(screen.getByRole("button", { name: "Guardar" }));
const segmentsOf = (group: string) =>
  [
    ...screen.getByRole("group", { name: group }).querySelectorAll("[role=spinbutton]"),
  ] as HTMLElement[];

function Both() {
  return (
    <>
      <DateSelectionControl
        name="stay"
        label="Estancia"
        selection="range"
        locale="es-ES"
        {...ends}
        {...months}
      />
      <DateSelectionControl
        name="days"
        label="Días"
        selection="multiple"
        locale="es-ES"
        {...months}
      />
    </>
  );
}

describe("DateSelectionControl in a form", () => {
  it("stores the range and the list", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderInForm(
      <Both />,
      { stay: null, days: ["2026-08-05"] },
      lenientSchema,
    );
    await user.click(segmentsOf("Llegada")[0] as HTMLElement);
    await user.keyboard("01082026");
    await user.click(segmentsOf("Salida")[0] as HTMLElement);
    await user.keyboard("27082026");
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      stay: { from: "2026-08-01", to: "2026-08-27" },
      days: ["2026-08-05"],
    });
  });

  it("treats missing values as null and []", () => {
    renderInForm(<Both />, {});
    expect(segmentsOf("Llegada").every((item) => item.textContent?.startsWith("–"))).toBe(true);
    expect(screen.getByRole("button", { name: /^Días/ }).textContent).toBe("");
  });

  it("shows the schema message and focuses the start segments", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderInForm(<Both />, { stay: null, days: ["2026-08-05"] });
    await user.click(segmentsOf("Llegada")[0] as HTMLElement);
    await user.keyboard("01082026");
    await save();
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe("Elige la fecha de salida."),
    );
    expect(document.activeElement).toBe(segmentsOf("Llegada")[0]);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("focuses the summary button of several days", async () => {
    renderInForm(<Both />, { stay: { from: "2026-08-01", to: "2026-08-02" }, days: [] });
    await save();
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe("Elige al menos un día."),
    );
    expect(document.activeElement).toBe(screen.getByRole("button", { name: /^Días/ }));
  });

  it("leaves disabled values out and keeps loading values", async () => {
    const { onSubmit } = renderInForm(
      <>
        <DateSelectionControl
          name="stay"
          label="Estancia"
          selection="range"
          disabled
          {...ends}
          {...months}
        />
        <DateSelectionControl
          name="days"
          label="Días"
          selection="multiple"
          loading
          loadingLabel="Cargando"
          {...months}
        />
      </>,
      { stay: { from: "2026-08-01", to: "2026-08-02" }, days: ["2026-08-05"] },
      lenientSchema,
    );
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ stay: undefined, days: ["2026-08-05"] });
  });
});
