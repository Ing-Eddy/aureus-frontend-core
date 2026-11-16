import { describe, expect, it } from "vitest";
import { OtpField } from "@/components/otp-field";
import { fieldMarkup, normalizedMarkup } from "@/internal/testing";
import { OtpControl } from "../otp-control";
import { renderInForm } from "./render-in-form";

const noop = () => {};

const cases = {
  plain: { label: "Code", length: 6, helperText: "Sent by SMS.", required: true },
  groups: { label: "Code", length: 6, groups: [3, 3] as const },
  "masked with reveal": {
    label: "PIN",
    length: 4,
    masked: true,
    reveal: { showLabel: "Show PIN", hideLabel: "Hide PIN" },
  },
};

describe("OtpField and OtpControl render the same markup", () => {
  for (const [title, shared] of Object.entries(cases)) {
    it(title, () => {
      const expected = fieldMarkup(
        <OtpField {...shared} name="code" value="12" onValueChange={noop} />,
      );
      const control = renderInForm(<OtpControl {...shared} name="code" />, { code: "12" });
      expect(normalizedMarkup(control.container)).toBe(expected);
    });
  }
});
