import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DateSelectionField } from "../date-selection-field";
import { monthTexts, rangeTexts, renderField } from "./helpers";

const range = {
  label: "Estancia",
  selection: "range",
  locale: "es-ES",
  defaultValue: { from: "2026-08-01", to: "2026-08-27" },
  ...rangeTexts,
} as const;
const multiple = {
  label: "Días",
  selection: "multiple",
  locale: "es-ES",
  defaultValue: ["2026-08-01"],
  ...monthTexts,
} as const;

const shape = () => ({
  segments: screen.queryAllByRole("spinbutton").map((item) => item.textContent),
  buttons: screen
    .getAllByRole("button")
    .map((item) => item.getAttribute("aria-label") ?? item.textContent),
});

describe("DateSelectionField independence", () => {
  it("renders two groups and a calendar button for a range, and a summary for several days", () => {
    const { unmount } = renderField(<DateSelectionField {...range} />);
    expect(shape()).toEqual({
      segments: ["01", "08", "2026", "27", "08", "2026"],
      buttons: ["Abrir calendario"],
    });
    unmount();
    renderField(<DateSelectionField {...multiple} />);
    expect(shape().segments).toEqual([]);
    expect(shape().buttons).toHaveLength(1);
  });

  it.each([
    ["minDays and maxDays", { minDays: 2, maxDays: 30 }],
    ["excludeDisabled", { excludeDisabled: true }],
    ["limits", { min: "2026-01-01", max: "2026-12-31" }],
    ["blocked days", { disabledDates: ["2026-08-05"], isDateDisabled: () => false }],
    [
      "presets",
      {
        presets: [{ label: "Hoy", value: { from: "2026-08-01", to: "2026-08-01" } }],
        presetsLabel: "Atajos",
      },
    ],
    ["weekStartsOn", { weekStartsOn: 0 }],
  ])("changes nothing else in a range with %s", (_name, extra) => {
    renderField(<DateSelectionField {...range} {...(extra as object)} />);
    expect(shape()).toEqual({
      segments: ["01", "08", "2026", "27", "08", "2026"],
      buttons: ["Abrir calendario"],
    });
  });

  it.each([
    ["maxSelected", { maxSelected: 3 }],
    ["placeholder", { placeholder: "Elige" }],
    ["limits", { min: "2026-01-01" }],
  ])("changes nothing else with several days and %s", (_name, extra) => {
    const { unmount } = renderField(<DateSelectionField {...multiple} />);
    const plain = shape();
    unmount();
    renderField(<DateSelectionField {...multiple} {...(extra as object)} />);
    expect(shape()).toEqual(plain);
  });
});
