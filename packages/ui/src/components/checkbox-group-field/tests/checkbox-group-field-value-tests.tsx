import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CheckboxGroupField } from "../checkbox-group-field";
import { box, channels, renderField } from "./helpers";

afterEach(() => vi.restoreAllMocks());

function Controlled({ onValueChange }: { onValueChange: (value: string[]) => void }) {
  const [value, setValue] = useState<string[]>(["sms"]);
  return (
    <CheckboxGroupField
      label="Channels"
      options={channels}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange(next);
      }}
    />
  );
}

describe("CheckboxGroupField value", () => {
  it("reports the options order, whatever the click order", async () => {
    const onValueChange = vi.fn();
    renderField(
      <CheckboxGroupField label="Channels" options={channels} onValueChange={onValueChange} />,
    );
    await userEvent.click(box("SMS"));
    await userEvent.click(box("Email"));
    expect(onValueChange).toHaveBeenLastCalledWith(["email", "sms"]);
    await userEvent.click(box("Email"));
    expect(onValueChange).toHaveBeenLastCalledWith(["sms"]);
  });

  it("starts from defaultValue and follows a controlled value", async () => {
    const onValueChange = vi.fn();
    renderField(
      <>
        <CheckboxGroupField
          label="Uncontrolled"
          options={[{ value: "a", label: "A" }]}
          defaultValue={["a"]}
        />
        <Controlled onValueChange={onValueChange} />
      </>,
    );
    expect(box("A").getAttribute("aria-checked")).toBe("true");
    expect(box("SMS").getAttribute("aria-checked")).toBe("true");
    await userEvent.click(box("Slack"));
    expect(onValueChange).toHaveBeenLastCalledWith(["sms", "slack"]);
    expect(box("Slack").getAttribute("aria-checked")).toBe("true");
  });

  it("keeps values that match no option", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const onValueChange = vi.fn();
    renderField(
      <CheckboxGroupField
        label="Channels"
        options={channels}
        defaultValue={["fax", "email"]}
        onValueChange={onValueChange}
      />,
    );
    expect(box(/^Email/).getAttribute("aria-checked")).toBe("true");
    await userEvent.click(box("SMS"));
    expect(onValueChange).toHaveBeenLastCalledWith(["email", "sms", "fax"]);
  });

  it("submits every checked value under its name in native forms", () => {
    const { container } = renderField(
      <form>
        <CheckboxGroupField
          label="Channels"
          name="channels"
          options={channels}
          defaultValue={["email", "sms"]}
        />
      </form>,
    );
    const data = new FormData(container.querySelector("form") as HTMLFormElement);
    expect(data.getAll("channels")).toEqual(["email", "sms"]);
  });
});
