import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PasswordField } from "@/components/password-field";
import { fieldMarkup, normalizedMarkup } from "@/internal/testing";
import { PasswordControl } from "../password-control";
import type { PasswordControlProps } from "../password-control-types";
import { renderInForm } from "./render-in-form";

const noop = () => {};

const visualProps = {
  label: "Password",
  required: true,
  info: "Use a passphrase",
  infoLabel: "More information",
  helperText: "At least 8 characters",
  classNames: { label: "uppercase" },
  showPasswordLabel: "Show password",
  hidePasswordLabel: "Hide password",
} satisfies Omit<PasswordControlProps, "name">;

describe("PasswordField and PasswordControl render the same markup", () => {
  it("in the default state", () => {
    const expected = fieldMarkup(
      <PasswordField
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        label="Password"
        name="password"
        value="secret"
        onChange={noop}
      />,
    );
    const control = renderInForm(
      <PasswordControl
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        name="password"
        label="Password"
      />,
      {
        password: "secret",
        confirm: "",
      },
    );
    expect(normalizedMarkup(control.container)).toBe(expected);
  });

  it("with required, info, helper text and class names", () => {
    const expected = fieldMarkup(
      <PasswordField {...visualProps} name="password" value="secret" onChange={noop} />,
    );
    const control = renderInForm(<PasswordControl {...visualProps} name="password" />, {
      password: "secret",
      confirm: "",
    });
    expect(normalizedMarkup(control.container)).toBe(expected);
  });

  it("in error, with the message", async () => {
    const expected = fieldMarkup(
      <PasswordField
        {...visualProps}
        name="password"
        value="short"
        onChange={noop}
        error
        errorMessage="Use at least 8 characters."
      />,
    );
    const control = renderInForm(<PasswordControl {...visualProps} name="password" />, {
      password: "short",
      confirm: "short",
    });
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
    expect(normalizedMarkup(control.container)).toBe(expected);
  });
});
