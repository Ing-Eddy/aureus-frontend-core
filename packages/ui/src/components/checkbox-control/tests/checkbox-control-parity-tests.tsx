import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { CheckboxField } from "@/components/checkbox-field";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { CheckboxControl } from "../checkbox-control";
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

/** Field markup with every React-generated id replaced. */
function normalizedMarkup(container: HTMLElement) {
  const field = container.querySelector("[data-slot=field]");
  if (!field) throw new Error("no field rendered");
  return canonical(field).replace(/_r_[0-9a-z]+_|«r[0-9a-z]+»|:r[0-9a-z]+:/g, "RID");
}

/** The field inside a plain form: Radix adds its native checkbox only inside a form. */
function fieldMarkup(element: ReactElement) {
  const { container, unmount } = render(
    <TooltipProvider>
      <form>{element}</form>
    </TooltipProvider>,
  );
  const markup = normalizedMarkup(container);
  unmount();
  return markup;
}

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
