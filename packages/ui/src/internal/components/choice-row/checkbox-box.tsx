import type { ComponentProps } from "react";
import { cn } from "@/shadcn/lib/utils";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { choiceStyles } from "./choice-styles";

/** Props of `CheckboxBox`: shadcn's checkbox with a boolean `checked` and a mixed look. */
export type CheckboxBoxProps = Omit<ComponentProps<typeof Checkbox>, "checked"> & {
  /** Whether the box is checked. */
  checked: boolean;
  /** Shows the mixed state; visual only. */
  indeterminate?: boolean;
};

/** shadcn's checkbox with a mixed state (dash) added through classes; shadcn stays unedited. */
export function CheckboxBox({ checked, indeterminate, className, ...props }: CheckboxBoxProps) {
  return (
    <Checkbox
      checked={indeterminate ? "indeterminate" : checked}
      className={cn(choiceStyles.indeterminate, choiceStyles.enabledBox, className)}
      {...props}
    />
  );
}
