import { describe, expect, it } from "vitest";
import { SliderField, type SliderFieldProps } from "@/components/slider-field";
import { fieldMarkup, normalizedMarkup } from "@/internal/testing";
import { SliderControl } from "../slider-control";
import type { SliderControlProps } from "../slider-control-types";
import { renderInForm } from "./render-in-form";

const noop = () => {};

const cases: Record<
  string,
  { props: Partial<SliderFieldProps>; value: number | [number, number] }
> = {
  single: { props: { label: "Volumen", helperText: "Del 0 al 100.", required: true }, value: 40 },
  extras: {
    props: {
      label: "Volumen",
      showValue: "header",
      marks: [
        { value: 0, label: "0" },
        { value: 100, label: "100" },
      ],
      withInput: true,
      inputLabel: "Exacto",
    } as Partial<SliderFieldProps>,
    value: 40,
  },
  range: {
    props: {
      label: "Precio",
      range: true,
      max: 1000,
      thumbLabels: ["Mínimo", "Máximo"],
      showValue: "tooltip",
      orientation: "vertical",
    } as Partial<SliderFieldProps>,
    value: [200, 800],
  },
};

describe("SliderField and SliderControl render the same markup", () => {
  for (const [title, { props, value }] of Object.entries(cases)) {
    const formName = Array.isArray(value) ? "price" : "volume";
    it(title, () => {
      const fieldProps = {
        ...props,
        name: formName,
        value,
        onValueChange: noop,
      } as SliderFieldProps;
      const expected = fieldMarkup(<SliderField {...fieldProps} />);
      const control = renderInForm(
        <SliderControl {...(props as SliderControlProps)} name={formName} />,
        { [formName]: value },
      );
      expect(normalizedMarkup(control.container)).toBe(expected);
    });
  }
});
