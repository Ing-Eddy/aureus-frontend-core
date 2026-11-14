import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TextField } from "@/components/text-field";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { TextControl } from "../text-control";
import type { TextControlProps } from "../text-control-types";
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
  label: "Username",
  required: true,
  info: "Visible to others",
  helperText: "At least 3 characters, no spaces",
  placeholder: "ada",
  classNames: { label: "uppercase" },
  action: { children: "Check", tooltip: "Check availability" },
} satisfies Omit<TextControlProps, "name">;

describe("TextField and TextControl render the same markup", () => {
  it("in the default state", () => {
    const field = render(
      <TooltipProvider>
        <TextField label="Username" name="username" value="ada" onChange={noop} />
      </TooltipProvider>,
    );
    const fieldMarkup = normalizedMarkup(field.container);
    field.unmount();

    const control = renderInForm(<TextControl name="username" label="Username" />, {
      username: "ada",
      nickname: "",
    });
    expect(normalizedMarkup(control.container)).toBe(fieldMarkup);
  });

  it("with required, info, helper text, class names and an action", () => {
    const field = render(
      <TooltipProvider>
        <TextField {...visualProps} name="username" value="ada" onChange={noop} />
      </TooltipProvider>,
    );
    const fieldMarkup = normalizedMarkup(field.container);
    field.unmount();

    const control = renderInForm(<TextControl {...visualProps} name="username" />, {
      username: "ada",
      nickname: "",
    });
    expect(normalizedMarkup(control.container)).toBe(fieldMarkup);
  });

  it("in error, with the message", async () => {
    const field = render(
      <TooltipProvider>
        <TextField
          {...visualProps}
          name="username"
          value="ab"
          onChange={noop}
          error
          errorMessage="At least 3 characters"
        />
      </TooltipProvider>,
    );
    const fieldMarkup = normalizedMarkup(field.container);
    field.unmount();

    const control = renderInForm(<TextControl {...visualProps} name="username" />, {
      username: "ab",
      nickname: "",
    });
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());

    expect(normalizedMarkup(control.container)).toBe(fieldMarkup);
  });
});
