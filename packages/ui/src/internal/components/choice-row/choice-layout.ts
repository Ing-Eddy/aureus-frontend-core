import { cn } from "@/shadcn/lib/utils";

/** Literal classes, so Tailwind finds them. The grid collapses with its container's width. */
const columnClasses = {
  2: "grid grid-cols-1 gap-3 @sm:grid-cols-2",
  3: "grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-3",
  4: "grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4",
} as const;

export interface ChoiceLayoutOptions {
  orientation: "vertical" | "horizontal";
  columns?: 2 | 3 | 4;
  appearance: "plain" | "card";
  /** Indents the options (under a parent row, such as select all). */
  indent?: boolean;
}

/**
 * Classes of the container of a choice group's options. Its wrapper must be the `@container`.
 * `columns` takes precedence over `orientation` for placing the options.
 */
export function choiceLayoutClassName({
  orientation,
  columns,
  appearance,
  indent,
}: ChoiceLayoutOptions) {
  const layout = columns
    ? columnClasses[columns]
    : orientation === "horizontal"
      ? "flex flex-row flex-wrap gap-x-6 gap-y-3"
      : cn("flex flex-col", appearance === "card" ? "gap-2" : "gap-3");
  return cn(layout, indent && "ps-6");
}

/** Class of each option row: horizontal rows size to their content. */
export function choiceOptionClassName({ orientation, columns }: ChoiceLayoutOptions) {
  return columns || orientation === "vertical" ? undefined : "w-auto";
}
