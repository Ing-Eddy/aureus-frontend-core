import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PasswordField } from "@/components/password-field";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { PasswordControl } from "../password-control";
import type { PasswordControlProps } from "../password-control-types";
import { renderInForm } from "./render-in-form";

/** Serializes an element with its attributes sorted, so DOM insertion order does not matter. */
function canonical(node: Element): string {
  const attributes = [...node.attributes]
    .map((attribute) => `${attribute.name}="${attribute.value}"`)
    .sort()
    .join(" ");
  const children = [...node.childNodes]
    .map((child) =>
      child.nodeType === Node.ELEMENT_NODE ? canonical(child as Element) : child.textContent,
    )
    .join("");
  return `<${node.tagName.toLowerCase()} ${attributes}>${children}</${node.tagName.toLowerCase()}>`;
}

/** Field markup with the generated input id (and the ids derived from it) replaced by "ID". */
function normalizedMarkup(container: HTMLElement) {
  const field = container.querySelector("[data-slot=field]");
  const id = field?.querySelector("input")?.id;
  if (!field || !id) throw new Error("no field rendered");
  return canonical(field).split(id).join("ID");
}

const noop = () => {};

const visualProps = {
  label: "Password",
  required: true,
  info: "Use a passphrase",
  helperText: "At least 8 characters",
  classNames: { label: "uppercase" },
} satisfies Omit<PasswordControlProps, "name">;

function fieldMarkup(element: React.ReactElement) {
  const { container, unmount } = render(<TooltipProvider>{element}</TooltipProvider>);
  const markup = normalizedMarkup(container);
  unmount();
  return markup;
}

describe("PasswordField and PasswordControl render the same markup", () => {
  it("in the default state", () => {
    const expected = fieldMarkup(
      <PasswordField label="Password" name="password" value="secret" onChange={noop} />,
    );
    const control = renderInForm(<PasswordControl name="password" label="Password" />, {
      password: "secret",
      confirm: "",
    });
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
