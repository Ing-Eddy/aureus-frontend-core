import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { CheckboxGroupField } from "../checkbox-group-field";
import { box, channels, renderField } from "./helpers";

describe("CheckboxGroupField states", () => {
  it("disables every box while loading, with a spinner and aria-busy", async () => {
    const onValueChange = vi.fn();
    renderField(
      <CheckboxGroupField
        loadingLabel="Loading"
        label="Channels"
        options={channels}
        loading
        onValueChange={onValueChange}
      />,
    );
    for (const checkbox of screen.getAllByRole("checkbox")) {
      expect((checkbox as HTMLButtonElement).disabled).toBe(true);
    }
    await userEvent.click(box("SMS"));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("group", { name: "Channels" }).getAttribute("aria-busy")).toBe("true");
    expect(screen.getByLabelText("Loading")).toBeTruthy();
  });

  it("disables every box while disabled", () => {
    renderField(<CheckboxGroupField label="Channels" options={channels} disabled />);
    expect(
      screen.getAllByRole("checkbox").every((checkbox) => (checkbox as HTMLButtonElement).disabled),
    ).toBe(true);
    expect(screen.getByRole("group", { name: "Channels" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("fires onBlur only when focus leaves the group", async () => {
    const onBlur = vi.fn();
    renderField(
      <>
        <CheckboxGroupField label="Channels" options={channels} onBlur={onBlur} />
        <button type="button">After</button>
      </>,
    );
    await userEvent.tab();
    await userEvent.tab();
    expect(onBlur).not.toHaveBeenCalled();
    await userEvent.tab();
    await userEvent.tab();
    expect(document.activeElement?.textContent).toBe("After");
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("forwards the ref to the group container", () => {
    const ref = createRef<HTMLDivElement>();
    renderField(<CheckboxGroupField label="Channels" options={channels} ref={ref} />);
    expect(ref.current?.getAttribute("data-slot")).toBe("checkbox-group");
  });
});
