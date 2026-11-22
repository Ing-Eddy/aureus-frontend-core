import type {
  TypographyAlign,
  TypographyLineClamp,
  TypographyTone,
  TypographyVariant,
  TypographyWeight,
  TypographyWrap,
} from "../types";

/**
 * One class per variant, defined in `src/styles/typography.css` (`components` layer), so every
 * modifier and consumer utility below wins over it.
 */
export const variantClassNames: Record<TypographyVariant, string> = {
  display: "typography-display",
  h1: "typography-h1",
  h2: "typography-h2",
  h3: "typography-h3",
  h4: "typography-h4",
  h5: "typography-h5",
  h6: "typography-h6",
  lead: "typography-lead",
  "body-lg": "typography-body-lg",
  body: "typography-body",
  "body-sm": "typography-body-sm",
  label: "typography-label",
  caption: "typography-caption",
  overline: "typography-overline",
  code: "typography-code",
};

export const toneClassNames: Record<TypographyTone, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  destructive: "text-destructive",
};

export const weightClassNames: Record<TypographyWeight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

/** Logical values: `start`/`end` follow the text direction. */
export const alignClassNames: Record<TypographyAlign, string> = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
  justify: "text-justify",
};

export const wrapClassNames: Record<TypographyWrap, string> = {
  balance: "text-balance",
  pretty: "text-pretty",
  nowrap: "text-nowrap",
};

/** Full literal class names, so the consumer's Tailwind build finds them with `@source`. */
export const lineClampClassNames: Record<TypographyLineClamp, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

export const truncateClassName = "truncate";
export const italicClassName = "italic";
export const tabularNumsClassName = "tabular-nums";
