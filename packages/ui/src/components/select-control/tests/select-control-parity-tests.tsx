import { describe, expect, it } from "vitest";
import { SelectField } from "@/components/select-field";
import { fieldMarkup, normalizedMarkup } from "@/internal/testing";
import { SelectControl } from "../select-control";
import { renderInForm } from "./render-in-form";

const countries = [
  { value: "es", label: "España" },
  { value: "mx", label: "México" },
];

const noop = () => {};

describe("SelectField and SelectControl render the same markup", () => {
  it("single", () => {
    const shared = {
      label: "Country",
      options: countries,
      placeholder: "Choose",
      helperText: "Where you live.",
    };
    const expected = fieldMarkup(
      <SelectField {...shared} name="country" value="mx" onValueChange={noop} />,
    );
    const control = renderInForm(<SelectControl {...shared} name="country" />, {
      country: "mx",
      tags: [],
    });
    expect(normalizedMarkup(control.container)).toBe(expected);
  });

  it("multiple with chips", () => {
    const shared = {
      label: "Tags",
      options: countries,
      multiple: true as const,
      multipleDisplay: "chips" as const,
      removeChipLabel: (option: { label: string }) => `Remove ${option.label}`,
    };
    const expected = fieldMarkup(
      <SelectField {...shared} name="tags" value={["es", "mx"]} onValueChange={noop} />,
    );
    const control = renderInForm(<SelectControl {...shared} name="tags" />, {
      country: null,
      tags: ["es", "mx"],
    });
    expect(normalizedMarkup(control.container)).toBe(expected);
  });

  it("multiple with a summary", () => {
    const shared = {
      label: "Tags",
      options: countries,
      multiple: true as const,
      multipleDisplay: "summary" as const,
      renderSummary: (selected: unknown[]) => `${selected.length} selected`,
    };
    const expected = fieldMarkup(
      <SelectField {...shared} name="tags" value={["es"]} onValueChange={noop} />,
    );
    const control = renderInForm(<SelectControl {...shared} name="tags" />, {
      country: null,
      tags: ["es"],
    });
    expect(normalizedMarkup(control.container)).toBe(expected);
  });
});
