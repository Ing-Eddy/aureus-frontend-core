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

describe("InputField slots", () => {
  it("renders the start slot before the input, the input-end slot first in the addon, and the end slot last", () => {
    const { container } = render(
      <InputField
        label="Amount"
        type="text"
        loading
        startSlot={<span data-testid="start" />}
        inputEndSlot={<span data-testid="input-end" />}
        endSlot={<span data-testid="end" />}
      />,
    );
    const frame = container.querySelector("[data-slot=input-group]") as HTMLElement;
    const children = [...frame.children];
    expect(children[0]?.getAttribute("data-testid")).toBe("start");
    expect(children[1]?.tagName).toBe("INPUT");
    const addon = children[2] as HTMLElement;
    expect(addon.getAttribute("data-slot")).toBe("input-group-addon");
    expect(addon.firstElementChild?.getAttribute("data-testid")).toBe("input-end");
    expect(addon.children[1]?.getAttribute("data-slot")).toBe("field-loading");
    expect(children[3]?.getAttribute("data-testid")).toBe("end");
  });

  it("renders the inline-end addon for an input-end slot alone", () => {
    const { container } = render(
      <InputField label="Weight" type="text" inputEndSlot={<span>kg</span>} />,
    );
    expect(container.querySelector("[data-slot=input-group-addon]")?.textContent).toBe("kg");
  });
});
