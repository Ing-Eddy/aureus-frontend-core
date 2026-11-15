import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { SwitchField } from "@/components/switch-field";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { SwitchControl } from "../switch-control";
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
  plain: { label: "Notifications", switchLabel: "Alerts", helperText: "Any time.", required: true },
  "card with state labels": {
    switchLabel: "Alerts",
    appearance: "card" as const,
    stateLabels: { on: "On", off: "Off" },
  },
  "end and small": { switchLabel: "Alerts", switchPosition: "end" as const, size: "sm" as const },
};

describe("SwitchField and SwitchControl render the same markup", () => {
  for (const [title, shared] of Object.entries(cases)) {
    it(title, () => {
      const expected = fieldMarkup(
        <SwitchField {...shared} name="alerts" value onValueChange={noop} />,
      );
      const control = renderInForm(<SwitchControl {...shared} name="alerts" />, {
        alerts: true,
      });
      expect(normalizedMarkup(control.container)).toBe(expected);
    });
  }
});
