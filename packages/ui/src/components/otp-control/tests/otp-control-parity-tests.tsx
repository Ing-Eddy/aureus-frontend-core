import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { OtpField } from "@/components/otp-field";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { OtpControl } from "../otp-control";
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
  plain: { label: "Code", length: 6, helperText: "Sent by SMS.", required: true },
  groups: { label: "Code", length: 6, groups: [3, 3] as const },
  "masked with reveal": {
    label: "PIN",
    length: 4,
    masked: true,
    reveal: { showLabel: "Show PIN", hideLabel: "Hide PIN" },
  },
};

describe("OtpField and OtpControl render the same markup", () => {
  for (const [title, shared] of Object.entries(cases)) {
    it(title, () => {
      const expected = fieldMarkup(
        <OtpField {...shared} name="code" value="12" onValueChange={noop} />,
      );
      const control = renderInForm(<OtpControl {...shared} name="code" />, { code: "12" });
      expect(normalizedMarkup(control.container)).toBe(expected);
    });
  }
});
