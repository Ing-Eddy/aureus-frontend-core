import { useMemo } from "react";
import { mergeValues } from "../utils/helpers";

/**
 * `values` merged over `defaultValues`, for react-hook-form's `values` option. `undefined` (no
 * existing data) keeps the form on its default values. react-hook-form compares the result deeply,
 * so a new object with equal content does not reset the form.
 */
export function useMergedValues<T>(defaultValues: T, values: unknown): T | undefined {
  return useMemo(
    () =>
      values === undefined || values === null ? undefined : mergeValues(defaultValues, values),
    [defaultValues, values],
  );
}
