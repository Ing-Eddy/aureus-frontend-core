import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { SelectField } from "@/components/select-field";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { SelectControl } from "../select-control";
import { renderInForm } from "./render-in-form";

const countries = [
  { value: "es", label: "España" },
  { value: "mx", label: "México" },
];

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
 * Field markup with every React-generated id replaced: the field's own ids and the id Base UI
 * gives its hidden input both come from `useId`.
 */
function normalizedMarkup(container: HTMLElement) {
  const field = container.querySelector("[data-slot=field]");
  if (!field) throw new Error("no field rendered");
  return canonical(field).replace(/_r_[0-9a-z]+_|«r[0-9a-z]+»|:r[0-9a-z]+:/g, "RID");
}

function fieldMarkup(element: ReactElement) {
  const { container, unmount } = render(<TooltipProvider>{element}</TooltipProvider>);
  const markup = normalizedMarkup(container);
  unmount();
  return markup;
}

const noop = () => {};

describe("SelectField and SelectControl render the same markup", () => {
  it("single", () => {
    const shared = {
      label: "Country",
      options: countries,
      placeholder: "Choose",
      helperText: "Where you live.",
    };
    const expected = fieldMarkup(
      <SelectField {...shared} name="country" value="mx" onValueChange={noop} />,
    );
    const control = renderInForm(<SelectControl {...shared} name="country" />, {
      country: "mx",
      tags: [],
    });
    expect(normalizedMarkup(control.container)).toBe(expected);
  });

  it("multiple with chips", () => {
    const shared = {
      label: "Tags",
      options: countries,
      multiple: true as const,
      multipleDisplay: "chips" as const,
      removeChipLabel: (option: { label: string }) => `Remove ${option.label}`,
    };
    const expected = fieldMarkup(
      <SelectField {...shared} name="tags" value={["es", "mx"]} onValueChange={noop} />,
    );
    const control = renderInForm(<SelectControl {...shared} name="tags" />, {
      country: null,
      tags: ["es", "mx"],
    });
    expect(normalizedMarkup(control.container)).toBe(expected);
  });

  it("multiple with a summary", () => {
    const shared = {
      label: "Tags",
      options: countries,
      multiple: true as const,
      multipleDisplay: "summary" as const,
      renderSummary: (selected: unknown[]) => `${selected.length} selected`,
    };
    const expected = fieldMarkup(
      <SelectField {...shared} name="tags" value={["es"]} onValueChange={noop} />,
    );
    const control = renderInForm(<SelectControl {...shared} name="tags" />, {
      country: null,
      tags: ["es"],
    });
    expect(normalizedMarkup(control.container)).toBe(expected);
  });
});
