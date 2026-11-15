import { type ReactNode, useEffect } from "react";
import { isDev } from "@/internal/utils/constants";

export interface SwitchNameSources {
  label?: ReactNode;
  switchLabel?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/** Whether the switch gets an accessible name from any of the props that can name it. */
export function hasSwitchName(props: SwitchNameSources) {
  return Boolean(
    props.label || props.switchLabel || props["aria-label"] || props["aria-labelledby"],
  );
}

/** Development warning for a switch without an accessible name. No text is generated for it. */
export function useSwitchWarnings(componentName: string, props: SwitchNameSources) {
  const named = hasSwitchName(props);
  useEffect(() => {
    if (!isDev || named) return;
    console.warn(
      `${componentName}: the switch has no accessible name. Pass \`label\`, \`switchLabel\`, \`aria-label\` or \`aria-labelledby\`.`,
    );
  }, [componentName, named]);
}
