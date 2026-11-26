import type { ComponentPropsWithRef } from "react";
import type { DistributiveOmit } from "@/internal/types";
import type { typographyElements, typographyVariants } from "../utils/typography-variants";

/** A named text style of the catalog. */
export type TypographyVariant = (typeof typographyVariants)[number];

/** A text element `Typography` can render through `as`. */
export type TypographyElement = (typeof typographyElements)[number];

/** Text color, from the theme's color tokens. */
export type TypographyTone = "default" | "muted" | "primary" | "destructive";

/** Font weight, from regular to bold. */
export type TypographyWeight = "regular" | "medium" | "semibold" | "bold";

/** Logical alignment: `start` and `end` follow the text direction. */
export type TypographyAlign = "start" | "center" | "end" | "justify";

/** How lines break: balanced lines, no lone last word, or a single line. */
export type TypographyWrap = "balance" | "pretty" | "nowrap";

/** Number of visible lines before the text is cut with an ellipsis. */
export type TypographyLineClamp = 1 | 2 | 3 | 4 | 5 | 6;

/** Style props. Each one is opt-in and changes only its own property. */
export interface TypographyStyleProps {
  /**
   * The text style. It also picks the natural element (`h1`–`h6` for headings, `p` for body text,
   * `span` for label/caption/overline, `code` for code) when `as` and `asChild` are not given.
   * Defaults to `"body"`.
   */
  variant?: TypographyVariant;
  /** Text color. No default: the color is inherited. */
  tone?: TypographyTone;
  /** Font weight. No default: the variant's weight applies. */
  weight?: TypographyWeight;
  /** Text alignment. No default. */
  align?: TypographyAlign;
  /** Line wrapping (`text-wrap`). No default. */
  wrap?: TypographyWrap;
  /** Renders the text in italics. Defaults to `false`. */
  italic?: boolean;
  /** Uses fixed-width digits, for numbers that line up. Defaults to `false`. */
  tabularNums?: boolean;
}

/** `truncate` and `lineClamp` cut the text in different ways, so only one may be set. */
export type TypographyClampProps =
  | {
      /** Keeps the text on one line and ends it with an ellipsis. Defaults to `false`. */
      truncate?: boolean;
      lineClamp?: never;
    }
  | {
      truncate?: never;
      /** Shows at most this many lines and ends the last one with an ellipsis. No default. */
      lineClamp?: TypographyLineClamp;
    };

/** Props of `Typography` itself, removed from the element's attributes. */
type OwnPropKeys = keyof TypographyStyleProps | "truncate" | "lineClamp" | "as" | "asChild";

/** Rendering an element: `as` changes only the element, never the style. */
export type TypographyElementProps<E extends TypographyElement> = {
  /** The element to render. Defaults to the variant's natural element. */
  as?: E;
  /** Renders the only child instead of an element of its own, merging the props. Defaults to `false`. */
  asChild?: false;
} & DistributiveOmit<ComponentPropsWithRef<E>, OwnPropKeys>;

/** Rendering the only child (`asChild`), for example a link with a text style. */
export type TypographyAsChildProps = {
  as?: never;
  /** Renders the only child instead of an element of its own, merging the props. Defaults to `false`. */
  asChild: true;
} & DistributiveOmit<ComponentPropsWithRef<"span">, OwnPropKeys>;

/**
 * Props of `Typography`. Without `as`, native props are the common HTML attributes; attributes of
 * one element (`htmlFor`, `dateTime`, `cite`…) need the matching `as`.
 */
export type TypographyProps<E extends TypographyElement = "span"> = TypographyStyleProps &
  TypographyClampProps &
  (TypographyElementProps<E> | TypographyAsChildProps);
