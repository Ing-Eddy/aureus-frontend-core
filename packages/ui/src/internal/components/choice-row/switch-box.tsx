import { Loader2Icon } from "lucide-react";
import { Switch as SwitchPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shadcn/lib/utils";
import { choiceStyles } from "./choice-styles";

/** Content for each state of the switch, such as `{ on: "Yes", off: "No" }`. */
export interface SwitchStateContent {
  on: ReactNode;
  off: ReactNode;
}

export type SwitchBoxProps = Omit<
  ComponentProps<typeof SwitchPrimitive.Root>,
  "checked" | "children"
> & {
  checked: boolean;
  size?: "default" | "sm";
  /** Shows a spinner in the thumb (loading, or a change waiting for confirmation). */
  busy?: boolean;
  /** Decorative icon inside the thumb for each state. */
  thumbIcons?: SwitchStateContent;
  /** Decorative text after the switch for each state. */
  stateLabels?: SwitchStateContent;
  thumbClassName?: string;
  stateLabelClassName?: string;
};

/**
 * A switch with shadcn's look whose thumb can hold a spinner or an icon. Built on Radix's primitive
 * because shadcn's `Switch` renders a thumb that takes no children. State labels and icons are
 * decorative (`aria-hidden`): `aria-checked` already conveys the state.
 */
export function SwitchBox({
  checked,
  size = "default",
  busy,
  thumbIcons,
  stateLabels,
  className,
  thumbClassName,
  stateLabelClassName,
  ...props
}: SwitchBoxProps) {
  const state = checked ? "on" : "off";
  return (
    <>
      <SwitchPrimitive.Root
        data-slot="switch"
        data-size={size}
        data-busy={busy || undefined}
        checked={checked}
        className={cn(choiceStyles.switchTrack, className)}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(choiceStyles.switchThumb, thumbClassName)}
        >
          {busy ? (
            // Decorative: the busy state is announced through `aria-busy` on the switch.
            <Loader2Icon aria-hidden="true" data-slot="switch-spinner" className="animate-spin" />
          ) : thumbIcons ? (
            <span aria-hidden="true" className="flex">
              {thumbIcons[state]}
            </span>
          ) : null}
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
      {stateLabels ? (
        <span
          aria-hidden="true"
          data-slot="switch-state-label"
          className={cn(choiceStyles.switchStateLabel, "ms-2", stateLabelClassName)}
        >
          <span className={cn(!checked && "invisible")}>{stateLabels.on}</span>
          <span className={cn(checked && "invisible")}>{stateLabels.off}</span>
        </span>
      ) : null}
    </>
  );
}
