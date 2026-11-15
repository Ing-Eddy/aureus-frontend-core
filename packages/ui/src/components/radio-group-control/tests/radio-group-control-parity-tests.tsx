import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { RadioGroupField } from "@/components/radio-group-field";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { RadioGroupControl } from "../radio-group-control";
import { plans, renderInForm } from "./render-in-form";

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

/** The field inside a plain form: Radix adds its native radios only inside a form. */
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
const other = { label: "Other", inputLabel: "Other plan" };

const cases = {
  plain: { label: "Plan", helperText: "Billed monthly.", required: true },
  card: { label: "Plan", appearance: "card" as const, radioPosition: "end" as const },
  segmented: { label: "Plan", appearance: "segmented" as const },
  "other open": { label: "Plan", otherOption: other },
};

describe("RadioGroupField and RadioGroupControl render the same markup", () => {
  for (const [title, shared] of Object.entries(cases)) {
    const value = title === "other open" ? "Custom" : "pro";
    it(title, () => {
      const expected = fieldMarkup(
        <RadioGroupField
          {...shared}
          options={plans}
          name="plan"
          value={value}
          onValueChange={noop}
        />,
      );
      const control = renderInForm(<RadioGroupControl {...shared} options={plans} name="plan" />, {
        plan: value,
        source: null,
      });
      expect(normalizedMarkup(control.container)).toBe(expected);
    });
  }
});
