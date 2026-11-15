import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { CheckboxField } from "../checkbox-field";
import { box, renderField } from "./helpers";

function Controlled() {
  const [value, setValue] = useState<number>(1);
  return (
    <>
      <CheckboxField
        checkboxLabel="Enabled"
        checkedValue={1}
        uncheckedValue={0}
        value={value}
        onValueChange={setValue}
      />
      <output>{value}</output>
    </>
  );
}

describe("CheckboxField value", () => {
  it("toggles a boolean from the box and from its text", async () => {
    const onValueChange = vi.fn();
    renderField(<CheckboxField checkboxLabel="Remember me" onValueChange={onValueChange} />);
    const checkbox = box("Remember me");
    expect(checkbox.getAttribute("aria-checked")).toBe("false");
    await userEvent.click(checkbox);
    expect(onValueChange).toHaveBeenLastCalledWith(true);
    expect(checkbox.getAttribute("aria-checked")).toBe("true");
    await userEvent.click(screen.getByText("Remember me"));
    expect(onValueChange).toHaveBeenLastCalledWith(false);
    expect(checkbox.getAttribute("aria-checked")).toBe("false");
  });

  it("reports custom values", async () => {
    const onValueChange = vi.fn();
    renderField(
      <CheckboxField
        checkboxLabel="Active"
        checkedValue="S"
        uncheckedValue="N"
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(box("Active"));
    expect(onValueChange).toHaveBeenLastCalledWith("S");
    await userEvent.click(box("Active"));
    expect(onValueChange).toHaveBeenLastCalledWith("N");
  });

  it("starts from defaultValue and follows a controlled value", async () => {
    renderField(
      <>
        <CheckboxField checkboxLabel="Uncontrolled" defaultValue />
        <Controlled />
      </>,
    );
    expect(box("Uncontrolled").getAttribute("aria-checked")).toBe("true");
    expect(box("Enabled").getAttribute("aria-checked")).toBe("true");
    await userEvent.click(box("Enabled"));
    expect(screen.getByRole("status").textContent).toBe("0");
    expect(box("Enabled").getAttribute("aria-checked")).toBe("false");
  });

  it("submits its name and the custom checked value in native forms", async () => {
    const { container } = renderField(
      <form>
        <CheckboxField checkboxLabel="Boolean" name="flag" defaultValue />
        <CheckboxField
          checkboxLabel="Custom"
          name="active"
          checkedValue="S"
          uncheckedValue="N"
          defaultValue="S"
        />
      </form>,
    );
    const data = new FormData(container.querySelector("form") as HTMLFormElement);
    expect(data.get("flag")).toBe("on");
    expect(data.get("active")).toBe("S");
  });
});
