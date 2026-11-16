import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "../text-field";

function Controlled() {
  const [value, setValue] = useState("");
  return (
    <>
      <TextField
        label="Name"
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
      />
      <output>{value}</output>
    </>
  );
}

describe("TextField states", () => {
  it("disables the input, sets aria-busy and shows a status while loading", () => {
    render(<TextField loadingLabel="Loading" label="Coupon" loading />);
    const input = screen.getByRole("textbox", { name: "Coupon" }) as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("status", { name: "Loading" })).toBeTruthy();
  });

  it("accepts a custom loading label", () => {
    render(<TextField label="Coupon" loading loadingLabel="Cargando" />);
    expect(screen.getByRole("status", { name: "Cargando" })).toBeTruthy();
  });

  it("disables the input and marks the root when disabled", () => {
    const { container } = render(<TextField label="Coupon" disabled />);
    expect((screen.getByRole("textbox") as HTMLInputElement).disabled).toBe(true);
    expect(container.querySelector("[data-slot=field]")?.getAttribute("data-disabled")).toBe(
      "true",
    );
  });

  it("replaces the helper with the error message", () => {
    const { rerender } = render(<TextField label="Email" helperText="Work email" />);
    expect(screen.getByText("Work email")).toBeTruthy();

    rerender(
      <TextField label="Email" helperText="Work email" error errorMessage="Invalid email" />,
    );
    expect(screen.queryByText("Work email")).toBeNull();
    expect(screen.getByRole("alert").textContent).toBe("Invalid email");
  });

  it("merges classNames.label with the default label classes", () => {
    render(<TextField label="Email" classNames={{ label: "uppercase" }} />);
    const label = screen.getByText("Email").closest("label");
    expect(label?.className).toContain("uppercase");
    expect(label?.className).toContain("font-medium");
  });

  it("forwards the ref to the input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField label="Email" ref={ref} />);
    ref.current?.focus();
    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });

  it("works uncontrolled", async () => {
    const onChange = vi.fn();
    render(<TextField label="Name" defaultValue="ada" onChange={onChange} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    await userEvent.type(input, "m");
    expect(input.value).toBe("adam");
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("works controlled", async () => {
    render(<Controlled />);
    await userEvent.type(screen.getByRole("textbox"), "ab");
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("AB");
  });

  it("is always a text input and passes native props to it", () => {
    render(<TextField label="Code" placeholder="AUR-0000" autoComplete="off" maxLength={8} />);
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("type")).toBe("text");
    expect(input.getAttribute("placeholder")).toBe("AUR-0000");
    expect(input.getAttribute("autocomplete")).toBe("off");
    expect(input.getAttribute("maxlength")).toBe("8");
  });

  it("has no type prop", () => {
    // @ts-expect-error `type` is not a prop: the input is always `type="text"`.
    const element = <TextField label="Email" type="email" />;
    render(element);
    // Even if forced past the types, the input stays a text input.
    expect(screen.getByRole("textbox").getAttribute("type")).toBe("text");
  });
});
