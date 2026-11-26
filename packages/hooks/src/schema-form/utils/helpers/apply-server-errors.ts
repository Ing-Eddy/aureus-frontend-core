import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { warnOnce } from "@/internal/utils/helpers";
import type { ApplyServerErrorsOptions, JoinMessages, ServerErrors } from "../../types";
import { isPlainObject } from "./merge-values";
import { normalizeServerErrors } from "./normalize-server-errors";

/** The default `joinMessages`. */
const joinWithSpace: JoinMessages = (messages) => messages.join(" ");

/** True when `path` (dot notation) points to an existing key of `values`. */
function hasPath(values: unknown, path: string): boolean {
  let current: unknown = values;
  for (const segment of path.split(".")) {
    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index) || index < 0 || index >= current.length) return false;
      current = current[index];
    } else if (isPlainObject(current) && segment in current) {
      current = current[segment];
    } else {
      return false;
    }
  }
  return true;
}

/** Form-level errors: they name no field, so they are not checked against the values. */
const isRootPath = (name: string) => name === "root" || name.startsWith("root.");

/**
 * Sets backend errors on a form (shared by `applyServerErrors` and the `serverErrors` option).
 * `source` names the caller in development warnings.
 */
export function setServerErrors<In extends FieldValues, B>(
  // biome-ignore lint/suspicious/noExplicitAny: any form, whatever its context and output types.
  form: UseFormReturn<In, any, any>,
  errors: B | null | undefined,
  options: ApplyServerErrorsOptions<B, In>,
  source: string,
): void {
  if (errors === null || errors === undefined) return;
  const { joinMessages = joinWithSpace, parse } = options;
  const raw: unknown = parse ? parse(errors) : errors;
  const values = form.getValues();

  for (const { name, messages } of normalizeServerErrors(raw, source)) {
    if (!isRootPath(name) && !hasPath(values, name)) {
      warnOnce(
        `${source}:unknown-server-field:${name}`,
        `[${source}] Server error for "${name}", which is not a field of the form's values. ` +
          "Check the key, or add the field to defaultValues.",
      );
    }
    form.setError(name as FieldPath<In>, {
      type: "server",
      message: joinMessages(messages),
      types: { server: messages },
    });
  }
}

/**
 * Sets backend validation errors on a form, for example in a request's error callback. Each field
 * gets an error of type `"server"`: its message is the field's messages joined with `joinMessages`
 * (default: a space), and `types.server` holds them all. Keys may be dot paths (`"items.0.name"`) or
 * `root` / `root.<name>`. Empty messages are ignored.
 *
 * @example
 * mutation.mutate(values, { onError: (error) => applyServerErrors(form, error.body.errors) });
 */
export function applyServerErrors<In extends FieldValues, B = ServerErrors<In>>(
  // biome-ignore lint/suspicious/noExplicitAny: any form, whatever its context and output types.
  form: UseFormReturn<In, any, any>,
  errors: B | null | undefined,
  options: ApplyServerErrorsOptions<B, In> = {},
): void {
  setServerErrors(form, errors, options, "applyServerErrors");
}
