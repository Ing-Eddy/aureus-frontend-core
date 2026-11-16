/** Classes of the choice row (checkbox or radio) and its parts. */
export const choiceStyles = {
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
  /**
   * shadcn dims every checkbox inside a field that holds any disabled element
   * (`group-has-disabled/field:opacity-50`). In a group, or next to a disabled action, that dims
   * enabled boxes too; this keeps enabled boxes opaque, and disabled boxes keep their own dimming.
   */
  enabledBox: "group-has-disabled/field:not-disabled:opacity-100",
  row: "flex w-full min-w-0 items-start gap-2",
  /**
   * The switch track and thumb: shadcn's `Switch` classes (src/shadcn/ui/switch.tsx), copied because
   * its thumb takes no children (the spinner and icons go inside it). Arbitrary `data-[state=…]`
   * variants replace shadcn's custom ones. Additions: the RTL thumb direction and reduced motion.
   * The `ShadcnParity` story compares the computed result with shadcn's `Switch`.
   */
  switchTrack: [
    "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all motion-reduce:transition-none outline-none",
    "after:absolute after:-inset-x-3 after:-inset-y-2",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
    "data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]",
    "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-disabled:cursor-progress",
    "motion-reduce:transition-none",
  ].join(" "),
  switchThumb: [
    "pointer-events-none flex items-center justify-center rounded-full bg-background ring-0 transition-transform motion-reduce:transition-none",
    "group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3",
    "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
    "rtl:data-[state=checked]:-translate-x-[calc(100%-2px)]",
    "dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground",
    "text-foreground dark:data-[state=unchecked]:text-background [&_svg]:pointer-events-none",
    "group-data-[size=default]/switch:[&_svg]:size-3 group-data-[size=sm]/switch:[&_svg]:size-2.5",
    "motion-reduce:transition-none",
  ].join(" "),
  /** Both state labels share one grid cell, so the width fits the longer one and nothing jumps. */
  switchStateLabel:
    "grid text-sm leading-5 text-muted-foreground select-none [&>*]:col-start-1 [&>*]:row-start-1",
  card: [
    "rounded-lg border border-input p-3 transition-colors motion-reduce:transition-none dark:bg-input/30",
    "has-[[data-slot$=box-slot]>[data-state=checked]]:border-primary",
    "has-[[data-slot$=box-slot]>[data-state=checked]]:bg-primary/5",
    "has-[[data-slot$=box-slot]>[data-state=indeterminate]]:border-primary",
    // A disabled card keeps its text readable (descriptions explain why); only the surface changes.
    "has-[[data-slot$=box-slot]>:disabled]:cursor-not-allowed has-[[data-slot$=box-slot]>:disabled]:bg-muted/50",
  ].join(" "),
  cardError:
    "border-destructive has-[[data-slot$=box-slot]>[data-state=checked]]:border-destructive",
  /** Keeps the 16px box on the first line of text (20px line height). */
  boxSlot: "flex h-5 shrink-0 items-center",
  text: "min-w-0 flex-1 text-sm leading-5 text-foreground select-none [overflow-wrap:anywhere]",
  /** Text and description stacked, when there is a description. */
  textColumn: "flex min-w-0 flex-1 flex-col gap-0.5",
  description: "text-sm leading-5 text-muted-foreground select-none [overflow-wrap:anywhere]",
  textInteractive: "cursor-pointer",
  textLocked: "cursor-not-allowed opacity-50",
  end: "flex h-5 shrink-0 items-center gap-1",
  /** Indents the helper under the text when the box is at the start of a plain row (16px + 8px gap). */
  helperIndent: "ps-6",
} as const;
