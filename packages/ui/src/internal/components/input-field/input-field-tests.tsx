import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InputField, type InputFieldProps } from "./input-field";

const renderInput = (props: Partial<InputFieldProps>) =>
  render(<InputField label="Secret" type="text" {...props} />);

describe("InputField", () => {
  it("renders the requested input type", () => {
    const { container, unmount } = renderInput({ type: "password" });
    expect(container.querySelector("input")?.getAttribute("type")).toBe("password");
    unmount();
    renderInput({ type: "text" });
    expect(screen.getByRole("textbox").getAttribute("type")).toBe("text");
  });

  it("keeps the type a public field passes last, whatever its consumer sent", () => {
    // Public fields spread their props first and pass `type` last, so a stray `type` forced past
    // the types by a consumer never reaches the input.
    const stray = { type: "email" } as unknown as Partial<InputFieldProps>;
    const { container } = render(<InputField label="Secret" {...stray} type="password" />);
    expect(container.querySelector("input")?.getAttribute("type")).toBe("password");
  });

  it("disables the action while loading", () => {
    renderInput({ loading: true, action: { children: "Go" } });
    expect((screen.getByRole("button", { name: "Go" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("status", { name: "Loading" })).toBeTruthy();
  });
});
