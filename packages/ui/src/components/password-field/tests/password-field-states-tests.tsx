import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { PasswordField } from "../password-field";

const toggle = () => screen.getByRole("button", { name: "Show password" }) as HTMLButtonElement;

describe("PasswordField states and props", () => {
  it("disables the toggle while loading, with the spinner before it", () => {
    const { container } = render(<PasswordField label="Password" loading />);
    expect(toggle().disabled).toBe(true);
    expect((container.querySelector("input") as HTMLInputElement).disabled).toBe(true);
    const addon = container.querySelector("[data-slot=input-group-addon]");
    const slots = [...(addon?.children ?? [])].map((child) => child.getAttribute("data-slot"));
    expect(slots).toEqual(["field-loading", "field-action"]);
  });

  it("disables the toggle when disabled", () => {
    render(<PasswordField label="Password" disabled />);
    expect(toggle().disabled).toBe(true);
  });

  it("defaults autoComplete to current-password and lets it be changed", () => {
    const { container, rerender } = render(<PasswordField label="Password" />);
    const input = () => container.querySelector("input") as HTMLInputElement;
    expect(input().getAttribute("autocomplete")).toBe("current-password");
    rerender(<PasswordField label="Password" autoComplete="new-password" />);
    expect(input().getAttribute("autocomplete")).toBe("new-password");
  });

  it("turns spell-check, auto-correct and auto-capitalize off, always", () => {
    const { container } = render(
      <PasswordField label="Password" spellCheck autoCorrect="on" autoCapitalize="on" />,
    );
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.getAttribute("spellcheck")).toBe("false");
    expect(input.getAttribute("autocorrect")).toBe("off");
    expect(input.getAttribute("autocapitalize")).toBe("off");
  });

  it("hides the browser's own reveal button", () => {
    const { container } = render(<PasswordField label="Password" classNames={{ input: "x" }} />);
    const classes = container.querySelector("input")?.className ?? "";
    expect(classes).toContain("[&::-ms-reveal]:hidden");
    expect(classes).toContain("x");
  });

  it("forwards the ref to the input", () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<PasswordField label="Password" ref={ref} />);
    expect(ref.current).toBe(container.querySelector("input"));
  });

  it("has no action or type prop", () => {
    const checks = [
      // @ts-expect-error The button is always the visibility toggle.
      <PasswordField key="action" label="Password" action={{ children: "Go" }} />,
      // @ts-expect-error The type comes from the visibility state.
      <PasswordField key="type" label="Password" type="text" />,
    ];
    expect(checks).toHaveLength(2);
  });
});
