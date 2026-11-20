import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DateTimeControl } from "../date-time-control";
import { lenientSchema, renderInForm } from "./render-in-form";

const texts = {
  openCalendarLabel: "Abrir calendario",
  previousMonthLabel: "Mes anterior",
  nextMonthLabel: "Mes siguiente",
} as const;
const save = () => userEvent.click(screen.getByRole("button", { name: "Guardar" }));
const segments = (group: string) =>
  [
    ...screen.getByRole("group", { name: group }).querySelectorAll("[role=spinbutton]"),
  ] as HTMLElement[];

function Meeting() {
  return (
    <DateTimeControl name="meeting" label="Reunión" mode="datetime" locale="es-ES" {...texts} />
  );
}

describe("DateTimeControl in a form", () => {
  it("stores the ISO string, and null while incomplete", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderInForm(
      <>
        <Meeting />
        <DateTimeControl name="birth" label="Nacimiento" locale="es-ES" {...texts} />
      </>,
      { meeting: null, birth: null },
      lenientSchema,
    );
    await user.click(segments("Reunión")[0] as HTMLElement);
    await user.keyboard("120820261430");
    await user.click(segments("Nacimiento")[0] as HTMLElement);
    await user.keyboard("0101");
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ meeting: "2026-08-12T14:30", birth: null });
  });

  it("treats a missing value as empty", () => {
    renderInForm(<Meeting />, {});
    expect(segments("Reunión").every((item) => item.textContent?.startsWith("–"))).toBe(true);
  });

  it("shows the schema message, marks the segments invalid and focuses the first one", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderInForm(<Meeting />);
    await user.click(segments("Reunión")[0] as HTMLElement);
    await user.keyboard("12082026");
    await save();
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe("Elige fecha y hora."));
    for (const item of segments("Reunión")) expect(item.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(segments("Reunión")[0]);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("is not touched by opening the calendar, only by leaving the field", async () => {
    const user = userEvent.setup();
    renderInForm(<Meeting />);
    await user.click(screen.getByRole("button", { name: "Abrir calendario" }));
    await waitFor(() => expect(screen.getByRole("dialog")).toBeTruthy());
    expect(screen.getByTestId("touched").textContent).toBe("false");
    await user.keyboard("{Escape}");
    await user.click(document.body);
    await waitFor(() => expect(screen.getByTestId("touched").textContent).toBe("true"));
  });

  it("leaves disabled values out and keeps loading values", async () => {
    const { onSubmit } = renderInForm(
      <>
        <DateTimeControl name="meeting" label="Reunión" mode="datetime" disabled {...texts} />
        <DateTimeControl
          name="birth"
          label="Nacimiento"
          loading
          loadingLabel="Cargando"
          {...texts}
        />
      </>,
      { meeting: "2026-08-12T14:30", birth: "1990-05-01" },
      lenientSchema,
    );
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ meeting: undefined, birth: "1990-05-01" });
  });
});
