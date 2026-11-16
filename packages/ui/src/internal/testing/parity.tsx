import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

/**
 * Test-only helpers for the field/control parity tests. This folder is excluded from the build
 * and from the no-default-texts guard.
 */

/** Serializes an element with its attributes sorted, so DOM insertion order does not matter. */
export function canonical(node: Element): string {
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

/** React `useId` formats across versions: `_r_1_`, `«r1»` and `:r1:`. */
const GENERATED_ID = /_r_[0-9a-z]+_|«r[0-9a-z]+»|:r[0-9a-z]+:/g;

/**
 * The markup of the first field in `container`, with every React-generated id replaced by "RID"
 * (the field's own ids, the ids derived from them, and those of library parts such as Base UI's
 * hidden inputs).
 */
export function normalizedMarkup(container: HTMLElement): string {
  const field = container.querySelector("[data-slot=field]");
  if (!field) throw new Error("no field rendered");
  return canonical(field).replace(GENERATED_ID, "RID");
}

/** Renders a field inside a form and the tooltip provider, and returns its normalized markup. */
export function fieldMarkup(element: ReactElement): string {
  const { container, unmount } = render(
    <TooltipProvider>
      <form>{element}</form>
    </TooltipProvider>,
  );
  const markup = normalizedMarkup(container);
  unmount();
  return markup;
}
