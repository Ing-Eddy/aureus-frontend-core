import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { CheckboxRow } from "./checkbox-row";

function renderRow(props: { description?: string; onBoxClick?: () => void } = {}) {
  const boxRef = createRef<HTMLButtonElement>();
  return render(
    <CheckboxRow
      box={
        // biome-ignore lint/a11y/useSemanticElements: mirrors the Radix box, a button with role="checkbox".
        <button
          ref={boxRef}
          type="button"
          role="checkbox"
          aria-checked="false"
          aria-labelledby="row-text"
          aria-describedby={props.description ? "row-description" : undefined}
          onClick={props.onBoxClick}
        />
      }
      boxRef={boxRef}
      textId="row-text"
      text="Email"
      description={props.description}
      descriptionId="row-description"
      position="start"
      appearance="plain"
      locked={false}
    />,
  );
}

describe("CheckboxRow", () => {
  it("renders a description under the text, describing the box", () => {
    renderRow({ description: "Daily digest" });
    const box = screen.getByRole("checkbox", { name: "Email" });
    expect(box.getAttribute("aria-describedby")).toBe("row-description");
    expect(screen.getByText("Daily digest").getAttribute("data-slot")).toBe("checkbox-description");
    expect(screen.getByText("Daily digest").parentElement?.getAttribute("data-slot")).toBe(
      "checkbox-text",
    );
  });

  it("forwards clicks on the description to the box", async () => {
    const onBoxClick = vi.fn();
    renderRow({ description: "Daily digest", onBoxClick });
    await userEvent.click(screen.getByText("Daily digest"));
    expect(onBoxClick).toHaveBeenCalledTimes(1);
  });

  it("keeps the single-text markup without a description", () => {
    const { container } = renderRow();
    expect(container.querySelector("[data-slot=checkbox-text]")).toBeNull();
    expect(container.querySelector("[data-slot=checkbox-label]")?.textContent).toBe("Email");
  });
});
