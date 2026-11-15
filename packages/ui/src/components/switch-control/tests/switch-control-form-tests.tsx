import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SwitchControl } from "../switch-control";
import { defaults, lenientSchema, renderInForm } from "./render-in-form";

const save = () => userEvent.click(screen.getByRole("button", { name: "Save" }));
const sw = (name: string | RegExp) => screen.getByRole("switch", { name });

function AllControls() {
  return (
    <>
      <SwitchControl name="consent" switchLabel="I consent" required />
      <SwitchControl name="alerts" label="Notifications" switchLabel="Alerts" />
      <SwitchControl
        name="visibility"
        switchLabel="Public profile"
        checkedValue="public"
        uncheckedValue="private"
      />
    </>
  );
}

describe("SwitchControl in a form", () => {
  it("submits booleans and custom values", async () => {
    const { onSubmit } = renderInForm(<AllControls />);
    await userEvent.click(sw(/^I consent/));
    await userEvent.click(sw("Alerts"));
    await userEvent.click(sw("Public profile"));
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      consent: true,
      alerts: true,
      visibility: "public",
    });
  });

  it("shows the schema message and focuses the switch", async () => {
    const { onSubmit } = renderInForm(<AllControls />);
    await save();
    await waitFor(() => expect(sw(/^I consent/).getAttribute("aria-invalid")).toBe("true"));
    expect(screen.getByRole("alert").textContent).toBe("Turn on the consent.");
    expect(document.activeElement).toBe(sw(/^I consent/));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("stores only confirmed changes", async () => {
    let confirm: (ok: boolean) => void = () => {};
    const onBeforeChange = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {
          confirm = resolve;
        }),
    );
    const { onSubmit } = renderInForm(
      <SwitchControl name="alerts" switchLabel="Alerts" onBeforeChange={onBeforeChange} />,
      defaults,
      lenientSchema,
    );
    await userEvent.click(sw("Alerts"));
    await act(async () => confirm(false));
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0]?.[0].alerts).toBe(false);
    await userEvent.click(sw("Alerts"));
    await act(async () => confirm(true));
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2));
    expect(onSubmit.mock.calls[1]?.[0].alerts).toBe(true);
  });

  it("shows off when the form value is missing", () => {
    renderInForm(<SwitchControl name="alerts" switchLabel="Alerts" />, {});
    expect(sw("Alerts").getAttribute("aria-checked")).toBe("false");
  });

  it("leaves disabled values out and keeps loading values", async () => {
    const { onSubmit } = renderInForm(
      <>
        <SwitchControl name="alerts" switchLabel="Alerts" loading />
        <SwitchControl name="consent" switchLabel="Consent" disabled />
      </>,
      { ...defaults, alerts: true, consent: true },
      lenientSchema,
    );
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const values = onSubmit.mock.calls[0]?.[0];
    expect(values?.alerts).toBe(true);
    expect(values?.consent).toBeUndefined();
  });

  it("throws outside a FormProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<SwitchControl name="alerts" switchLabel="Alerts" />)).toThrow();
    vi.restoreAllMocks();
  });
});
