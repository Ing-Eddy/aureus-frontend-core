import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckboxGroupControl } from "../checkbox-group-control";
import { channels, lenientSchema, permissions, renderInForm } from "./render-in-form";

const save = () => userEvent.click(screen.getByRole("button", { name: "Save" }));

function Both() {
  return (
    <>
      <CheckboxGroupControl name="channels" label="Channels" required options={channels} />
      <CheckboxGroupControl name="permissions" label="Permissions" options={permissions} />
    </>
  );
}

describe("CheckboxGroupControl in a form", () => {
  it("submits a string[] in the options order", async () => {
    const { onSubmit } = renderInForm(<Both />);
    await userEvent.click(screen.getByRole("checkbox", { name: "SMS" }));
    await userEvent.click(screen.getByRole("checkbox", { name: "Email" }));
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ channels: ["email", "sms"], permissions: [] });
  });

  it("shows the schema messages and focuses the first enabled box", async () => {
    const { onSubmit } = renderInForm(<Both />, {
      channels: [],
      permissions: ["read", "write", "delete"],
    });
    await save();
    await waitFor(() => expect(screen.getAllByRole("alert")).toHaveLength(2));
    expect(screen.getByText("Choose at least one channel.")).toBeTruthy();
    expect(screen.getByText("Choose at most two permissions.")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("checkbox", { name: "Email" }));
    expect(screen.getByRole("checkbox", { name: "Email" }).getAttribute("aria-invalid")).toBe(
      "true",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("treats a missing form value as an empty array", () => {
    renderInForm(<CheckboxGroupControl name="channels" label="Channels" options={channels} />, {});
    expect(
      screen
        .getAllByRole("checkbox")
        .every((checkbox) => checkbox.getAttribute("aria-checked") === "false"),
    ).toBe(true);
  });

  it("leaves disabled values out and keeps loading values", async () => {
    const { onSubmit } = renderInForm(
      <>
        <CheckboxGroupControl
          loadingLabel="Loading"
          name="channels"
          label="Channels"
          options={channels}
          loading
        />
        <CheckboxGroupControl
          name="permissions"
          label="Permissions"
          options={permissions}
          disabled
        />
      </>,
      { channels: ["email"], permissions: ["read"] },
      lenientSchema,
    );
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const values = onSubmit.mock.calls[0]?.[0];
    expect(values?.channels).toEqual(["email"]);
    expect(values?.permissions).toBeUndefined();
  });

  it("throws outside a FormProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(<CheckboxGroupControl name="channels" label="Channels" options={channels} />),
    ).toThrow();
    vi.restoreAllMocks();
  });
});
