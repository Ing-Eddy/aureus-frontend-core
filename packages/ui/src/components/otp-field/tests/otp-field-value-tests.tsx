import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OtpField } from "../otp-field";
import { input, renderField, slotTexts, typeInto } from "./helpers";

afterEach(() => vi.restoreAllMocks());

function Controlled({ onValueChange }: { onValueChange: (value: string) => void }) {
  const [value, setValue] = useState("12");
  return (
    <OtpField
      label="Controlled"
      length={4}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange(next);
      }}
    />
  );
}

describe("OtpField value", () => {
  it("fills the boxes as the user types and completes once", async () => {
    const onValueChange = vi.fn();
    const onComplete = vi.fn();
    const { container } = renderField(
      <OtpField label="Code" length={6} onValueChange={onValueChange} onComplete={onComplete} />,
    );
    await typeInto(input("Code"), "123456");
    expect(slotTexts(container)).toEqual(["1", "2", "3", "4", "5", "6"]);
    expect(onValueChange).toHaveBeenLastCalledWith("123456");
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith("123456");
  });

  it("follows a controlled value", async () => {
    const onValueChange = vi.fn();
    const { container } = renderField(<Controlled onValueChange={onValueChange} />);
    expect(slotTexts(container)).toEqual(["1", "2", "", ""]);
    await userEvent.click(input("Controlled"));
    await userEvent.keyboard("3");
    expect(onValueChange).toHaveBeenLastCalledWith("123");
  });

  it("sanitises a default value that does not fit, with a warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = renderField(<OtpField label="Code" length={4} defaultValue="12a345" />);
    expect(slotTexts(container)).toEqual(["1", "2", "3", "4"]);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"12a345"'));
  });

  it("submits the surrounding form on completion only with submitOnComplete", async () => {
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
    const { unmount } = renderField(
      <form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}>
        <OtpField label="Code" length={4} submitOnComplete />
      </form>,
    );
    await typeInto(input("Code"), "1234");
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    unmount();

    onSubmit.mockClear();
    renderField(
      <form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}>
        <OtpField label="Code" length={4} />
      </form>,
    );
    await typeInto(input("Code"), "1234");
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits its value under its name in native forms", () => {
    const { container } = renderField(
      <form>
        <OtpField label="Code" name="code" length={4} defaultValue="1234" />
      </form>,
    );
    const data = new FormData(container.querySelector("form") as HTMLFormElement);
    expect(data.get("code")).toBe("1234");
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
  });
});
