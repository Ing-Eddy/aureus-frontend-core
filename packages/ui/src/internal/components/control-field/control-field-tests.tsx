import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, type UseFormProps, useForm } from "react-hook-form";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ControlField } from "./control-field";

function Form({ children, options }: { children: ReactNode; options?: UseFormProps }) {
  const form = useForm(options);
  return <FormProvider {...form}>{children}</FormProvider>;
}

function Probe({ name }: { name: string }) {
  return (
    <ControlField
      componentName="Probe"
      name={name}
      render={({ field }) => <output data-testid="value">{String(field.value)}</output>}
    />
  );
}

afterEach(() => vi.restoreAllMocks());

describe("ControlField", () => {
  it("binds to the form in the FormProvider context", () => {
    render(
      <Form options={{ defaultValues: { username: "ada" } }}>
        <Probe name="username" />
      </Form>,
    );
    expect(screen.getByTestId("value").textContent).toBe("ada");
  });

  it("throws a descriptive error outside a FormProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe name="username" />)).toThrow(
      "Probe must be rendered inside a react-hook-form FormProvider.",
    );
  });

  it("warns once when the name is not in the default values", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Form options={{ defaultValues: { username: "" } }}>
        <Probe name="usrname" />
      </Form>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain('Probe: field "usrname"');
  });

  it("does not warn for nested names that exist", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Form options={{ defaultValues: { address: { city: "" } } }}>
        <Probe name="address.city" />
      </Form>,
    );
    expect(warn).not.toHaveBeenCalled();
  });

  it("skips the warning when defaults are loaded asynchronously", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Form options={{ defaultValues: async () => ({ username: "" }) }}>
        <Probe name="other" />
      </Form>,
    );
    expect(warn).not.toHaveBeenCalled();
  });
});
