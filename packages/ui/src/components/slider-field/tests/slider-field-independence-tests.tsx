import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SliderField } from "../slider-field";
import type { SliderFieldProps } from "../types";
import { renderField } from "./helpers";

const slots = () =>
  ["slider-value", "slider-tooltip", "slider-marks", "slider-mark-labels", "slider-input"].filter(
    (slot) => document.querySelector(`[data-slot=${slot}]`),
  );

describe("SliderField extras are independent", () => {
  it("renders a single plain slider without extras", () => {
    renderField(<SliderField label="Volume" />);
    expect(screen.getAllByRole("slider")).toHaveLength(1);
    expect(slots()).toEqual([]);
    expect(screen.getByRole("slider").getAttribute("aria-orientation")).toBe("horizontal");
  });

  const extras: [string, Partial<SliderFieldProps>, string[]][] = [
    ["showValue header", { showValue: "header" }, ["slider-value"]],
    ["showValue tooltip", { showValue: "tooltip" }, ["slider-tooltip"]],
    ["marks", { marks: [{ value: 0, label: "Low" }] }, ["slider-marks", "slider-mark-labels"]],
    ["marks without labels", { marks: [{ value: 0 }] }, ["slider-marks"]],
    ["snapToMarks without marks", { snapToMarks: true }, []],
    [
      "withInput",
      { withInput: true, inputLabel: "Exact" } as Partial<SliderFieldProps>,
      ["slider-input"],
    ],
    ["vertical", { orientation: "vertical" }, []],
  ];

  it.each(extras)("%s only adds its own part", (_name, props, expected) => {
    renderField(<SliderField label="Volume" {...(props as SliderFieldProps)} />);
    expect(slots()).toEqual(expected);
    expect(screen.getAllByRole("slider")).toHaveLength(1);
  });

  it("range only adds the second thumb", () => {
    renderField(<SliderField label="Price" range thumbLabels={["Low", "High"]} />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
    expect(slots()).toEqual([]);
  });

  it("combines every extra", () => {
    renderField(
      <SliderField
        label="Price"
        range
        thumbLabels={["Low", "High"]}
        showValue="header"
        marks={[{ value: 50, label: "Half" }]}
        snapToMarks={false}
        withInput
        inputLabels={["From", "To"]}
        orientation="vertical"
      />,
    );
    expect(slots()).toEqual(["slider-value", "slider-marks", "slider-mark-labels", "slider-input"]);
    expect(screen.getAllByRole("spinbutton")).toHaveLength(2);
  });
});
