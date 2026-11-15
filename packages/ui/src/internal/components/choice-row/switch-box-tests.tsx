import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { ChoiceRow } from "./choice-row";
import { SwitchBox } from "./switch-box";

describe("SwitchBox", () => {
  it("is a switch whose decorations are hidden from assistive technology", () => {
    const { container } = render(
      <SwitchBox
        checked
        aria-label="Alerts"
        stateLabels={{ on: "Yes", off: "No" }}
        thumbIcons={{ on: <svg data-testid="on" />, off: <svg data-testid="off" /> }}
      />,
    );
    const toggle = screen.getByRole("switch", { name: "Alerts" });
    expect(toggle.getAttribute("aria-checked")).toBe("true");
    expect(screen.getByTestId("on")).toBeTruthy();
    expect(screen.queryByTestId("off")).toBeNull();
    const label = container.querySelector("[data-slot=switch-state-label]");
    expect(label?.getAttribute("aria-hidden")).toBe("true");
    expect(label?.querySelector(".invisible")?.textContent).toBe("No");
  });

  it("shows a decorative spinner in the thumb while busy", () => {
    const { container } = render(<SwitchBox checked={false} busy aria-label="Alerts" />);
    const spinner = container.querySelector("[data-slot=switch-thumb] [data-slot=switch-spinner]");
    expect(spinner?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("toggles from its state label inside a switch row", async () => {
    const onCheckedChange = vi.fn();
    const boxRef = createRef<HTMLButtonElement>();
    render(
      <ChoiceRow
        slot="switch"
        box={
          <SwitchBox
            ref={boxRef}
            checked={false}
            onCheckedChange={onCheckedChange}
            aria-labelledby="s-text"
            stateLabels={{ on: "On", off: "Off" }}
          />
        }
        boxRef={boxRef}
        textId="s-text"
        text="Alerts"
        position="start"
        appearance="plain"
        locked={false}
      />,
    );
    await userEvent.click(screen.getByText("Off"));
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(document.querySelector("[data-slot=switch-row]")).not.toBeNull();
  });
});
