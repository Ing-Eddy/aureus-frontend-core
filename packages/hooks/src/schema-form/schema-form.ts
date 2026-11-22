import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { type DefaultValues, type Resolver, useForm } from "react-hook-form";
import { useMergedValues, useSchemaRevalidation, useServerErrors } from "./hooks";
import type {
  FormInput,
  FormOutput,
  FormSchema,
  SchemaFormOptions,
  SchemaFormReturn,
  ServerErrors,
} from "./types";

/**
 * A react-hook-form form validated by a zod schema. Returns react-hook-form's own form object, ready
 * for `<FormProvider {...form}>`.
 *
 * - `defaultValues`: the initial values (usually empty).
 * - `values`: existing data (edit forms), deep-merged over `defaultValues` and kept in sync.
 * - `serverErrors`: backend errors (`{ email: ["…", "…"] }`), set each time a new object arrives.
 * - Any other `useForm` option is passed through unchanged; react-hook-form's defaults apply.
 *
 * When the schema changes identity (language or parameters), the fields with a schema error are
 * validated again, so their messages follow it.
 *
 * @example
 * const form = useSchemaForm(profileSchema, { defaultValues: { name: "" } });
 */
export function useSchemaForm<S extends FormSchema, B = ServerErrors<FormInput<S>>>(
  schema: S,
  options: SchemaFormOptions<S, B>,
): SchemaFormReturn<S> {
  const {
    defaultValues,
    values,
    serverErrors,
    parseServerErrors,
    joinMessages,
    resolverOptions,
    ...formOptions
  } = options;

  const resolver = useMemo(
    () =>
      zodResolver(schema as never, resolverOptions) as unknown as Resolver<
        FormInput<S>,
        unknown,
        FormOutput<S>
      >,
    [schema, resolverOptions],
  );
  const mergedValues = useMergedValues(defaultValues, values);

  const form = useForm<FormInput<S>, unknown, FormOutput<S>>({
    ...formOptions,
    resolver,
    defaultValues: defaultValues as DefaultValues<FormInput<S>>,
    values: mergedValues,
  });

  useServerErrors(form, serverErrors, { joinMessages, parse: parseServerErrors });
  useSchemaRevalidation(form, schema);
  return form;
}
