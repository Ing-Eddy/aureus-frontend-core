import { Slot } from "radix-ui";
import type { ComponentPropsWithRef, ElementType } from "react";
import { cn } from "@/shadcn/lib/utils";
import type {
  TypographyElement,
  TypographyLineClamp,
  TypographyProps,
  TypographyStyleProps,
} from "./types";
import {
  alignClassNames,
  italicClassName,
  lineClampClassNames,
  naturalElements,
  tabularNumsClassName,
  toneClassNames,
  truncateClassName,
  variantClassNames,
  weightClassNames,
  wrapClassNames,
} from "./utils";

/** The props as the implementation reads them, without the exclusive unions of the public type. */
type ResolvedProps = TypographyStyleProps &
  ComponentPropsWithRef<"span"> & {
    /** The element to render. */
    as?: TypographyElement;
    /** Renders the only child instead. */
    asChild?: boolean;
    /** One line with an ellipsis. */
    truncate?: boolean;
    /** At most this many lines. */
    lineClamp?: TypographyLineClamp;
  };

/**
 * Renders text with one of the catalog's styles. Each variant renders its natural element, which
 * `as` changes without changing the style; every modifier is opt-in and changes only its own
 * property, and `className` always wins.
 *
 * ```tsx
 * <>
 *   <Typography variant="h2" tone="muted">
 *     {t("reports.title")}
 *   </Typography>
 *   <Typography as="label" variant="label" htmlFor="name">
 *     {t("users.name")}
 *   </Typography>
 *   <Typography asChild variant="body-sm" truncate>
 *     <a href={url}>{url}</a>
 *   </Typography>
 * </>
 * ```
 */
export function Typography<E extends TypographyElement = "span">(props: TypographyProps<E>) {
  const {
    variant = "body",
    tone,
    weight,
    align,
    wrap,
    italic = false,
    tabularNums = false,
    truncate = false,
    lineClamp,
    as,
    asChild = false,
    className,
    ...rest
  } = props as ResolvedProps;

  // In untyped JS, `asChild` wins over `as` and `lineClamp` wins over `truncate`.
  const Comp: ElementType = asChild ? Slot.Root : (as ?? naturalElements[variant]);

  return (
    <Comp
      data-slot="typography"
      data-variant={variant}
      className={cn(
        variantClassNames[variant],
        tone && toneClassNames[tone],
        weight && weightClassNames[weight],
        align && alignClassNames[align],
        wrap && wrapClassNames[wrap],
        lineClamp !== undefined ? lineClampClassNames[lineClamp] : truncate && truncateClassName,
        italic && italicClassName,
        tabularNums && tabularNumsClassName,
        className,
      )}
      {...rest}
    />
  );
}
