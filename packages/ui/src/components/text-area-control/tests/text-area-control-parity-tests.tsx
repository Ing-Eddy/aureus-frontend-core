import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { TextAreaField } from "@/components/text-area-field";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { TextAreaControl } from "../text-area-control";
import type { TextAreaControlProps } from "../text-area-control-types";
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

/**
 * Field markup with generated ids replaced. The textarea id and the counter id both come from
 * `useId`, so every `«…»`/`_r_…_`-style id is normalized, not only the textarea's.
 */
function normalizedMarkup(container: HTMLElement) {
  const field = container.querySelector("[data-slot=field]");
  if (!field) throw new Error("no field rendered");
  let markup = canonical(field);
  const ids = [...field.querySelectorAll("[id]")].map((element) => element.id);
  ids.sort((a, b) => b.length - a.length);
  ids.forEach((id, index) => {
    markup = markup.split(id).join(`ID${index}`);
  });
  return markup;
}

const noop = () => {};

const visualProps = {
  label: "Bio",
  required: true,
  info: "Shown on your profile",
  helperText: "Tell us about you.",
  showCount: true,
  maxLength: 500,
  action: { children: "Preview" },
  classNames: { label: "uppercase" },
} satisfies Omit<TextAreaControlProps, "name">;

function fieldMarkup(element: ReactElement) {
  const { container, unmount } = render(<TooltipProvider>{element}</TooltipProvider>);
  const markup = normalizedMarkup(container);
  unmount();
  return markup;
}

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
