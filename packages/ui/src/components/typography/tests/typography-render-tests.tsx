import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Typography, type TypographyVariant, typographyVariants } from "..";

const naturalTags: Record<TypographyVariant, string> = {
  display: "H1",
  h1: "H1",
  h2: "H2",
  h3: "H3",
  h4: "H4",
  h5: "H5",
  h6: "H6",
  lead: "P",
  "body-lg": "P",
  body: "P",
  "body-sm": "P",
  label: "SPAN",
  caption: "SPAN",
  overline: "SPAN",
  code: "CODE",
};

describe("Typography render", () => {
  it("exports the catalog in order", () => {
    expect(typographyVariants).toEqual([
      "display",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "lead",
      "body-lg",
      "body",
      "body-sm",
      "label",
      "caption",
      "overline",
      "code",
    ]);
  });

  it.each(typographyVariants)("renders %s with its natural element and class", (variant) => {
    render(<Typography variant={variant}>Text</Typography>);
    const element = screen.getByText("Text");
    expect(element.tagName).toBe(naturalTags[variant]);
    expect(element.className).toBe(`typography-${variant}`);
    expect(element.getAttribute("data-slot")).toBe("typography");
    expect(element.getAttribute("data-variant")).toBe(variant);
  });

  it("renders a body paragraph with only the variant class when bare", () => {
    render(<Typography>Text</Typography>);
    const element = screen.getByText("Text");
    expect(element.tagName).toBe("P");
    expect(element.className).toBe("typography-body");
  });

  it("forwards the ref and native attributes", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Typography ref={ref} id="t" lang="es" aria-describedby="d" data-testid="typo">
        Text
      </Typography>,
    );
    const element = screen.getByTestId("typo");
    expect(ref.current).toBe(element);
    expect(element.getAttribute("id")).toBe("t");
    expect(element.getAttribute("lang")).toBe("es");
    expect(element.getAttribute("aria-describedby")).toBe("d");
  });

  it("renders no text of its own", () => {
    const { container } = render(<Typography variant="label" />);
    const element = container.firstElementChild as HTMLElement;
    expect(element.tagName).toBe("SPAN");
    expect(element.textContent).toBe("");
    for (const attribute of ["aria-label", "title", "placeholder", "alt"]) {
      expect(element.hasAttribute(attribute)).toBe(false);
    }
  });
});
