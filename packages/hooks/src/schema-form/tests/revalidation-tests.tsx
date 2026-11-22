import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createContext, useContext, useMemo } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { resetWarnings } from "@/internal/utils/helpers";
import { createFormHook, type ServerErrors } from "..";
import { errorOf, FormView, input, save } from "./form-harness";

afterEach(() => {
  resetWarnings();
  vi.restoreAllMocks();
});

type Lang = "en" | "es";
const LangContext = createContext<Lang>("en");
const required: Record<Lang, string> = { en: "Required", es: "Obligatorio" };

/** A schema hook like the apps' ones: memoized on the language (i18next's `t`). */
function useLoginSchema() {
  const lang = useContext(LangContext);
  return useMemo(
    () =>
      z.object({
        email: z.string().min(1, required[lang]),
        password: z.string().min(1, required[lang]),
      }),
    [lang],
  );
}

const defaults = { email: "", password: "" };
const useLoginForm = createFormHook({ schema: useLoginSchema, defaultValues: defaults });

function Login({ serverErrors }: { serverErrors?: ServerErrors<typeof defaults> }) {
  const form = useLoginForm({ serverErrors });
  return <FormView form={form} fields={["email", "password"]} />;
}

const inLang = (lang: Lang, serverErrors?: ServerErrors<typeof defaults>) => (
  <LangContext.Provider value={lang}>
    <Login serverErrors={serverErrors} />
  </LangContext.Provider>
);

describe("messages follow schema changes", () => {
  it("translates the visible errors when the language changes", async () => {
    const { rerender } = render(inLang("en"));
    await save();
    await waitFor(() => expect(errorOf("email")).toBe("Required"));
    expect(errorOf("password")).toBe("Required");

    rerender(inLang("es"));
    await waitFor(() => expect(errorOf("email")).toBe("Obligatorio"));
    expect(errorOf("password")).toBe("Obligatorio");
  });

  it("does not validate fields that show no error", async () => {
    const { rerender } = render(inLang("en"));
    rerender(inLang("es"));
    await act(async () => {});
    expect(errorOf("email")).toBeNull();
    expect(errorOf("password")).toBeNull();
  });

  it("keeps server errors", async () => {
    const { rerender } = render(inLang("en"));
    await userEvent.type(input("email"), "ana@mail.com");
    await save();
    await waitFor(() => expect(errorOf("password")).toBe("Required"));

    rerender(inLang("en", { email: ["Already registered"] }));
    await waitFor(() => expect(errorOf("email")).toBe("Already registered"));

    rerender(inLang("es", { email: ["Already registered"] }));
    await waitFor(() => expect(errorOf("password")).toBe("Obligatorio"));
    expect(errorOf("email")).toBe("Already registered");
  });
});

// Not memoized: a new schema on every render.
const useUnstableSchema = () => z.object({ email: z.string().min(1, "Required") });
const useUnstableForm = createFormHook({ schema: useUnstableSchema, defaultValues: { email: "" } });
let renders = 0;

function Unstable() {
  renders += 1;
  const form = useUnstableForm();
  // Reading form state subscribes this component, so every validation re-renders it (and re-creates
  // the schema): the case that would loop without the guard.
  const errorCount = Object.keys(form.formState.errors).length;
  return (
    <>
      <FormView form={form} fields={["email"]} />
      <p>{errorCount}</p>
    </>
  );
}

describe("unstable schema guard", () => {
  it("stops after one re-validation and warns once", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renders = 0;
    render(<Unstable />);
    await save();
    await waitFor(() => expect(errorOf("email")).toBe("Required"));
    await new Promise((resolve) => setTimeout(resolve, 50));
    const settled = renders;
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(renders).toBe(settled);
    expect(renders).toBeLessThan(20);
    const unstable = warn.mock.calls.filter(([message]) =>
      String(message).includes("schema changed"),
    );
    expect(unstable).toHaveLength(1);
    expect(String(unstable[0]?.[0])).toMatch(/^\[useSchemaForm\] /);
  });
});
