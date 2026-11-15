import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RadioGroupField } from "../radio-group-field";
import { plans, radio, renderField } from "./helpers";

afterEach(() => vi.restoreAllMocks());

describe("RadioGroupField accessibility", () => {
  it("is a radiogroup named and described, with its required and invalid state", () => {
    renderField(
      <RadioGroupField
        id="plan"
        label="Plan"
        options={plans}
        required
        error
        errorMessage="Choose a plan."
        info="Billed monthly"
      />,
    );
    const group = screen.getByRole("radiogroup", { name: "Plan" });
    expect(group.getAttribute("aria-required")).toBe("true");
    expect(group.getAttribute("aria-invalid")).toBe("true");
    expect(group.getAttribute("aria-describedby")?.split(" ")).toEqual([
      "plan-helper",
      "plan-info",
    ]);
    expect(screen.getByRole("alert").textContent).toBe("Choose a plan.");
    expect(screen.getByText("Plan").closest("label")?.hasAttribute("for")).toBe(false);
  });

  it("names each radio by its option and describes it by its description", () => {
    renderField(<RadioGroupField label="Plan" options={plans} />);
    expect(radio("Free").getAttribute("aria-describedby")).toBe(
      screen.getByText("Up to 3 projects").getAttribute("id"),
    );
    expect(radio("Pro").hasAttribute("aria-describedby")).toBe(false);
  });

  it("warns when the group has no name, and accepts aria-label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { unmount } = renderField(<RadioGroupField options={plans} />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("the group has no accessible name"));
    unmount();
    warn.mockClear();
    renderField(<RadioGroupField aria-label="Plan" options={plans} />);
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeTruthy();
    expect(warn).not.toHaveBeenCalled();
  });

  it("follows a link in an option label without selecting", async () => {
    const onValueChange = vi.fn();
    renderField(
      <RadioGroupField
        label="Plan"
        options={[
          {
            value: "pro",
            label: (
              <>
                Pro (<a href="#pricing">pricing</a>)
              </>
            ),
          },
        ]}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("link", { name: "pricing" }));
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText(/^Pro/));
    expect(onValueChange).toHaveBeenLastCalledWith("pro");
  });
});
