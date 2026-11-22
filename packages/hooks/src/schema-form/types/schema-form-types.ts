import type { zodResolver } from "@hookform/resolvers/zod";
import type { FieldPath, FieldValues, UseFormProps, UseFormReturn } from "react-hook-form";
import type * as z4 from "zod/v4/core";

/** Any zod 4 schema (zod or zod/mini) whose input is an object: the values of a form. */
export type FormSchema = z4.$ZodType<unknown, FieldValues>;

/** The form's values: the schema's input type. `defaultValues` and `values` use it. */
export type FormInput<S extends FormSchema> = z4.input<S> extends FieldValues ? z4.input<S> : never;

/** The data passed to `handleSubmit`: the schema's output type (after transforms and coercion). */
export type FormOutput<S extends FormSchema> = z4.output<S>;

/**
 * Partial values for edit forms: every object property is optional, recursively. Arrays, dates and
 * other non-plain values are replaced as a whole, so they are not made partial.
 */
export type DeepPartial<T> = T extends readonly unknown[] | Date | ((...args: never[]) => unknown)
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

/** A zod schema, or a hook (with or without one parameter) that returns one. */
// biome-ignore lint/suspicious/noExplicitAny: the parameter type is inferred from the consumer's hook.
export type SchemaSource = FormSchema | ((params: any) => FormSchema);

/** The schema produced by a `SchemaSource`. */
export type SchemaOf<Src> = Src extends (...args: never[]) => infer S ? S : Src;

/** A key of server errors: a field path (dot notation), or `root` / `root.<name>` for form-level errors. */
export type ServerErrorPath<In extends FieldValues> = FieldPath<In> | "root" | `root.${string}`;

/** One message or several for the same field. Empty messages are ignored. */
export type ServerErrorMessages = string | readonly string[] | null | undefined;

/**
 * Validation errors returned by a backend, by field path:
 * `{ email: ["Already registered", "Domain not allowed"], "address.city": "Required", root: "…" }`.
 */
export type ServerErrors<In extends FieldValues = FieldValues> = Partial<
  Record<ServerErrorPath<In>, ServerErrorMessages>
>;

/** Joins the messages of one field into the text shown by the control. */
export type JoinMessages = (messages: readonly string[]) => string;

/** Turns a backend error body of any shape into `ServerErrors`. */
export type ServerErrorsParser<B, In extends FieldValues> = (
  body: B,
) => ServerErrors<In> | null | undefined;

/** zod's parse options, passed to the resolver (for example `{ reportInput: true }`). */
export type ResolverOptions = Parameters<typeof zodResolver>[1];

/** Options the module manages itself, so they cannot be passed to `useForm`. */
type ManagedFormProps = "resolver" | "context" | "defaultValues" | "values";

/**
 * The behaviour of a form: every react-hook-form `useForm` option (except `resolver`, `context`,
 * `defaultValues` and `values`), plus the module's own. All optional and independent; react-hook-form's
 * defaults apply to anything left out.
 */
export type FormBehaviorOptions<S extends FormSchema, B = ServerErrors<FormInput<S>>> = Omit<
  UseFormProps<FormInput<S>, unknown, FormOutput<S>>,
  ManagedFormProps
> & {
  /** Joins several server messages of one field. Default: joined with a single space. */
  joinMessages?: JoinMessages;
  /** Converts `serverErrors` from your backend's shape. Without it, `serverErrors` is `ServerErrors`. */
  parseServerErrors?: ServerErrorsParser<B, FormInput<S>>;
  /** zod's parse options for validation. Keep the object stable (a constant). */
  resolverOptions?: ResolverOptions;
};

/** What a component passes when it uses a form: existing values and server errors. */
export type FormDataOptions<S extends FormSchema, B = ServerErrors<FormInput<S>>> = {
  /**
   * Existing data (edit forms), deep-merged over `defaultValues`. When it arrives later or its content
   * changes, the form is reset to it (`resetOptions` applies). A new object with equal content does
   * not reset.
   */
  values?: DeepPartial<FormInput<S>> | null;
  /**
   * Backend validation errors. They are set each time a new object is passed, so pass a stable object
   * (for example the request's error), not a literal created on every render.
   */
  serverErrors?: B | null;
};

/** Options of `useSchemaForm`. */
export type SchemaFormOptions<
  S extends FormSchema,
  B = ServerErrors<FormInput<S>>,
> = FormBehaviorOptions<S, B> &
  FormDataOptions<S, B> & {
    /** The form's initial values (usually empty), with the schema's input type. */
    defaultValues: FormInput<S>;
  };

/** react-hook-form's form object for a schema: input values, output data on submit. */
export type SchemaFormReturn<S extends FormSchema> = UseFormReturn<
  FormInput<S>,
  unknown,
  FormOutput<S>
>;

/** Configuration of `createFormHook`: the schema, the initial values and this form's behaviour. */
export type CreateFormHookConfig<
  Src extends SchemaSource,
  B = ServerErrors<FormInput<SchemaOf<Src>>>,
> = FormBehaviorOptions<SchemaOf<Src>, B> & {
  /** A zod schema, or a schema hook (for example `useLoginSchema`), with or without one parameter. */
  schema: Src;
  /** The form's initial values (usually empty), with the schema's input type. */
  defaultValues: FormInput<SchemaOf<Src>>;
};

/** Options of a form hook created with `createFormHook`. Behaviour options override the config for that call. */
export type FormHookOptions<
  Src extends SchemaSource,
  B = ServerErrors<FormInput<SchemaOf<Src>>>,
> = FormBehaviorOptions<SchemaOf<Src>, B> & FormDataOptions<SchemaOf<Src>, B>;

type SchemaParamsOf<Src> = Src extends (...args: infer A) => unknown ? A : [];

/**
 * The arguments of a form hook, from the schema hook's parameter:
 * - static schema or hook without parameters → `schemaParams` is not accepted;
 * - required parameter → `options` and `schemaParams` are required;
 * - optional parameter → `schemaParams` is optional.
 */
export type FormHookArgs<Src extends SchemaSource, Opts> =
  SchemaParamsOf<Src> extends []
    ? [options?: Opts & { schemaParams?: never }]
    : SchemaParamsOf<Src> extends [infer P]
      ? [options: Opts & { /** Passed to the schema hook. */ schemaParams: P }]
      : SchemaParamsOf<Src> extends [(infer P)?]
        ? [options?: Opts & { /** Passed to the schema hook. */ schemaParams?: P }]
        : [options?: Opts & { schemaParams?: unknown }];

/** A form hook created with `createFormHook` (for example `useLoginForm`). */
export type FormHook<Src extends SchemaSource, B = ServerErrors<FormInput<SchemaOf<Src>>>> = (
  ...args: FormHookArgs<Src, FormHookOptions<Src, B>>
) => SchemaFormReturn<SchemaOf<Src>>;

/** Options of `applyServerErrors`. */
export type ApplyServerErrorsOptions<B, In extends FieldValues> = {
  /** Joins several messages of one field. Default: joined with a single space. */
  joinMessages?: JoinMessages;
  /** Converts the errors from your backend's shape. */
  parse?: ServerErrorsParser<B, In>;
};
