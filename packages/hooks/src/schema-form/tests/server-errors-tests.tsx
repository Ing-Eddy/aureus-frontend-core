import { act, render, renderHook, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { resetWarnings } from "@/internal/utils/helpers";
import { applyServerErrors, createFormHook, type ServerErrors, useSchemaForm } from "..";
import { errorOf, FormView, input, save } from "./form-harness";

afterEach(() => {
  resetWarnings();
  vi.restoreAllMocks();
});

const schema = z.object({
  email: z.string().min(1, "Required"),
  password: z.string(),
  items: z.array(z.object({ name: z.string() })),
});
type Values = z.input<typeof schema>;
const defaults: Values = { email: "", password: "", items: [{ name: "" }] };

const useSignUpForm = createFormHook({
  schema,
  defaultValues: defaults,
  joinMessages: (messages) => messages.join(". "),
});

function SignUp({ serverErrors }: { serverErrors?: ServerErrors<Values> }) {
  const form = useSignUpForm({ serverErrors });
  return (
    <>
      <FormView form={form} fields={["email", "password", "items.0.name"]} />
      <p data-testid="root">{form.formState.errors.root?.message ?? ""}</p>
    </>
  );
}

// A hook rendered alone reads no form state while rendering, so react-hook-form does not re-render it
// on error changes: tests read the live state with getFieldState instead of formState.

describe("serverErrors", () => {
  it("joins an array of messages with joinMessages and keeps them in types.server", async () => {
    const errors = { email: ["Already registered", "Domain not allowed"] };
    const { result } = renderHook(() => useSignUpForm({ serverErrors: errors }));
    await waitFor(() => expect(result.current.getFieldState("email").error?.message).toBeDefined());
    const error = result.current.getFieldState("email").error;
    expect(error?.type).toBe("server");
    expect(error?.message).toBe("Already registered. Domain not allowed");
    expect(error?.types?.server).toEqual(["Already registered", "Domain not allowed"]);
  });

  it("joins with a space by default", async () => {
    const { result } = renderHook(() =>
      useSchemaForm(schema, { defaultValues: defaults, serverErrors: { email: ["A", "B"] } }),
    );
    await waitFor(() => expect(result.current.getFieldState("email").error?.message).toBe("A B"));
  });

  it("accepts a single message, a root error and dot paths", async () => {
    const { getByTestId } = render(
      <SignUp
        serverErrors={{
          password: "Too short",
          root: "Invalid credentials",
          "items.0.name": "Taken",
        }}
      />,
    );
    await waitFor(() => expect(errorOf("password")).toBe("Too short"));
    expect(errorOf("items.0.name")).toBe("Taken");
    expect(getByTestId("root").textContent).toBe("Invalid credentials");
  });

  it("creates no error for empty messages", async () => {
    const { result } = renderHook(() =>
      useSignUpForm({ serverErrors: { email: ["", ""], password: [] } }),
    );
    await act(async () => {});
    expect(result.current.getFieldState("email").error).toBeUndefined();
    expect(result.current.getFieldState("password").error).toBeUndefined();
  });

  it("warns once for a key that is not a field, and still sets it", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errors = { phone: "Invalid" } as unknown as ServerErrors<Values>;
    const { result } = renderHook(() => useSignUpForm({ serverErrors: errors }));
    await waitFor(() =>
      expect(result.current.getFieldState("phone" as "email").error?.message).toBe("Invalid"),
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(String(warn.mock.calls[0]?.[0])).toMatch(/^\[useSchemaForm\] .*"phone"/);
  });

  it("does not bring back an error the user fixed while the same object is passed", async () => {
    const errors = { email: ["Taken"] };
    const { rerender } = render(<SignUp serverErrors={errors} />);
    await waitFor(() => expect(errorOf("email")).toBe("Taken"));
    await save(); // the schema validates email: "" → Required replaces the server error
    await waitFor(() => expect(errorOf("email")).toBe("Required"));
    await userEvent.type(input("email"), "ana@mail.com");
    await waitFor(() => expect(errorOf("email")).toBeNull());
    rerender(<SignUp serverErrors={errors} />);
    await act(async () => {});
    expect(errorOf("email")).toBeNull();
  });

  it("sets the errors again for a new object with the same messages", async () => {
    const { rerender } = render(<SignUp serverErrors={{ email: ["Taken"] }} />);
    await waitFor(() => expect(errorOf("email")).toBe("Taken"));
    await userEvent.type(input("email"), "a");
    await save();
    await waitFor(() => expect(errorOf("email")).toBeNull());
    rerender(<SignUp serverErrors={{ email: ["Taken"] }} />);
    await waitFor(() => expect(errorOf("email")).toBe("Taken"));
  });

  it("leaves the errors unchanged with undefined", async () => {
    const errors = { email: ["Taken"] };
    const { rerender } = render(<SignUp serverErrors={errors} />);
    await waitFor(() => expect(errorOf("email")).toBe("Taken"));
    rerender(<SignUp serverErrors={undefined} />);
    await act(async () => {});
    expect(errorOf("email")).toBe("Taken");
  });
});

describe("parseServerErrors", () => {
  it("converts a Laravel-shaped body", async () => {
    const useLaravelForm = createFormHook({
      schema,
      defaultValues: defaults,
      parseServerErrors: (body: { message: string; errors: Record<string, string[]> }) =>
        body.errors,
    });
    const body = { message: "The given data was invalid.", errors: { email: ["Taken"] } };
    const { result } = renderHook(() => useLaravelForm({ serverErrors: body }));
    await waitFor(() => expect(result.current.getFieldState("email").error?.message).toBe("Taken"));
  });

  it("converts a list of { field, message }", async () => {
    type Issue = { field: string; message: string };
    const useListForm = createFormHook({
      schema,
      defaultValues: defaults,
      parseServerErrors: (issues: Issue[]) => {
        const errors: Record<string, string[]> = {};
        for (const { field, message } of issues)
          errors[field] = [...(errors[field] ?? []), message];
        return errors;
      },
    });
    const issues = [
      { field: "email", message: "Taken" },
      { field: "email", message: "Blocked" },
    ];
    const { result } = renderHook(() => useListForm({ serverErrors: issues }));
    await waitFor(() =>
      expect(result.current.getFieldState("email").error?.message).toBe("Taken Blocked"),
    );
  });
});

describe("applyServerErrors", () => {
  it("sets server errors imperatively, with joinMessages and parse", async () => {
    const { result } = renderHook(() => useSchemaForm(schema, { defaultValues: defaults }));
    act(() => applyServerErrors(result.current, { email: ["Taken", "Blocked"] }));
    expect(result.current.getFieldState("email").error).toMatchObject({
      type: "server",
      message: "Taken Blocked",
      types: { server: ["Taken", "Blocked"] },
    });
    act(() =>
      applyServerErrors(
        result.current,
        { errors: { password: ["Short", "Common"] } },
        {
          parse: (body: { errors: Record<string, string[]> }) => body.errors,
          joinMessages: (messages) => messages.join(" / "),
        },
      ),
    );
    expect(result.current.getFieldState("password").error?.message).toBe("Short / Common");
  });

  it("names itself in its warnings", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { result } = renderHook(() => useSchemaForm(schema, { defaultValues: defaults }));
    act(() => applyServerErrors(result.current, { nope: "x" } as never));
    expect(String(warn.mock.calls[0]?.[0])).toMatch(/^\[applyServerErrors\] /);
  });
});
