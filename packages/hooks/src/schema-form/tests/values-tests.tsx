import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { createFormHook } from "..";
import { FormView, input, save } from "./form-harness";

const companySchema = z.object({
  name: z.string(),
  address: z.object({ city: z.string(), street: z.string() }),
});
const defaults = { name: "", address: { city: "", street: "" } };
type CompanyValues = { name?: string; address?: { city?: string; street?: string } };

const useCompanyForm = createFormHook({ schema: companySchema, defaultValues: defaults });
const useKeepDirtyForm = createFormHook({
  schema: companySchema,
  defaultValues: defaults,
  resetOptions: { keepDirtyValues: true },
});

function Company({
  values,
  keepDirty = false,
  onSubmit,
}: {
  values?: CompanyValues;
  keepDirty?: boolean;
  onSubmit?: (data: unknown) => void;
}) {
  const useForm = keepDirty ? useKeepDirtyForm : useCompanyForm;
  const form = useForm({ values });
  return (
    <FormView form={form} fields={["name", "address.city", "address.street"]} onSubmit={onSubmit} />
  );
}

describe("defaultValues and values", () => {
  it("starts with defaultValues without values (create mode)", () => {
    render(<Company />);
    expect(input("name").value).toBe("");
    expect(input("address.city").value).toBe("");
  });

  it("merges partial values over the defaults (edit mode)", async () => {
    const onSubmit = vi.fn();
    render(<Company values={{ name: "Acme", address: { city: "Lima" } }} onSubmit={onSubmit} />);
    expect(input("name").value).toBe("Acme");
    expect(input("address.city").value).toBe("Lima");
    expect(input("address.street").value).toBe("");
    await save();
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Acme",
        address: { city: "Lima", street: "" },
      }),
    );
  });

  it("fills the form when values arrive later", async () => {
    const { rerender } = render(<Company values={undefined} />);
    expect(input("name").value).toBe("");
    rerender(<Company values={{ name: "Acme" }} />);
    await waitFor(() => expect(input("name").value).toBe("Acme"));
  });

  it("does not reset for a new object with the same content", async () => {
    const { rerender } = render(<Company values={{ name: "Acme" }} />);
    await userEvent.clear(input("name"));
    await userEvent.type(input("name"), "Edited");
    rerender(<Company values={{ name: "Acme" }} />);
    await act(async () => {});
    expect(input("name").value).toBe("Edited");
  });

  it("resets to new content", async () => {
    const { rerender } = render(<Company values={{ name: "Acme" }} />);
    await userEvent.type(input("name"), "!");
    rerender(<Company values={{ name: "Globex" }} />);
    await waitFor(() => expect(input("name").value).toBe("Globex"));
  });

  it("keeps the user's edits with keepDirtyValues", async () => {
    const { rerender } = render(
      <Company keepDirty values={{ name: "Acme", address: { city: "Lima" } }} />,
    );
    await userEvent.clear(input("name"));
    await userEvent.type(input("name"), "Mine");
    rerender(<Company keepDirty values={{ name: "Globex", address: { city: "Quito" } }} />);
    await waitFor(() => expect(input("address.city").value).toBe("Quito"));
    expect(input("name").value).toBe("Mine");
  });

  it("does not mutate defaultValues", async () => {
    render(<Company values={{ name: "Acme", address: { city: "Lima" } }} />);
    await userEvent.type(input("address.street"), "Main");
    expect(defaults).toEqual({ name: "", address: { city: "", street: "" } });
    expect(screen.getAllByRole("textbox")).toHaveLength(3);
  });
});
