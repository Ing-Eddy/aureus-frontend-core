import { useEffect, useRef } from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { warnOnce } from "@/internal/utils/helpers";
import { isPlainObject } from "../utils/helpers";

/** Every path of `values` (objects and arrays, nested), in dot notation. */
function valuePaths(values: unknown, prefix = ""): string[] {
  const entries = Array.isArray(values)
    ? values.map((value, index) => [String(index), value] as const)
    : isPlainObject(values)
      ? Object.entries(values)
      : [];
  return entries.flatMap(([key, value]) => {
    const path = prefix === "" ? key : `${prefix}.${key}`;
    return [path, ...valuePaths(value, path)];
  });
}

const isSchemaError = (error: unknown) =>
  isPlainObject(error) && typeof error.type === "string" && error.type !== "server";

/**
 * Paths of the fields that show an error that does not come from the server. Read through
 * `getFieldState`, which sees the live errors even when the component owning the form does not read
 * `formState` while rendering. An array-level error (`items.root`) is re-validated through its array.
 */
function schemaErrorPaths(
  // biome-ignore lint/suspicious/noExplicitAny: any form, whatever its types.
  form: UseFormReturn<any, any, any>,
): string[] {
  const paths: string[] = [];
  for (const path of valuePaths(form.getValues())) {
    const { error } = form.getFieldState(path);
    if (isSchemaError(error) || isSchemaError(form.getFieldState(`${path}.root`).error)) {
      paths.push(path);
    }
  }
  return paths;
}

/**
 * When the schema changes identity (the language changed, or the schema hook's parameters did), validates
 * again the fields that show a schema error, so their messages follow the new schema. Fields without an
 * error, and server errors, are left alone.
 *
 * A schema that changes on the renders caused by that re-validation (not memoized) is not chased: the
 * re-validation stops and a development warning explains why.
 */
export function useSchemaRevalidation<In extends FieldValues>(
  // biome-ignore lint/suspicious/noExplicitAny: any form, whatever its context and output types.
  form: UseFormReturn<In, any, any>,
  schema: unknown,
): void {
  const previousSchema = useRef(schema);
  const revalidating = useRef(false);

  // Runs after every render: a render with the same schema marks the last re-validation as settled.
  useEffect(() => {
    if (previousSchema.current === schema) {
      revalidating.current = false;
      return;
    }
    previousSchema.current = schema;

    if (revalidating.current) {
      warnOnce(
        "useSchemaForm:unstable-schema",
        "[useSchemaForm] The schema changed again while its errors were being re-validated, so it " +
          "is probably created on every render. Memoize it (useMemo with [t, ...params]) and pass " +
          "primitive or memoized schemaParams.",
      );
      return;
    }

    const paths = schemaErrorPaths(form);
    if (paths.length === 0) return;
    revalidating.current = true;
    void form.trigger(paths as FieldPath<In>[]);
  });
}
