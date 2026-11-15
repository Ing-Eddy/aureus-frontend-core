import { afterEach, describe, expect, it, vi } from "vitest";
import { OtpField } from "../otp-field";
import { renderField } from "./helpers";

afterEach(() => vi.restoreAllMocks());

const blocks = (container: HTMLElement) =>
  [...container.querySelectorAll("[data-slot=input-otp-group]")].map(
    (group) => group.querySelectorAll("[data-slot=input-otp-slot]").length,
  );

describe("OtpField groups", () => {
  it("splits the boxes into blocks with separators", () => {
    const { container } = renderField(<OtpField label="Code" length={6} groups={[3, 3]} />);
    expect(blocks(container)).toEqual([3, 3]);
    expect(container.querySelectorAll("[data-slot=input-otp-separator]")).toHaveLength(1);
  });

  it("uses a custom separator", () => {
    const { container } = renderField(
      <OtpField label="Code" length={6} groups={[2, 2, 2]} separator={<span>·</span>} />,
    );
    const separators = container.querySelectorAll("[data-slot=input-otp-separator]");
    expect(separators).toHaveLength(2);
    expect(separators[0]?.textContent).toBe("·");
  });

  it("falls back to one block for groups that do not add up, with a warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = renderField(<OtpField label="Code" length={6} groups={[3, 2]} />);
    expect(blocks(container)).toEqual([6]);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("[3, 2]"));
  });
});
