import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { CheckboxGroupField } from "@/components/checkbox-group-field";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { CheckboxGroupControl } from "../checkbox-group-control";
import { channels, renderInForm } from "./render-in-form";

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

/** The field inside a plain form: Radix adds its native checkboxes only inside a form. */
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
