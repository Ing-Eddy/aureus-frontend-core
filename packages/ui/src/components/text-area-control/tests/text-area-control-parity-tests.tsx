import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TextAreaField } from "@/components/text-area-field";
import { fieldMarkup, normalizedMarkup } from "@/internal/testing";
import { TextAreaControl } from "../text-area-control";
import type { TextAreaControlProps } from "../text-area-control-types";
import { renderInForm } from "./render-in-form";

const noop = () => {};

const visualProps = {
  label: "Bio",
  required: true,
  info: "Shown on your profile",
  infoLabel: "More information",
  helperText: "Tell us about you.",
  showCount: true,
  countLabel: (count: number, max?: number) => `${count}/${max}`,
  maxLength: 500,
  action: { children: "Preview" },
  classNames: { label: "uppercase" },
} satisfies Omit<TextAreaControlProps, "name">;

describe("TextAreaField and TextAreaControl render the same markup", () => {
  it("in the default state", () => {
    const expected = fieldMarkup(
      <TextAreaField label="Bio" name="bio" value="Hello" onChange={noop} />,
    );
    const control = renderInForm(<TextAreaControl name="bio" label="Bio" />, {
      bio: "Hello",
      notes: "",
    });
    expect(normalizedMarkup(control.container)).toBe(expected);
  });

  it("with required, info, helper, counter, action and class names", () => {
    const expected = fieldMarkup(
      <TextAreaField {...visualProps} name="bio" value="Hello" onChange={noop} />,
    );
    const control = renderInForm(<TextAreaControl {...visualProps} name="bio" />, {
      bio: "Hello",
      notes: "",
    });
    expect(normalizedMarkup(control.container)).toBe(expected);
  });

  it("in error, with the message", async () => {
    const expected = fieldMarkup(
      <TextAreaField
        {...visualProps}
        name="bio"
        value="Too short"
        onChange={noop}
        error
        errorMessage="Write at least 20 characters."
      />,
    );
    const control = renderInForm(<TextAreaControl {...visualProps} name="bio" />, {
      bio: "Too short",
      notes: "",
    });
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
    expect(normalizedMarkup(control.container)).toBe(expected);
  });
});
