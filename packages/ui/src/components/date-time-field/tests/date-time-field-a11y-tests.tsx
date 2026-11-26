import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DateTimeField } from "../date-time-field";
import { calendarTexts, renderField, segment } from "./helpers";

describe("DateTimeField accessibility", () => {
  it("names the segments group by the label, and each segment by Intl", () => {
    renderField(<DateTimeField label="Nacimiento" locale="es-ES" {...calendarTexts} />);
    const group = screen.getByRole("group", { name: "Nacimiento" });
    expect(group.getAttribute("data-slot")).toBe("date-segments");
    const names = screen.getAllByRole("spinbutton").map((item) => item.getAttribute("aria-label"));
    expect(names).toEqual(["día", "mes", "año"]);
    const button = screen.getByRole("button", { name: "Abrir calendario" });
    expect(button.getAttribute("aria-haspopup")).toBe("dialog");
  });

  it("describes each segment and carries the field's state", () => {
    renderField(
      <DateTimeField
        label="Fecha"
        locale="es-ES"
        helperText="Formato del país"
        info="Más datos"
        infoLabel="Información"
        aria-describedby="extra"
        required
        error
        {...calendarTexts}
      />,
    );
    const day = segment("día");
    const ids = day.getAttribute("aria-describedby")?.split(" ") ?? [];
    expect(ids[0]).toBe("extra");
    expect(ids).toHaveLength(3);
    for (const id of ids.slice(1)) expect(document.getElementById(id)).not.toBeNull();
    expect(day.getAttribute("aria-required")).toBe("true");
    expect(day.getAttribute("aria-invalid")).toBe("true");
  });

  it("marks the group busy and disabled while loading", () => {
    renderField(
      <DateTimeField
        label="Fecha"
        locale="es-ES"
        loading
        loadingLabel="Cargando"
        {...calendarTexts}
      />,
    );
    const group = screen.getByRole("group", { name: "Fecha" });
    expect(group.getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("status", { name: "Cargando" })).toBeTruthy();
    expect(segment("día").getAttribute("aria-disabled")).toBe("true");
    expect(
      (screen.getByRole("button", { name: "Abrir calendario" }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("uses aria-label when there is no label, and warns when nothing names it", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { unmount } = renderField(
      <DateTimeField aria-label="Fecha de entrega" locale="es-ES" {...calendarTexts} />,
    );
    expect(screen.getByRole("group", { name: "Fecha de entrega" })).toBeTruthy();
    expect(warn).not.toHaveBeenCalled();
    unmount();
    renderField(<DateTimeField locale="es-ES" {...calendarTexts} />);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("DateTimeField: the date field has no accessible name"),
    );
    warn.mockRestore();
  });
});
