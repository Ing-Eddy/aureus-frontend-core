import { act, render, renderHook, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMemo } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { resetWarnings } from "@/internal/utils/helpers";
import { createFormHook, useSchemaForm } from "..";
import { errorOf, FormView, input, save } from "./form-harness";

afterEach(() => {
  resetWarnings();
  vi.restoreAllMocks();
});

const companySchema = z.object({
  name: z.string().min(1, "Required"),
  taxId: z.string().min(1, "Required"),
});
const companyDefaults = { name: "", taxId: "" };

/** A schema hook with a required parameter: in edit mode the tax id cannot change, so it is not required. */
function useCompanySchema({ isEdit }: { isEdit: boolean }) {
  return useMemo(
    () =>
      z.object({
        name: z.string().min(1, "Required"),
        taxId: isEdit ? z.string() : z.string().min(1, "Required"),
      }),
    [isEdit],
  );
}

/** A schema hook with an optional parameter. */
function useNoteSchema(options?: { max?: number }) {
  const max = options?.max ?? 5;
  return useMemo(() => z.object({ note: z.string().max(max, `At most ${max}`) }), [max]);
}

/** A schema hook without parameters. */
function useCitySchema() {
  return useMemo(() => z.object({ city: z.string().min(1, "Required") }), []);
}

/** Not memoized, with an object parameter: a new schema on every render. */
const useUnmemoizedSchema = (options: { min: number }) =>
  z.object({ name: z.string().min(options.min, "Too short") });

const useStaticCompanyForm = createFormHook({
  schema: companySchema,
  defaultValues: companyDefaults,
});
const useCityForm = createFormHook({ schema: useCitySchema, defaultValues: { city: "" } });
const useCompanyForm = createFormHook({ schema: useCompanySchema, defaultValues: companyDefaults });
const useNoteForm = createFormHook({ schema: useNoteSchema, defaultValues: { note: "123456" } });
const useNameForm = createFormHook({ schema: useUnmemoizedSchema, defaultValues: { name: "" } });
const useOnBlurForm = createFormHook({
  schema: companySchema,
  defaultValues: companyDefaults,
  mode: "onBlur",
});

function StaticCompany() {
  return <FormView form={useStaticCompanyForm()} fields={["name", "taxId"]} />;
}

function City() {
  return <FormView form={useCityForm()} fields={["city"]} />;
}

function EditCompany({ onSubmit }: { onSubmit: (data: unknown) => void }) {
  const form = useCompanyForm({ schemaParams: { isEdit: true }, values: { name: "Acme" } });
  return <FormView form={form} fields={["name", "taxId"]} onSubmit={onSubmit} />;
}

function Company({ isEdit }: { isEdit: boolean }) {
  return (
    <FormView form={useCompanyForm({ schemaParams: { isEdit } })} fields={["name", "taxId"]} />
  );
}

let nameRenders = 0;

function Name() {
  nameRenders += 1;
  const form = useNameForm({ schemaParams: { min: 3 } });
  // Subscribes to form state, so each validation re-renders this component and re-creates the schema.
  const errorCount = Object.keys(form.formState.errors).length;
  return (
    <>
      <FormView form={form} fields={["name"]} />
      <p>{errorCount}</p>
    </>
  );
}

function TwoForms() {
  const onBlur = useOnBlurForm();
  const byDefault = useStaticCompanyForm();
  return (
    <>
      <FormView form={onBlur} fields={["name"]} />
      <FormView form={byDefault} fields={["taxId"]} />
    </>
  );
}

function CallOverrides() {
  const overridden = useOnBlurForm({ mode: "onSubmit" });
  const configured = useOnBlurForm({ mode: undefined });
  return (
    <>
      <FormView form={overridden} fields={["name"]} />
      <FormView form={configured} fields={["taxId"]} />
    </>
  );
}

const blurField = async (name: string) => {
  await userEvent.click(input(name));
  await userEvent.tab();
};

describe("createFormHook", () => {
  it("works with a static schema and no arguments", async () => {
    render(<StaticCompany />);
    await save();
    await waitFor(() => expect(errorOf("name")).toBe("Required"));
  });

  it("works with a schema hook without parameters", async () => {
    render(<City />);
    await save();
    await waitFor(() => expect(errorOf("city")).toBe("Required"));
  });

  it("passes schemaParams to a schema hook with a required parameter", async () => {
    const onSubmit = vi.fn();
    render(<EditCompany onSubmit={onSubmit} />);
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ name: "Acme", taxId: "" }));
  });

  it("accepts an optional parameter, with or without schemaParams", async () => {
    const { result: withDefault } = renderHook(() => useNoteForm());
    await act(() => withDefault.current.trigger());
    expect(withDefault.current.getFieldState("note").error?.message).toBe("At most 5");

    const { result: withParams } = renderHook(() => useNoteForm({ schemaParams: { max: 10 } }));
    await act(() => withParams.current.trigger());
    expect(withParams.current.getFieldState("note").error).toBeUndefined();
  });

  it("applies the new rules when schemaParams changes", async () => {
    const { rerender } = render(<Company isEdit={false} />);
    await save();
    await waitFor(() => expect(errorOf("taxId")).toBe("Required"));
    rerender(<Company isEdit />);
    await waitFor(() => expect(errorOf("taxId")).toBeNull());
    expect(errorOf("name")).toBe("Required");
  });

  it("warns and does not loop with an inline object parameter and an unmemoized schema", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    nameRenders = 0;
    render(<Name />);
    await save();
    await waitFor(() => expect(errorOf("name")).toBe("Too short"));
    await new Promise((resolve) => setTimeout(resolve, 50));
    const settled = nameRenders;
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(nameRenders).toBe(settled);
    const unstable = warn.mock.calls.filter(([message]) =>
      String(message).includes("schema changed"),
    );
    expect(unstable).toHaveLength(1);
  });

  it("keeps each form's options to itself", async () => {
    render(<TwoForms />);
    await blurField("name");
    await blurField("taxId");
    await waitFor(() => expect(errorOf("name")).toBe("Required"));
    expect(errorOf("taxId")).toBeNull();
  });

  it("lets call options override the config for that call only", async () => {
    render(<CallOverrides />);
    await blurField("name");
    await blurField("taxId");
    await waitFor(() => expect(errorOf("taxId")).toBe("Required"));
    expect(errorOf("name")).toBeNull();
  });
});

// The schema the apps used: z.email(invalid).min(1, required).trim().
const originalEmailSchema = z.object({
  email: z.email("Invalid email").min(1, "Required").trim(),
});
// The recommended form: trim, then required, then the format (only on non-empty input).
const recommendedEmailSchema = z.object({
  email: z.string().trim().min(1, "Required").pipe(z.email("Invalid email")),
});

function Email({
  schema,
  onSubmit,
}: {
  schema: typeof originalEmailSchema | typeof recommendedEmailSchema;
  onSubmit?: (data: unknown) => void;
}) {
  const form = useSchemaForm(schema as typeof recommendedEmailSchema, {
    defaultValues: { email: "" },
  });
  return <FormView form={form} fields={["email"]} onSubmit={onSubmit} />;
}

describe("zod rule order (documented in the guide)", () => {
  it("original: an empty field shows the format message, not the required one", async () => {
    render(<Email schema={originalEmailSchema} />);
    await save();
    await waitFor(() => expect(errorOf("email")).toBe("Invalid email"));
  });

  it("original: a trailing trim() runs after the format check, so surrounding spaces fail", async () => {
    render(<Email schema={originalEmailSchema} />);
    await userEvent.type(input("email"), "  ana@mail.com ");
    await save();
    await waitFor(() => expect(errorOf("email")).toBe("Invalid email"));
  });

  it("recommended: empty → required, spaces trimmed before checking, bad format → invalid", async () => {
    const onSubmit = vi.fn();
    render(<Email schema={recommendedEmailSchema} onSubmit={onSubmit} />);
    await save();
    await waitFor(() => expect(errorOf("email")).toBe("Required"));
    await userEvent.type(input("email"), "ana");
    await save();
    await waitFor(() => expect(errorOf("email")).toBe("Invalid email"));
    await userEvent.clear(input("email"));
    await userEvent.type(input("email"), "  ana@mail.com ");
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ email: "ana@mail.com" }));
  });
});
