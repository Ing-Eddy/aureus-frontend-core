import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextControl } from "../text-control";
import { renderInForm } from "./render-in-form";

const save = () => userEvent.click(screen.getByRole("button", { name: "Save" }));

describe("TextControl in a form", () => {
  it("shows the form value and submits the edited value", async () => {
    const { onSubmit } = renderInForm(<TextControl name="username" label="Username" />, {
      username: "ada",
      nickname: "",
    });
    const input = screen.getByRole("textbox", { name: "Username" }) as HTMLInputElement;
    expect(input.value).toBe("ada");

    await userEvent.type(input, "m");
    await save();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ username: "adam", nickname: "" }));
  });

  it("shows the schema message in place of the helper, and restores the helper once fixed", async () => {
    renderInForm(<TextControl name="username" label="Username" helperText="Visible to others" />, {
      username: "ab",
      nickname: "",
    });
    const input = screen.getByRole("textbox", { name: "Username" });
    expect(screen.getByText("Visible to others")).toBeTruthy();

    await save();

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe("At least 3 characters"),
    );
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.queryByText("Visible to others")).toBeNull();
    expect(input.getAttribute("aria-describedby")).toContain(screen.getByRole("alert").id);

    await userEvent.type(input, "c");

    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
    expect(input.hasAttribute("aria-invalid")).toBe(false);
    expect(screen.getByText("Visible to others")).toBeTruthy();
  });

  it("focuses the first invalid field on submit", async () => {
    renderInForm(<TextControl name="username" label="Username" />, { username: "", nickname: "" });
    await save();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("textbox")));
  });

  it("composes the user's onChange and onBlur with the form's", async () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    renderInForm(
      <TextControl name="username" label="Username" onChange={onChange} onBlur={onBlur} />,
      { username: "", nickname: "" },
    );
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "a");
    await userEvent.tab();
    expect(onChange).toHaveBeenCalledOnce();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it("leaves a disabled field out of the submitted data", async () => {
    const { onSubmit } = renderInForm(
      <>
        <TextControl name="username" label="Username" />
        <TextControl name="nickname" label="Nickname" disabled />
      </>,
      { username: "ada", nickname: "countess" },
    );
    expect((screen.getByRole("textbox", { name: "Nickname" }) as HTMLInputElement).disabled).toBe(
      true,
    );

    await save();

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]).not.toHaveProperty("nickname", "countess");
  });

  it("keeps a loading field's value in the submitted data", async () => {
    const { onSubmit } = renderInForm(
      <>
        <TextControl name="username" label="Username" />
        <TextControl loadingLabel="Loading" name="nickname" label="Nickname" loading />
      </>,
      { username: "ada", nickname: "countess" },
    );
    expect((screen.getByRole("textbox", { name: "Nickname" }) as HTMLInputElement).disabled).toBe(
      true,
    );

    await save();

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ username: "ada", nickname: "countess" }),
    );
  });

  it("throws outside a FormProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TextControl name="username" label="Username" />)).toThrow(
      "TextControl must be rendered inside a react-hook-form FormProvider.",
    );
    vi.restoreAllMocks();
  });
});
