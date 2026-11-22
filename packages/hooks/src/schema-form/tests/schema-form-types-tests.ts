import { useMemo } from "react";
import { describe, expectTypeOf, it } from "vitest";
import { z } from "zod";
import { createFormHook, type ServerErrors, useSchemaForm } from "..";

// Type-only checks: the hooks are never called here (they are hooks), only type-checked by `tsc`.

const loginSchema = z.object({ email: z.string(), password: z.string() });
const loginDefaults = { email: "", password: "" };
const useLoginSchema = () => useMemo(() => loginSchema, []);
const useCompanySchema = ({ isEdit }: { isEdit: boolean }) =>
  useMemo(
    () => z.object({ name: z.string(), taxId: isEdit ? z.string() : z.string().min(1) }),
    [isEdit],
  );
const useNoteSchema = (options?: { max?: number }) =>
  useMemo(() => z.object({ note: z.string().max(options?.max ?? 5) }), [options?.max]);

const useLoginForm = createFormHook({ schema: useLoginSchema, defaultValues: loginDefaults });
const useStaticForm = createFormHook({ schema: loginSchema, defaultValues: loginDefaults });
const useCompanyForm = createFormHook({
  schema: useCompanySchema,
  defaultValues: { name: "", taxId: "" },
});
const useNoteForm = createFormHook({ schema: useNoteSchema, defaultValues: { note: "" } });

describe("schema-form types", () => {
  it("follows the schema hook's parameter", () => {
    const _check = () => {
      useLoginForm();
      useStaticForm();
      // @ts-expect-error: a hook without parameters takes no schemaParams.
      useLoginForm({ schemaParams: {} });
      // @ts-expect-error: a static schema takes no schemaParams.
      useStaticForm({ schemaParams: { isEdit: true } });

      useCompanyForm({ schemaParams: { isEdit: true } });
      // @ts-expect-error: the parameter is required.
      useCompanyForm();
      // @ts-expect-error: options without schemaParams.
      useCompanyForm({ values: { name: "Acme" } });
      // @ts-expect-error: wrong parameter type.
      useCompanyForm({ schemaParams: { isEdit: "yes" } });

      useNoteForm();
      useNoteForm({ schemaParams: { max: 10 } });
    };
  });

  it("checks values against the input type", () => {
    const _check = () => {
      useCompanyForm({ schemaParams: { isEdit: true }, values: { name: "Acme" } });
      // @ts-expect-error: unknown field in values.
      useCompanyForm({ schemaParams: { isEdit: true }, values: { phone: "1" } });
    };
  });

  it("types defaultValues with the input and submit data with the output", () => {
    const ageSchema = z.object({ age: z.string().transform(Number) });
    createFormHook({ schema: ageSchema, defaultValues: { age: "" } });
    // @ts-expect-error: the input type of age is string, not the output number.
    createFormHook({ schema: ageSchema, defaultValues: { age: 1 } });

    const _check = () => {
      const form = useSchemaForm(ageSchema, { defaultValues: { age: "" } });
      form.handleSubmit((data) => {
        expectTypeOf(data.age).toEqualTypeOf<number>();
      });
      expectTypeOf(form.getValues("age")).toEqualTypeOf<string>();
    };
  });

  it("checks server error keys, and accepts a backend's string-keyed record", () => {
    const backend: Record<string, string[]> = { email: ["Taken"] };
    const _check = () => {
      useLoginForm({ serverErrors: { email: ["Taken"], "root.server": "Down", root: "x" } });
      // @ts-expect-error: unknown field in serverErrors.
      useLoginForm({ serverErrors: { phone: "Invalid" } });
      useLoginForm({ serverErrors: backend });
      const typed: ServerErrors<typeof loginDefaults> = { password: ["Short", "Common"] };
      useLoginForm({ serverErrors: typed });
    };
  });

  it("types serverErrors with the adapter's input", () => {
    const useLaravelForm = createFormHook({
      schema: loginSchema,
      defaultValues: loginDefaults,
      parseServerErrors: (body: { errors: Record<string, string[]> }) => body.errors,
    });
    const _check = () => {
      useLaravelForm({ serverErrors: { errors: { email: ["Taken"] } } });
      // @ts-expect-error: the adapter expects { errors }.
      useLaravelForm({ serverErrors: { email: ["Taken"] } });
    };
  });

  it("does not accept a resolver or a context", () => {
    // @ts-expect-error: the resolver is built from the schema.
    createFormHook({ schema: loginSchema, defaultValues: loginDefaults, resolver: undefined });
    // @ts-expect-error: context is not supported.
    createFormHook({ schema: loginSchema, defaultValues: loginDefaults, context: {} });
    createFormHook({
      schema: loginSchema,
      defaultValues: loginDefaults,
      mode: "onBlur",
      shouldUnregister: true,
    });
  });
});
