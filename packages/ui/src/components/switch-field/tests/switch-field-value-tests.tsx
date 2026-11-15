import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SwitchField } from "../switch-field";
import { renderField, toggle } from "./helpers";

afterEach(() => vi.restoreAllMocks());

function Controlled() {
  const [value, setValue] = useState<"public" | "private">("private");
  return (
    <>
      <SwitchField
        switchLabel="Public profile"
        checkedValue="public"
        uncheckedValue="private"
        value={value}
        onValueChange={setValue}
      />
      <output>{value}</output>
    </>
  );
}

describe("SwitchField value", () => {
  it("toggles a boolean from the switch and from its text", async () => {
    const onValueChange = vi.fn();
    renderField(<SwitchField switchLabel="Alerts" onValueChange={onValueChange} />);
    await userEvent.click(toggle("Alerts"));
    expect(onValueChange).toHaveBeenLastCalledWith(true);
    expect(toggle("Alerts").getAttribute("aria-checked")).toBe("true");
    await userEvent.click(screen.getByText("Alerts"));
    expect(onValueChange).toHaveBeenLastCalledWith(false);
  });

  it("reports custom values and follows a controlled value", async () => {
    renderField(<Controlled />);
    expect(toggle("Public profile").getAttribute("aria-checked")).toBe("false");
    await userEvent.click(toggle("Public profile"));
    expect(screen.getByRole("status").textContent).toBe("public");
    expect(toggle("Public profile").getAttribute("aria-checked")).toBe("true");
  });

  it("shows an unknown value as off, with a warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderField(
      <SwitchField
        switchLabel="Visibility"
        checkedValue="public"
        uncheckedValue="private"
        value="team"
      />,
    );
    expect(toggle("Visibility").getAttribute("aria-checked")).toBe("false");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"team"'));
  });

  it("submits the custom checked value in native forms", () => {
    const { container } = renderField(
      <form>
        <SwitchField switchLabel="Boolean" name="alerts" defaultValue />
        <SwitchField
          switchLabel="Custom"
          name="visibility"
          checkedValue="public"
          uncheckedValue="private"
          defaultValue="public"
        />
      </form>,
    );
    const data = new FormData(container.querySelector("form") as HTMLFormElement);
    expect(data.get("alerts")).toBe("on");
    expect(data.get("visibility")).toBe("public");
  });
});
