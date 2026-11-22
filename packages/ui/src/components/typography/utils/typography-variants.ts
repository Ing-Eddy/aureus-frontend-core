/**
 * The typography catalog, in order. Every entry has six runtime variables
 * (`--typography-<variant>-{font,size,line-height,weight,tracking,transform}`) and one
 * `.typography-<variant>` class in `src/styles/typography.css`; the styles test keeps both in sync.
 */
export const typographyVariants = [
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
] as const;

/** The text elements `Typography` can render through `as`. */
export const typographyElements = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "div",
  "label",
  "strong",
  "em",
  "small",
  "code",
  "blockquote",
  "figcaption",
  "legend",
  "li",
  "dt",
  "dd",
  "time",
  "cite",
  "q",
  "abbr",
] as const;

/** The element each variant renders when neither `as` nor `asChild` is given. */
export const naturalElements = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  lead: "p",
  "body-lg": "p",
  body: "p",
  "body-sm": "p",
  label: "span",
  caption: "span",
  overline: "span",
  code: "code",
} as const satisfies Record<
  (typeof typographyVariants)[number],
  (typeof typographyElements)[number]
>;
