import { useEffect } from "react";
import { type Control, type FieldValues, get } from "react-hook-form";
import { isDev } from "@/internal/utils/constants";

/**
 * In development, warns when `name` is not among the form's default values: controls take a
 * plain string `name`, so this catches typos the type system cannot. Skipped when the defaults
 * are loaded asynchronously, or when the form exposes no defaults.
 */
export function useUnknownFieldWarning(
  control: Control<FieldValues>,
  name: string,
  componentName: string,
) {
  useEffect(() => {
    if (!isDev) return;
    if (typeof control._options?.defaultValues === "function") return;
    const defaults: unknown = control._defaultValues;
    if (!defaults || typeof defaults !== "object") return;
    if (get(defaults, name) === undefined) {
      console.warn(
        `${componentName}: field "${name}" is not in the form's defaultValues. Check the name, or give the field a default value.`,
      );
    }
  }, [control, name, componentName]);
}
