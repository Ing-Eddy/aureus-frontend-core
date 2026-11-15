import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { ChoiceRow } from "./choice-row";

function renderRow(props: { description?: string; onBoxClick?: () => void } = {}) {
  const boxRef = createRef<HTMLButtonElement>();
  return render(
    <ChoiceRow
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

describe("ChoiceRow", () => {
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

  it("prefixes every part's data-slot with the slot", () => {
    const boxRef = createRef<HTMLButtonElement>();
    const { container } = render(
      <ChoiceRow
        slot="radio"
        box={
          // biome-ignore lint/a11y/useSemanticElements: mirrors the Radix radio, a button with role="radio".
          <button
            ref={boxRef}
            type="button"
            role="radio"
            aria-checked="false"
            aria-labelledby="r-text"
          />
        }
        boxRef={boxRef}
        textId="r-text"
        text="Pro"
        description="Unlimited projects"
        descriptionId="r-description"
        position="start"
        appearance="plain"
        locked={false}
      />,
    );
    const slots = [...container.querySelectorAll("[data-slot]")].map((node) =>
      node.getAttribute("data-slot"),
    );
    expect(slots).toEqual([
      "radio-row",
      "radio-box-slot",
      "radio-text",
      "radio-label",
      "radio-description",
    ]);
  });

  it("renders extra content under the text whose clicks do not toggle", async () => {
    const onBoxClick = vi.fn();
    const boxRef = createRef<HTMLButtonElement>();
    render(
      <ChoiceRow
        slot="radio"
        box={
          // biome-ignore lint/a11y/useSemanticElements: mirrors the Radix radio, a button with role="radio".
          <button
            ref={boxRef}
            type="button"
            role="radio"
            aria-checked="true"
            aria-labelledby="o-text"
            onClick={onBoxClick}
          />
        }
        boxRef={boxRef}
        textId="o-text"
        text="Other"
        after={<input aria-label="Other source" />}
        position="start"
        appearance="card"
        locked={false}
      />,
    );
    await userEvent.click(screen.getByRole("textbox", { name: "Other source" }));
    expect(onBoxClick).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText("Other"));
    expect(onBoxClick).toHaveBeenCalledTimes(1);
  });
});
