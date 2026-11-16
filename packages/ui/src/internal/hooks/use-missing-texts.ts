import { useEffect, useRef } from "react";
import type { FieldStatusInternal } from "@/internal/types";
import { isDev } from "@/internal/utils/constants";

/** One problem to check: whether it happens, and how the warning describes it. */
export type MissingTextCheck = readonly [happens: unknown, problem: string];

/** The descriptions of the checks that happen, in order. */
export function missingTextProblems(checks: readonly MissingTextCheck[]): string[] {
  return checks.filter(([happens]) => Boolean(happens)).map(([, problem]) => problem);
}

/** The checks every field with a loading spinner and an info button shares. */
export function fieldTextChecks({
  loading,
  loadingLabel,
  info,
  infoLabel,
}: FieldStatusInternal): MissingTextCheck[] {
  return [
    [loading && !loadingLabel, "`loading` needs `loadingLabel`"],
    [info && !infoLabel, "`info` needs `infoLabel`"],
  ];
}

/** The props that can give a field's input an accessible name. */
export interface InputNameSources {
  label?: unknown;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/** The check for an input with no accessible name: no `label`, `aria-label` or `aria-labelledby`. */
export function inputNameCheck(props: InputNameSources, element = "input"): MissingTextCheck {
  return [
    !props.label && !props["aria-label"] && !props["aria-labelledby"],
    `the ${element} has no accessible name. Pass \`label\`, \`aria-label\` or \`aria-labelledby\``,
  ];
}

/**
 * Development warnings for problems the types cannot catch in untyped code, such as an enabled
 * feature without its text or a field without an accessible name. Each warning starts with the
 * component's name and is logged once per problem for the component's lifetime.
 */
export function useMissingTexts(componentName: string, checks: readonly MissingTextCheck[]) {
  const warned = useRef(new Set<string>());
  const key = isDev ? missingTextProblems(checks).join("\n") : "";
  useEffect(() => {
    if (!key) return;
    for (const problem of key.split("\n")) {
      if (warned.current.has(problem)) continue;
      warned.current.add(problem);
      console.warn(`${componentName}: ${problem}.`);
    }
  }, [componentName, key]);
}
