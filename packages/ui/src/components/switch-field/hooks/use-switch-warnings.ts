import type { ReactNode } from "react";
import { fieldTextChecks, useMissingTexts } from "@/internal/hooks";
import type { FieldStatusInternal } from "@/internal/types";

/** The props that can name a switch, plus those whose texts are checked. */
export interface SwitchNameSources extends Pick<FieldStatusInternal, "info" | "infoLabel"> {
  /** The label above the field. */
  label?: ReactNode;
  /** The text beside the switch. */
  switchLabel?: ReactNode;
  /** Accessible name without visible text. */
  "aria-label"?: string;
  /** Ids of the elements that name the switch. */
  "aria-labelledby"?: string;
}

/** Whether the switch gets an accessible name from any of the props that can name it. */
export function hasSwitchName(props: SwitchNameSources) {
  return Boolean(
    props.label || props.switchLabel || props["aria-label"] || props["aria-labelledby"],
  );
}

/**
 * Development warnings for a field without an accessible name, and for `info` without
 * `infoLabel`. No text is ever generated.
 */
export function useSwitchWarnings(componentName: string, props: SwitchNameSources) {
  useMissingTexts(componentName, [
    [
      !hasSwitchName(props),
      "the switch has no accessible name. Pass `label`, `switchLabel`, `aria-label` or `aria-labelledby`",
    ],
    // The spinner is decorative (`aria-busy` announces the state), so only `info` needs a text.
    ...fieldTextChecks({ info: props.info, infoLabel: props.infoLabel }),
  ]);
}
