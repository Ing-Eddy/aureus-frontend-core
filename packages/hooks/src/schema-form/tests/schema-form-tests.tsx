import { act, render, renderHook, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { type FormSchema, useSchemaForm } from "..";
import { errorOf, FormView, input, save } from "./form-harness";

const schema = z.object({
  name: z
    .string()
    .min(3, "Too short")
    .regex(/^[a-z]+$/, "Lowercase only"),
  nickname: z.string(),
});
const defaults = { name: "", nickname: "" };

type Options = Omit<Parameters<typeof useSchemaForm<typeof schema>>[1], "defaultValues">;

function Profile({
  options = {},
  fields = ["name", "nickname"],
  onSubmit,
  formSchema = schema,
}: {
  options?: Options;
  fields?: string[];
  onSubmit?: (data: unknown) => void;
  formSchema?: FormSchema;
}) {
  const form = useSchemaForm(formSchema as typeof schema, { defaultValues: defaults, ...options });
  return <FormView form={form} fields={fields} onSubmit={onSubmit} />;
}

const ageSchema = z.object({ age: z.string().transform(Number) });

function Age({ onSubmit }: { onSubmit: (data: unknown) => void }) {
  const form = useSchemaForm(ageSchema, { defaultValues: { age: "" } });
  return <FormView form={form} fields={["age"]} onSubmit={onSubmit} />;
}

describe("useSchemaForm", () => {
  it("keeps react-hook-form's defaults: no validation on blur before submitting", async () => {
    render(<Profile />);
    await userEvent.type(input("name"), "A");
    await userEvent.tab();
    await act(async () => {});
    expect(errorOf("name")).toBeNull();
    await save();
    await waitFor(() => expect(errorOf("name")).toBe("Too short"));
  });

  it("passes mode through", async () => {
    render(<Profile options={{ mode: "onBlur" }} />);
    await userEvent.type(input("name"), "A");
    await userEvent.tab();
    await waitFor(() => expect(errorOf("name")).toBe("Too short"));
  });

  it("passes shouldUnregister through", async () => {
    // An unmounted field loses its value, so the schema must allow it to be missing.
    const optional = z.object({ name: z.string(), nickname: z.string().optional() });
    const onSubmit = vi.fn();
    const props = { formSchema: optional, options: { shouldUnregister: true }, onSubmit };
    const { rerender } = render(<Profile {...props} />);
    await userEvent.type(input("name"), "ada");
    await userEvent.type(input("nickname"), "countess");
    rerender(<Profile {...props} fields={["name"]} />);
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ name: "ada" }));
  });

  it("keeps unmounted values without shouldUnregister", async () => {
    const onSubmit = vi.fn();
    const { rerender } = render(<Profile onSubmit={onSubmit} />);
    await userEvent.type(input("name"), "ada");
    await userEvent.type(input("nickname"), "countess");
    rerender(<Profile onSubmit={onSubmit} fields={["name"]} />);
    await save();
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ name: "ada", nickname: "countess" }),
    );
  });

  it("passes criteriaMode through", async () => {
    const { result } = renderHook(() =>
      useSchemaForm(schema, { defaultValues: { name: "A", nickname: "" }, criteriaMode: "all" }),
    );
    await act(() => result.current.trigger("name"));
    expect(Object.values(result.current.getFieldState("name").error?.types ?? {}).flat()).toEqual(
      expect.arrayContaining(["Too short", "Lowercase only"]),
    );
  });

  it("submits the schema's output type", async () => {
    const onSubmit = vi.fn();
    render(<Age onSubmit={onSubmit} />);
    await userEvent.type(input("age"), "42");
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ age: 42 }));
  });

  it("passes resolverOptions to zod", async () => {
    const bare = z.object({ name: z.string().min(3), nickname: z.string() });
    render(
      <Profile
        formSchema={bare}
        options={{ resolverOptions: { error: () => "From the error map" } }}
      />,
    );
    await save();
    await waitFor(() => expect(errorOf("name")).toBe("From the error map"));
  });

  it("returns react-hook-form's form: reset() goes back to the merged values", async () => {
    const { result } = renderHook(() =>
      useSchemaForm(schema, { defaultValues: defaults, values: { name: "ada" } }),
    );
    await waitFor(() => expect(result.current.getValues("name")).toBe("ada"));
    act(() => result.current.setValue("name", "other"));
    act(() => result.current.reset());
    expect(result.current.getValues()).toEqual({ name: "ada", nickname: "" });
  });
});
