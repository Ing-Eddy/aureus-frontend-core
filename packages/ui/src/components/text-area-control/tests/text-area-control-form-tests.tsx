import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextAreaControl } from "../text-area-control";
import { lenientSchema, renderInForm } from "./render-in-form";

const save = () => userEvent.click(screen.getByRole("button", { name: "Save" }));
const bio = () => screen.getByRole("textbox", { name: "Bio" }) as HTMLTextAreaElement;

describe("TextAreaControl in a form", () => {
  it("registers and submits a multi-line value", async () => {
    const { onSubmit } = renderInForm(<TextAreaControl name="bio" label="Bio" />, {
      bio: "",
      notes: "",
    });
    await userEvent.type(bio(), "I build design systems.{Enter}And forms.");
    await save();
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        bio: "I build design systems.\nAnd forms.",
        notes: "",
      }),
    );
  });

  it("shows the schema message in place of the helper, and clears it once fixed", async () => {
    renderInForm(<TextAreaControl name="bio" label="Bio" helperText="Tell us about you." />, {
      bio: "Too short",
      notes: "",
    });
    await save();
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe("Write at least 20 characters."),
    );
    expect(bio().getAttribute("aria-invalid")).toBe("true");
    expect(screen.queryByText("Tell us about you.")).toBeNull();

    await userEvent.type(bio(), ", but now it is long enough");
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
    expect(screen.getByText("Tell us about you.")).toBeTruthy();
  });

  it("counts the form value", async () => {
    const { container } = renderInForm(
      <TextAreaControl
        countLabel={(count, max) =>
          max === undefined ? `${count} characters` : `${max - count} characters remaining`
        }
        name="bio"
        label="Bio"
        showCount
        maxLength={500}
      />,
      { bio: "Hello", notes: "" },
    );
    const counter = () => container.querySelector("[data-slot=field-counter]")?.textContent;
    expect(counter()).toBe("5/500");
    await userEvent.type(bio(), "!!");
    expect(counter()).toBe("7/500");
  });

  it("leaves a disabled field out and keeps a loading one", async () => {
    const { onSubmit } = renderInForm(
      <>
        <TextAreaControl loadingLabel="Loading" name="bio" label="Bio" loading />
        <TextAreaControl name="notes" label="Notes" disabled />
      </>,
      { bio: "A long enough biography text.", notes: "internal" },
      lenientSchema,
    );
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const submitted = onSubmit.mock.calls[0]?.[0];
    expect(submitted?.bio).toBe("A long enough biography text.");
    expect(submitted?.notes).toBeUndefined();
  });

  it("throws outside a FormProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TextAreaControl name="bio" label="Bio" />)).toThrow(
      "TextAreaControl must be rendered inside a react-hook-form FormProvider.",
    );
    vi.restoreAllMocks();
  });
});
