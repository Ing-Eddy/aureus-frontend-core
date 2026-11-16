import { describe, expect, it } from "vitest";
import { CheckboxGroupField } from "@/components/checkbox-group-field";
import { fieldMarkup, normalizedMarkup } from "@/internal/testing";
import { CheckboxGroupControl } from "../checkbox-group-control";
import { channels, renderInForm } from "./render-in-form";

const noop = () => {};

const cases = {
  "plain with select all": {
    label: "Channels",
    helperText: "Where we write to you.",
    required: true,
    selectAll: { label: "All channels" },
  },
  cards: { label: "Channels", appearance: "card" as const },
  columns: { label: "Channels", columns: 3 as const, checkboxPosition: "end" as const },
};

describe("CheckboxGroupField and CheckboxGroupControl render the same markup", () => {
  for (const [title, shared] of Object.entries(cases)) {
    it(title, () => {
      const expected = fieldMarkup(
        <CheckboxGroupField
          {...shared}
          options={channels}
          name="channels"
          value={["sms"]}
          onValueChange={noop}
        />,
      );
      const control = renderInForm(
        <CheckboxGroupControl {...shared} options={channels} name="channels" />,
        { channels: ["sms"], permissions: [] },
      );
      expect(normalizedMarkup(control.container)).toBe(expected);
    });
  }
});
