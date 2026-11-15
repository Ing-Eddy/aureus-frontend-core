import { describe, expect, it } from "vitest";
import { CheckboxGroupField } from "../checkbox-group-field";
import { channels, renderField } from "./helpers";

const options = (container: HTMLElement) =>
  container.querySelector("[data-slot=checkbox-group-options]") as HTMLElement;

describe("CheckboxGroupField layout", () => {
  it("stacks the options by default", () => {
    const { container } = renderField(<CheckboxGroupField label="Channels" options={channels} />);
    expect(options(container).getAttribute("data-orientation")).toBe("vertical");
    expect(options(container).className).toContain("flex-col");
  });

  it("places them inline and wrapping with orientation='horizontal'", () => {
    const { container } = renderField(
      <CheckboxGroupField label="Channels" options={channels} orientation="horizontal" />,
    );
    expect(options(container).getAttribute("data-orientation")).toBe("horizontal");
    expect(options(container).className).toContain("flex-wrap");
  });

  it("uses a container-query grid with columns", () => {
    const { container } = renderField(
      <CheckboxGroupField label="Days" options={channels} columns={3} />,
    );
    expect(options(container).getAttribute("data-columns")).toBe("3");
    expect(options(container).className).toContain("@lg:grid-cols-3");
    expect(container.querySelector("[data-slot=checkbox-group]")?.className).toContain(
      "@container",
    );
  });

  it("indents the options under select all only in a plain vertical list", () => {
    const { container } = renderField(
      <>
        <CheckboxGroupField label="A" options={channels} selectAll={{ label: "All" }} />
        <CheckboxGroupField
          label="B"
          options={channels}
          selectAll={{ label: "All" }}
          appearance="card"
        />
        <CheckboxGroupField label="C" options={channels} />
      </>,
    );
    const groups = [...container.querySelectorAll("[data-slot=checkbox-group-options]")];
    expect(groups.map((group) => group.className.includes("ps-6"))).toEqual([true, false, false]);
  });
});
