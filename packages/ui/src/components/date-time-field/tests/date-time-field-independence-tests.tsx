import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DateTimeField } from "../date-time-field";
import { calendarTexts, renderField, segmentTexts } from "./helpers";

const base = {
  label: "Fecha",
  locale: "es-ES",
  defaultValue: "2026-08-01",
  ...calendarTexts,
} as const;

/** What a plain date field renders: three segments and a calendar button. */
function plainShape() {
  return {
    segments: screen.getAllByRole("spinbutton").map((item) => item.getAttribute("aria-label")),
    texts: segmentTexts(),
    buttons: screen.getAllByRole("button").map((item) => item.getAttribute("aria-label")),
  };
}

describe("DateTimeField independence", () => {
  it("renders three segments and a calendar button with no extras", () => {
    renderField(<DateTimeField {...base} />);
    expect(plainShape()).toEqual({
      segments: ["día", "mes", "año"],
      texts: ["01", "08", "2026"],
      buttons: ["Abrir calendario"],
    });
  });

  it.each([
    ["presets", { presets: [{ label: "Hoy", value: "2026-08-10" }], presetsLabel: "Atajos" }],
    ["limits", { min: "2026-01-01", max: "2026-12-31" }],
    ["blocked days", { disabledDates: ["2026-08-05"], isDateDisabled: () => false }],
    ["weekStartsOn", { weekStartsOn: 0 }],
    ["name", { name: "fecha" }],
  ])("changes nothing else with %s", (_name, extra) => {
    renderField(<DateTimeField {...base} {...(extra as object)} />);
    expect(plainShape()).toEqual({
      segments: ["día", "mes", "año"],
      texts: ["01", "08", "2026"],
      buttons: ["Abrir calendario"],
    });
  });

  it("adds only its button with an action", () => {
    renderField(<DateTimeField {...base} action={{ children: "Hoy", onClick: () => {} }} />);
    expect(
      screen
        .getAllByRole("button")
        .map((item) => item.textContent || item.getAttribute("aria-label")),
    ).toEqual(["Abrir calendario", "Hoy"]);
    expect(segmentTexts()).toEqual(["01", "08", "2026"]);
  });

  it("changes only the time segments with the time options", () => {
    const time = { label: "Hora", mode: "time", locale: "es-ES", defaultValue: "14:30" } as const;
    const { unmount } = renderField(<DateTimeField {...time} />);
    expect(segmentTexts()).toEqual(["14", "30"]);
    unmount();
    const steps = renderField(<DateTimeField {...time} minuteStep={15} secondStep={10} />);
    expect(segmentTexts()).toEqual(["14", "30"]);
    steps.unmount();
    const twelve = renderField(<DateTimeField {...time} hourCycle={12} />);
    expect(screen.getAllByRole("spinbutton")).toHaveLength(3);
    twelve.unmount();
    renderField(<DateTimeField {...time} granularity="second" />);
    expect(segmentTexts()).toEqual(["14", "30", "00"]);
  });
});
