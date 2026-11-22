import { describe, expect, expectTypeOf, it } from "vitest";
import {
  Typography,
  type TypographyElement,
  type TypographyProps,
  type TypographyTone,
  type TypographyVariant,
} from "..";

/** Type-level checks: `typecheck` fails if an `@ts-expect-error` below stops being an error. */
describe("Typography types", () => {
  it("derives the unions from the catalog", () => {
    expectTypeOf<TypographyVariant>().toEqualTypeOf<
      | "display"
      | "h1"
      | "h2"
      | "h3"
      | "h4"
      | "h5"
      | "h6"
      | "lead"
      | "body-lg"
      | "body"
      | "body-sm"
      | "label"
      | "caption"
      | "overline"
      | "code"
    >();
    expectTypeOf<"h3">().toExtend<TypographyElement>();
    expectTypeOf<TypographyTone>().toEqualTypeOf<"default" | "muted" | "primary" | "destructive">();
  });

  it("types native props for the chosen element", () => {
    const elements = [
      <Typography key="label" as="label" htmlFor="email">
        Email
      </Typography>,
      <Typography key="time" as="time" dateTime="2026-11-22">
        Today
      </Typography>,
      <Typography key="quote" as="blockquote" cite="https://example.com">
        Quote
      </Typography>,
      // @ts-expect-error htmlFor exists only with as="label"
      <Typography key="p" htmlFor="email">
        Email
      </Typography>,
      // @ts-expect-error button is not a text element
      <Typography key="button" as="button">
        Go
      </Typography>,
    ];
    expect(elements).toHaveLength(5);
  });

  it("rejects exclusive and out-of-range combinations", () => {
    const cases: TypographyProps[] = [
      { truncate: true },
      { lineClamp: 6 },
      { asChild: true },
      // @ts-expect-error truncate and lineClamp are exclusive
      { truncate: true, lineClamp: 2 },
      // @ts-expect-error lineClamp goes from 1 to 6
      { lineClamp: 7 },
      // @ts-expect-error the theme has no success token
      { tone: "success" },
    ];
    expect(cases).toHaveLength(6);
    const paragraph: TypographyProps<"p"> = { as: "p", variant: "lead" };
    expect(paragraph.as).toBe("p");
    // @ts-expect-error as and asChild are exclusive
    const both = <Typography as="h2" asChild />;
    expect(both).toBeTruthy();
  });
});
