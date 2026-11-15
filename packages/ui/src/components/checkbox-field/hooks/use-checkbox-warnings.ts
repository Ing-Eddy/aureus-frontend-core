import type { ReactNode } from "react";
import { useEffect } from "react";
import { isDev } from "@/internal/utils/constants";

export interface CheckboxNameSources {
  label?: ReactNode;
  checkboxLabel?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/** Whether the box gets an accessible name from any of the props that can name it. */
export function hasAccessibleName(props: CheckboxNameSources) {
  return Boolean(
    props.label || props.checkboxLabel || props["aria-label"] || props["aria-labelledby"],
  );
}

/** Development warning for a box without an accessible name. No text is ever generated for it. */
export function useCheckboxWarnings(componentName: string, props: CheckboxNameSources) {
  const named = hasAccessibleName(props);
  useEffect(() => {
    if (!isDev || named) return;
    console.warn(
      `${componentName}: the checkbox has no accessible name. Pass \`label\`, \`checkboxLabel\`, \`aria-label\` or \`aria-labelledby\`.`,
    );
  }, [componentName, named]);
}
