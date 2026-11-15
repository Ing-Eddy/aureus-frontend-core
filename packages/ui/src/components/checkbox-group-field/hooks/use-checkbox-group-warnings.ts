import { type ReactNode, useEffect } from "react";
import { isDev } from "@/internal/utils/constants";

export interface CheckboxGroupNameSources {
  label?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/** Whether the group gets an accessible name from any of the props that can name it. */
export function hasGroupName(props: CheckboxGroupNameSources) {
  return Boolean(props.label || props["aria-label"] || props["aria-labelledby"]);
}

/** Development warning for a group without an accessible name. No text is generated for it. */
export function useCheckboxGroupWarnings(componentName: string, props: CheckboxGroupNameSources) {
  const named = hasGroupName(props);
  useEffect(() => {
    if (!isDev || named) return;
    console.warn(
      `${componentName}: the group has no accessible name. Pass \`label\`, \`aria-label\` or \`aria-labelledby\`.`,
    );
  }, [componentName, named]);
}
