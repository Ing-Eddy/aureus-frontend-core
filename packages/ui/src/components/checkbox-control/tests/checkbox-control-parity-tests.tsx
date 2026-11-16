import { describe, expect, it } from "vitest";
import { CheckboxField } from "@/components/checkbox-field";
import { fieldMarkup, normalizedMarkup } from "@/internal/testing";
import { CheckboxControl } from "../checkbox-control";
import { renderInForm } from "./render-in-form";

const noop = () => {};

const cases = {
  "label and checkbox label": {
    label: "Notifications",
    checkboxLabel: "Weekly digest",
    helperText: "Any time.",
  },
  card: { checkboxLabel: "Weekly digest", appearance: "card" as const, helperText: "Any time." },
  "box at the end": { checkboxLabel: "Weekly digest", checkboxPosition: "end" as const },
  plain: { checkboxLabel: "Weekly digest", required: true },
};

describe("CheckboxField and CheckboxControl render the same markup", () => {
  for (const [title, shared] of Object.entries(cases)) {
    it(title, () => {
      const expected = fieldMarkup(
        <CheckboxField {...shared} name="newsletter" value={false} onValueChange={noop} />,
      );
      const control = renderInForm(<CheckboxControl {...shared} name="newsletter" />);
      expect(normalizedMarkup(control.container)).toBe(expected);
    });
  }

  it("with custom values", () => {
    const shared = { checkboxLabel: "Active", checkedValue: "S", uncheckedValue: "N" } as const;
    const expected = fieldMarkup(
      <CheckboxField {...shared} name="active" value="S" onValueChange={noop} />,
    );
    const control = renderInForm(<CheckboxControl {...shared} name="active" />, {
      active: "S",
    });
    expect(normalizedMarkup(control.container)).toBe(expected);
  });
});
