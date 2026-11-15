import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { SelectField } from "../select-field";
import { countries, openList, trigger } from "./helpers";

describe("SelectField states", () => {
  it("does not open while loading or disabled", async () => {
    const { unmount } = render(<SelectField label="País" options={countries} loading />);
    await openList();
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    unmount();
    render(<SelectField label="País" options={countries} disabled />);
    await userEvent.click(trigger());
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });

  it("forwards the ref to the button and submits by name", () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(
      <SelectField label="País" options={countries} ref={ref} name="country" defaultValue="mx" />,
    );
    expect(ref.current).toBe(trigger());
    const hidden = container.querySelector('input[name="country"]') as HTMLInputElement;
    expect(hidden.value).toBe("mx");
  });
});
