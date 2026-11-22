import { useSchemaForm } from "../schema-form";
import type {
  CreateFormHookConfig,
  FormHook,
  FormInput,
  FormSchema,
  SchemaOf,
  SchemaSource,
  ServerErrors,
} from "../types";

/** `base` with the defined entries of `overrides` on top (an `undefined` override keeps the base). */
function withOverrides(base: object, overrides: object): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    if (value !== undefined) result[key] = value;
  }
  return result;
}

/**
 * Creates the hook of one form from its schema, its initial values and its own options. No global
 * configuration: each form hook uses only what it is given here.
 *
 * - `schema`: a zod schema, or a schema hook (`useLoginSchema`). A hook with a parameter receives
 *   `schemaParams`, which TypeScript then requires (or accepts, if the parameter is optional).
 * - `defaultValues`: the initial values (usually empty), with the schema's input type.
 * - Any `useForm` option (`mode`, `shouldUnregister`…), `joinMessages`, `parseServerErrors` and
 *   `resolverOptions`. Options passed when the hook is called override these for that call.
 *
 * @example
 * export const useCompanyForm = createFormHook({ schema: useCompanySchema, defaultValues: COMPANY_DEFAULTS });
 *
 * const form = useCompanyForm({ schemaParams: { isEdit: true }, values: company, serverErrors });
 */
export function createFormHook<
  Src extends SchemaSource,
  B = ServerErrors<FormInput<SchemaOf<Src>>>,
>(config: CreateFormHookConfig<Src, B>): FormHook<Src, B> {
  const { schema, ...formConfig } = config;

  // biome-ignore lint/correctness/noComponentHookFactories: creating a hook is this factory's purpose; consumers call it once, at module level.
  function useConfiguredForm(options?: { schemaParams?: unknown }) {
    const { schemaParams, ...callOptions } = options ?? {};
    // A schema hook is called on every render, so it follows the rules of hooks.
    const resolvedSchema = (
      typeof schema === "function" ? schema(schemaParams) : schema
    ) as FormSchema;
    return useSchemaForm(resolvedSchema, withOverrides(formConfig, callOptions) as never);
  }

  return useConfiguredForm as unknown as FormHook<Src, B>;
}
