import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TextAreaField } from "../text-area-field";

// jsdom has no layout: model a textarea with 20px lines and 8px vertical padding.
const LINE = 20;
const PADDING = 16;
const linesToPx = (lines: number) => lines * LINE + PADDING;

let resizeCallback: ResizeObserverCallback | undefined;
const realGetComputedStyle = window.getComputedStyle;

beforeEach(() => {
  vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
    if (!(element instanceof HTMLTextAreaElement)) return realGetComputedStyle(element, pseudo);
    return {
      fontSize: "16px",
      lineHeight: `${LINE}px`,
      paddingTop: "8px",
      paddingBottom: "8px",
      borderTopWidth: "0px",
      borderBottomWidth: "0px",
    } as CSSStyleDeclaration;
  });
  Object.defineProperty(HTMLTextAreaElement.prototype, "scrollHeight", {
    configurable: true,
    get(this: HTMLTextAreaElement) {
      return linesToPx(this.value === "" ? 1 : this.value.split("\n").length);
    },
  });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  // Restore jsdom's own (absent) property.
  Reflect.deleteProperty(HTMLTextAreaElement.prototype, "scrollHeight");
  resizeCallback = undefined;
});

const textarea = (container: HTMLElement) =>
  container.querySelector("textarea") as HTMLTextAreaElement;
const type = (element: HTMLTextAreaElement, text: string) =>
  fireEvent.input(element, { target: { value: text } });
const lines = (count: number) => Array.from({ length: count }, (_, i) => `line ${i}`).join("\n");

describe("TextAreaField sizing", () => {
  it("bounds the height with minRows and maxRows", () => {
    const { container } = render(<TextAreaField label="Notes" minRows={3} maxRows={5} />);
    const field = textarea(container);
    expect(field.style.minHeight).toBe(`${linesToPx(3)}px`);
    expect(field.style.maxHeight).toBe(`${linesToPx(5)}px`);
    expect(field.style.height).toBe(`${linesToPx(3)}px`);
  });

  it("grows with the content and caps at maxRows with a scrollbar", () => {
    const { container } = render(<TextAreaField label="Notes" minRows={3} maxRows={5} />);
    const field = textarea(container);

    type(field, lines(4));
    expect(field.style.height).toBe(`${linesToPx(4)}px`);
    expect(field.style.overflowY).toBe("hidden");

    type(field, lines(9));
    expect(field.style.height).toBe(`${linesToPx(5)}px`);
    expect(field.style.overflowY).toBe("auto");

    type(field, "short");
    expect(field.style.height).toBe(`${linesToPx(3)}px`);
  });

  it("grows without limit when maxRows is Infinity", () => {
    const { container } = render(<TextAreaField label="Notes" maxRows={Infinity} />);
    const field = textarea(container);
    type(field, lines(30));
    expect(field.style.height).toBe(`${linesToPx(30)}px`);
    expect(field.style.maxHeight).toBe("");
  });

  it("keeps a height the user dragged to as the new minimum", () => {
    const { container } = render(<TextAreaField label="Notes" minRows={3} maxRows={10} />);
    const field = textarea(container);
    Object.defineProperty(field, "offsetWidth", { configurable: true, value: 0 });
    Object.defineProperty(field, "offsetHeight", { configurable: true, value: linesToPx(6) });

    resizeCallback?.([], {} as ResizeObserver);
    type(field, "one line");

    expect(field.style.height).toBe(`${linesToPx(6)}px`);
  });

  it("re-measures when the width changes", () => {
    const { container } = render(<TextAreaField label="Notes" minRows={3} maxRows={10} />);
    const field = textarea(container);
    field.value = lines(5);
    Object.defineProperty(field, "offsetWidth", { configurable: true, value: 300 });

    resizeCallback?.([], {} as ResizeObserver);

    expect(field.style.height).toBe(`${linesToPx(5)}px`);
  });

  it("follows a controlled value", () => {
    const { container, rerender } = render(
      <TextAreaField label="Notes" value="" onChange={() => {}} />,
    );
    rerender(<TextAreaField label="Notes" value={lines(4)} onChange={() => {}} />);
    expect(textarea(container).style.height).toBe(`${linesToPx(4)}px`);
  });

  it("is resizable by default and fixed with resize={false}", () => {
    const { container, rerender } = render(<TextAreaField label="Notes" />);
    expect(textarea(container).className).toContain("resize-y");
    expect(textarea(container).className).toContain("field-sizing-fixed");
    rerender(<TextAreaField label="Notes" resize={false} />);
    expect(textarea(container).className).toContain("resize-none");
    expect(textarea(container).className).not.toContain("resize-y");
  });
});
