import { describe, expect, it } from "vitest";
import { RadioGroupField } from "@/components/radio-group-field";
import { fieldMarkup, normalizedMarkup } from "@/internal/testing";
import { RadioGroupControl } from "../radio-group-control";
import { plans, renderInForm } from "./render-in-form";

const noop = () => {};
const other = { label: "Other", inputLabel: "Other plan" };

const cases = {
  plain: { label: "Plan", helperText: "Billed monthly.", required: true },
  card: { label: "Plan", appearance: "card" as const, radioPosition: "end" as const },
  segmented: { label: "Plan", appearance: "segmented" as const },
  "other open": { label: "Plan", otherOption: other },
};

describe("RadioGroupField and RadioGroupControl render the same markup", () => {
  for (const [title, shared] of Object.entries(cases)) {
    const value = title === "other open" ? "Custom" : "pro";
    it(title, () => {
      const expected = fieldMarkup(
        <RadioGroupField
          {...shared}
          options={plans}
          name="plan"
          value={value}
          onValueChange={noop}
        />,
      );
      const control = renderInForm(<RadioGroupControl {...shared} options={plans} name="plan" />, {
        plan: value,
        source: null,
      });
      expect(normalizedMarkup(control.container)).toBe(expected);
    });
  }
});
