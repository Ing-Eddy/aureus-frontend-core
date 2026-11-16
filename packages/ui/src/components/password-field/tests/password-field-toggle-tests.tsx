import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PasswordField } from "../password-field";

const input = (container: HTMLElement) => container.querySelector("input") as HTMLInputElement;

describe("PasswordField toggle", () => {
  it("starts hidden", () => {
    const { container } = render(
      <PasswordField
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        label="Password"
      />,
    );
    expect(input(container).type).toBe("password");
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    expect(toggle.querySelector(".lucide-eye")).toBeTruthy();
  });

  it("shows the password when pressed", async () => {
    const { container } = render(
      <PasswordField
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        label="Password"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));

    expect(input(container).type).toBe("text");
    const toggle = screen.getByRole("button", { name: "Hide password" });
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    expect(toggle.querySelector(".lucide-eye-off")).toBeTruthy();

    await userEvent.click(toggle);
    expect(input(container).type).toBe("password");
  });

  it("keeps focus and the caret in the input when pressed with a pointer", async () => {
    const { container } = render(
      <PasswordField
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        label="Password"
        defaultValue="secret"
      />,
    );
    const field = input(container);
    field.focus();
    field.setSelectionRange(3, 3);

    await userEvent.click(screen.getByRole("button", { name: "Show password" }));

    expect(document.activeElement).toBe(field);
    expect(field.type).toBe("text");
    expect([field.selectionStart, field.selectionEnd]).toEqual([3, 3]);
  });

  it("keeps focus on the toggle when used from the keyboard", async () => {
    const { container } = render(
      <PasswordField
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        label="Password"
      />,
    );
    const toggle = screen.getByRole("button", { name: "Show password" });
    toggle.focus();
    await userEvent.keyboard(" ");
    expect(input(container).type).toBe("text");
    expect(document.activeElement).toBe(toggle);
  });

  it("can be uncontrolled with defaultVisible", () => {
    const { container } = render(
      <PasswordField
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        label="Password"
        defaultVisible
      />,
    );
    expect(input(container).type).toBe("text");
  });

  it("can be controlled with visible and onVisibleChange", async () => {
    const onVisibleChange = vi.fn();
    const { container, rerender } = render(
      <PasswordField
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        label="Password"
        visible={false}
        onVisibleChange={onVisibleChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(onVisibleChange).toHaveBeenCalledWith(true);
    // Controlled: nothing changes until the parent passes the new value.
    expect(input(container).type).toBe("password");

    rerender(
      <PasswordField
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        label="Password"
        visible
        onVisibleChange={onVisibleChange}
      />,
    );
    expect(input(container).type).toBe("text");
  });

  it("hides the password again when the form is submitted, before the submit handler runs", async () => {
    let typeAtSubmit: string | undefined;
    const onVisibleChange = vi.fn();
    const { container } = render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          typeAtSubmit = input(container).type;
        }}
      >
        <PasswordField
          showPasswordLabel="Show password"
          hidePasswordLabel="Hide password"
          label="Password"
          defaultVisible
          onVisibleChange={onVisibleChange}
        />
      </form>,
    );
    expect(input(container).type).toBe("text");

    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    expect(typeAtSubmit).toBe("password");
    expect(input(container).type).toBe("password");
    expect(onVisibleChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("button", { name: "Show password" })).toBeTruthy();
  });
});
