import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type FocusEvent, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  CalendarButton,
  FieldPopover,
  FieldPopoverAnchor,
  FieldPopoverContent,
  useFieldFocusLeave,
} from "./field-popover";
import { PresetsList } from "./presets-list";

function Harness({
  disabled,
  onLeave,
}: {
  disabled?: boolean;
  onLeave?: (event: FocusEvent<HTMLDivElement>) => void;
}) {
  const [open, setOpen] = useState(false);
  const focus = useFieldFocusLeave(onLeave);
  return (
    <>
      <span id="label">Reunión</span>
      <FieldPopover open={open} onOpenChange={setOpen}>
        <FieldPopoverAnchor asChild>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: a test frame that only listens to focus leaving. */}
          <div ref={focus.fieldRef} onBlur={focus.onBlur} data-testid="frame">
            <input aria-label="inner" />
            <CalendarButton label="Abrir calendario" disabled={disabled} />
          </div>
        </FieldPopoverAnchor>
        <FieldPopoverContent ref={focus.contentRef} aria-labelledby="label" onBlur={focus.onBlur}>
          <button type="button">día</button>
        </FieldPopoverContent>
      </FieldPopover>
      <button type="button">fuera</button>
    </>
  );
}

describe("FieldPopover", () => {
  it("opens a dialog named by the label from a named button", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const button = screen.getByRole("button", { name: "Abrir calendario" });
    expect(button.getAttribute("aria-haspopup")).toBe("dialog");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    await user.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("dialog", { name: "Reunión" })).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  it("cannot open while disabled", async () => {
    const user = userEvent.setup();
    render(<Harness disabled />);
    const button = screen.getByRole("button", { name: "Abrir calendario" }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    await user.click(button);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("calls onLeave only when focus leaves both the field and the popover", async () => {
    const user = userEvent.setup();
    const onLeave = vi.fn();
    render(<Harness onLeave={onLeave} />);
    await user.click(screen.getByRole("button", { name: "Abrir calendario" }));
    const day = screen.getByRole("button", { name: "día" });
    const frame = screen.getByTestId("frame");
    fireEvent.blur(screen.getByRole("textbox"), { relatedTarget: day });
    expect(onLeave).not.toHaveBeenCalled();
    fireEvent.blur(day, { relatedTarget: screen.getByRole("textbox") });
    expect(onLeave).not.toHaveBeenCalled();
    fireEvent.blur(day, { relatedTarget: screen.getByRole("button", { name: "fuera" }) });
    expect(onLeave).toHaveBeenCalledTimes(1);
    fireEvent.blur(frame, { relatedTarget: null });
    expect(onLeave).toHaveBeenCalledTimes(2);
  });
});

describe("PresetsList", () => {
  it("is a named group of toggle buttons", async () => {
    const user = userEvent.setup();
    const today = vi.fn();
    render(
      <PresetsList
        label="Atajos"
        items={[
          { key: "a", label: "Hoy", pressed: true, onSelect: today },
          { key: "b", label: "Mañana", pressed: false, onSelect: () => {} },
        ]}
      />,
    );
    expect(screen.getByRole("group", { name: "Atajos" })).toBeTruthy();
    const pressed = screen.getByRole("button", { name: "Hoy" });
    expect(pressed.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Mañana" }).getAttribute("aria-pressed")).toBe(
      "false",
    );
    await user.click(pressed);
    expect(today).toHaveBeenCalledTimes(1);
  });
});
