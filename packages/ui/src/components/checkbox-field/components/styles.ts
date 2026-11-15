/** Classes of the checkbox row and its parts. */
export const checkboxStyles = {
  /**
   * The mixed state on top of shadcn's checkbox. Arbitrary `data-[state=…]` variants are used on
   * purpose: shadcn redefines some `data-*` variants (such as `data-checked`) with stricter matches.
   */
  indeterminate: [
    "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
    "data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-primary",
    "data-[state=indeterminate]:[&_svg]:hidden",
    "data-[state=indeterminate]:before:absolute data-[state=indeterminate]:before:h-0.5",
    "data-[state=indeterminate]:before:w-2 data-[state=indeterminate]:before:rounded-full",
    "data-[state=indeterminate]:before:bg-current",
  ].join(" "),
  row: "flex w-full min-w-0 items-start gap-2",
  card: [
    "rounded-lg border border-input p-3 transition-colors dark:bg-input/30",
    "has-[[data-slot=checkbox][data-state=checked]]:border-primary",
    "has-[[data-slot=checkbox][data-state=checked]]:bg-primary/5",
    "has-[[data-slot=checkbox][data-state=indeterminate]]:border-primary",
    "has-[[data-slot=checkbox]:disabled]:opacity-60",
  ].join(" "),
  cardError: "border-destructive has-[[data-slot=checkbox][data-state=checked]]:border-destructive",
  /** Keeps the 16px box on the first line of text (20px line height). */
  boxSlot: "flex h-5 shrink-0 items-center",
  text: "min-w-0 flex-1 text-sm leading-5 text-foreground select-none [overflow-wrap:anywhere]",
  textInteractive: "cursor-pointer",
  textLocked: "cursor-not-allowed opacity-50",
  end: "flex h-5 shrink-0 items-center gap-1",
  /** Indents the helper under the text when the box is at the start of a plain row (16px + 8px gap). */
  helperIndent: "ps-6",
} as const;
