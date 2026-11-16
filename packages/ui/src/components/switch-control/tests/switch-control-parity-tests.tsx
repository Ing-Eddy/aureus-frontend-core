import { describe, expect, it } from "vitest";
import { SwitchField } from "@/components/switch-field";
import { fieldMarkup, normalizedMarkup } from "@/internal/testing";
import { SwitchControl } from "../switch-control";
import { renderInForm } from "./render-in-form";

const noop = () => {};

const cases = {
  plain: { label: "Notifications", switchLabel: "Alerts", helperText: "Any time.", required: true },
  "card with state labels": {
    switchLabel: "Alerts",
    appearance: "card" as const,
    stateLabels: { on: "On", off: "Off" },
  },
  "end and small": { switchLabel: "Alerts", switchPosition: "end" as const, size: "sm" as const },
};

describe("SwitchField and SwitchControl render the same markup", () => {
  for (const [title, shared] of Object.entries(cases)) {
    it(title, () => {
      const expected = fieldMarkup(
        <SwitchField {...shared} name="alerts" value onValueChange={noop} />,
      );
      const control = renderInForm(<SwitchControl {...shared} name="alerts" />, {
        alerts: true,
      });
      expect(normalizedMarkup(control.container)).toBe(expected);
    });
  }
});
