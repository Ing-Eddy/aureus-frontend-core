import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createContext, useContext, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toaster } from "../toast";
import { toast } from "../utils/helpers";
import { onlyToast, part, renderToaster, resetToasts, run, toastElements } from "./render-toaster";

afterEach(resetToasts);

const AppContext = createContext("outside");

function FromContext() {
  return <span>{useContext(AppContext)}</span>;
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      Count {count}
    </button>
  );
}

describe("content", () => {
  it("renders under the description and never starts a swipe", () => {
    renderToaster();
    run(() => toast.info("Title", { description: "Text", content: <span>Extra</span> }));
    const extra = part("toast-extra") as HTMLElement;
    expect(extra.textContent).toBe("Extra");
    expect(extra.hasAttribute("data-base-ui-swipe-ignore")).toBe(true);
    expect(part("toast-description")?.compareDocumentPosition(extra)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(part("toast-title")?.textContent).toBe("Title");
  });

  it("renders no slot without content", () => {
    renderToaster();
    run(() => toast.info("Title"));
    expect(part("toast-extra")).toBeNull();
  });

  it("gives a render function the context of its toast", async () => {
    renderToaster();
    run(() =>
      toast.info("Survey", {
        content: ({ id, dismiss }) => (
          <>
            <button type="button" onClick={() => toast.success("Thanks", { id })}>
              Send
            </button>
            <button type="button" onClick={dismiss}>
              Cancel
            </button>
          </>
        ),
      }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(toastElements().map((element) => element.textContent)).toEqual(["Thanks"]);
    expect(onlyToast().dataset.type).toBe("success");
  });

  it("dismisses through the context", async () => {
    renderToaster();
    run(() =>
      toast.info("Survey", {
        content: ({ dismiss }) => (
          <button type="button" onClick={dismiss}>
            Cancel
          </button>
        ),
      }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(toastElements()).toEqual([]);
  });

  it("keeps its own state while the toast changes", async () => {
    renderToaster();
    const id = run(() => toast.info("Title", { content: <Counter /> }));
    await userEvent.click(screen.getByRole("button", { name: "Count 0" }));
    run(() => toast.update(id, { title: "Renamed" }));
    expect(screen.getByRole("button", { name: "Count 1" })).toBeDefined();
  });

  it("does not trigger the click of a clickable toast", async () => {
    const onClick = vi.fn();
    renderToaster();
    run(() => toast.info("Title", { onClick, content: <span>Extra</span> }));
    await userEvent.click(screen.getByText("Extra"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("sees the React context around the Toaster", () => {
    render(
      <AppContext.Provider value="inside the app">
        <Toaster label="Notifications" />
      </AppContext.Provider>,
    );
    run(() => toast.info("Title", { content: <FromContext /> }));
    expect(screen.getByText("inside the app")).toBeDefined();
  });
});

describe("toast.custom", () => {
  it("renders only the given layout, named by aria-label", () => {
    renderToaster({ closeButton: true, closeLabel: "Close" });
    run(() => toast.custom(() => <span>Incoming call</span>, { "aria-label": "Call" }));
    const element = screen.getByRole("dialog", { name: "Call" });
    expect(element.textContent).toBe("Incoming call");
    expect(part("toast-title")).toBeNull();
    expect(part("toast-icon")).toBeNull();
    expect(part("toast-close")).toBeNull();
    expect(part("toast-custom")?.hasAttribute("data-base-ui-swipe-ignore")).toBe(true);
  });

  it("takes an appearance and classes", () => {
    renderToaster();
    run(() =>
      toast.custom(() => "x", { "aria-label": "a", appearance: "tinted", className: "mine" }),
    );
    expect(onlyToast().dataset.appearance).toBe("tinted");
    expect(onlyToast().classList.contains("mine")).toBe(true);
  });

  it("gives the render function the context", async () => {
    renderToaster();
    run(() =>
      toast.custom(
        ({ dismiss }) => (
          <button type="button" onClick={dismiss}>
            Reject
          </button>
        ),
        { "aria-label": "Call" },
      ),
    );
    await userEvent.click(screen.getByRole("button", { name: "Reject" }));
    expect(toastElements()).toEqual([]);
  });

  it("switches to the standard layout when it is replaced", () => {
    renderToaster();
    const id = run(() => toast.custom(() => "custom", { "aria-label": "Call" }));
    run(() => toast.success("Done", { id }));
    expect(onlyToast().textContent).toBe("Done");
    expect(onlyToast().getAttribute("aria-label")).toBeNull();
  });

  it("warns untyped code without aria-label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderToaster();
    run(() => toast.custom(() => "x", {} as { "aria-label": string }));
    expect(warn).toHaveBeenCalledWith("toast: `custom` needs `aria-label`.");
  });
});
