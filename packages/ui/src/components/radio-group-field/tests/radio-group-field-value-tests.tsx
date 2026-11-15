import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RadioGroupField } from "../radio-group-field";
import { plans, radio, renderField } from "./helpers";

afterEach(() => vi.restoreAllMocks());

function Controlled({ onValueChange }: { onValueChange: (value: string | null) => void }) {
  const [value, setValue] = useState<string | null>("pro");
  return (
    <RadioGroupField
      label="Controlled"
      options={[
        { value: "pro", label: "Pro plan" },
        { value: "team", label: "Team plan" },
      ]}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange(next);
      }}
    />
  );
}

describe("RadioGroupField value", () => {
  it("checks nothing until a choice, then only one radio at a time", async () => {
    const onValueChange = vi.fn();
    renderField(<RadioGroupField label="Plan" options={plans} onValueChange={onValueChange} />);
    expect(
      screen.getAllByRole("radio").every((r) => r.getAttribute("aria-checked") === "false"),
    ).toBe(true);
    await userEvent.click(radio("Pro"));
    await userEvent.click(radio(/^Free/));
    expect(onValueChange).toHaveBeenLastCalledWith("free");
    expect(radio(/^Free/).getAttribute("aria-checked")).toBe("true");
    expect(radio("Pro").getAttribute("aria-checked")).toBe("false");
  });

  it("starts from defaultValue and follows a controlled value", async () => {
    const onValueChange = vi.fn();
    renderField(
      <>
        <RadioGroupField label="Uncontrolled" options={plans} defaultValue="team" />
        <Controlled onValueChange={onValueChange} />
      </>,
    );
    expect(radio("Team").getAttribute("aria-checked")).toBe("true");
    expect(radio("Pro plan").getAttribute("aria-checked")).toBe("true");
    await userEvent.click(radio("Team plan"));
    expect(onValueChange).toHaveBeenLastCalledWith("team");
    expect(radio("Team plan").getAttribute("aria-checked")).toBe("true");
  });

  it("checks nothing for a value that matches no option, and warns", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderField(<RadioGroupField label="Plan" options={plans} defaultValue="legacy" />);
    expect(
      screen.getAllByRole("radio").every((r) => r.getAttribute("aria-checked") === "false"),
    ).toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"legacy"'));
  });

  it("submits the checked value under its name in native forms", () => {
    const { container } = renderField(
      <form>
        <RadioGroupField label="Plan" name="plan" options={plans} defaultValue="pro" />
      </form>,
    );
    const data = new FormData(container.querySelector("form") as HTMLFormElement);
    expect(data.get("plan")).toBe("pro");
  });
});
