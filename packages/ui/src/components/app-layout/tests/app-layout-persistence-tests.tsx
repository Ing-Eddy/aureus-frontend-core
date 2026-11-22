import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppLayout, AppLayoutInset, AppLayoutMain, AppLayoutSidebar, useAppLayoutMain } from "..";
import { mockViewport, renderAppLayout, WIDE } from "./render-app-layout";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("Persistence", () => {
  it("State survives a reload", async () => {
    mockViewport(WIDE);
    const first = renderAppLayout({ layout: { persistKey: "app.sidebar" } });
    await first.user.click(first.trigger());
    first.unmount();
    // Move the side through storage-backed state on the next mount.
    const stored = JSON.parse(localStorage.getItem("app.sidebar") ?? "{}");
    expect(stored).toEqual({ open: false, side: "start" });
    localStorage.setItem("app.sidebar", JSON.stringify({ ...stored, side: "end" }));
    const onOpenChange = vi.fn();
    const onSideChange = vi.fn();
    const second = renderAppLayout({
      layout: { persistKey: "app.sidebar", onOpenChange, onSideChange },
    });
    expect(second.sidebar()?.getAttribute("data-state")).toBe("collapsed");
    expect(second.sidebar()?.getAttribute("data-side")).toBe("end");
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(onSideChange).not.toHaveBeenCalled();
  });

  it("controlled values ignore the stored state", () => {
    mockViewport(WIDE);
    localStorage.setItem("k", JSON.stringify({ open: false, side: "end" }));
    const view = renderAppLayout({ layout: { persistKey: "k", open: true, side: "start" } });
    expect(view.sidebar()?.getAttribute("data-state")).toBe("expanded");
    expect(view.sidebar()?.getAttribute("data-side")).toBe("start");
  });

  it("No storage by default", async () => {
    mockViewport(WIDE);
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const cookie = document.cookie;
    const view = renderAppLayout();
    await view.user.click(view.trigger());
    expect(setItem).not.toHaveBeenCalled();
    expect(document.cookie).toBe(cookie);
  });

  it("broken storage does not break rendering", () => {
    mockViewport(WIDE);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const view = renderAppLayout({ layout: { persistKey: "k" } });
    expect(view.sidebar()?.getAttribute("data-state")).toBe("expanded");
  });
});

describe("Keyboard shortcut", () => {
  it("toggles with Ctrl and Cmd", () => {
    mockViewport(WIDE);
    const view = renderAppLayout({ layout: { keyboardShortcut: "b" } });
    fireEvent.keyDown(window, { key: "b", ctrlKey: true });
    expect(view.sidebar()?.getAttribute("data-state")).toBe("collapsed");
    fireEvent.keyDown(window, { key: "B", metaKey: true });
    expect(view.sidebar()?.getAttribute("data-state")).toBe("expanded");
    fireEvent.keyDown(window, { key: "b" });
    expect(view.sidebar()?.getAttribute("data-state")).toBe("expanded");
  });

  it("Shortcut ignored while typing", () => {
    mockViewport(WIDE);
    const view = renderAppLayout({
      layout: { keyboardShortcut: "b" },
      children: (
        <>
          <input aria-label="Name" />
          <textarea aria-label="Notes" />
          <div contentEditable data-testid="rich" suppressContentEditableWarning />
        </>
      ),
    });
    for (const name of ["Name", "Notes"]) {
      fireEvent.keyDown(screen.getByRole("textbox", { name }), { key: "b", ctrlKey: true });
    }
    fireEvent.keyDown(screen.getByTestId("rich"), { key: "b", ctrlKey: true });
    expect(view.sidebar()?.getAttribute("data-state")).toBe("expanded");
  });

  it("binds no key by default", () => {
    mockViewport(WIDE);
    const add = vi.spyOn(window, "addEventListener");
    const view = renderAppLayout();
    expect(add.mock.calls.some(([type]) => type === "keydown")).toBe(false);
    fireEvent.keyDown(window, { key: "b", ctrlKey: true });
    expect(view.sidebar()?.getAttribute("data-state")).toBe("expanded");
  });
});

function MainProbe({ onValue }: { onValue: (value: ReturnType<typeof useAppLayoutMain>) => void }) {
  onValue(useAppLayoutMain());
  return null;
}

describe("Main area helpers", () => {
  it("Route change", () => {
    mockViewport(WIDE);
    const page = (key: string) => (
      <AppLayout>
        <AppLayoutSidebar mobileTitle="Nav" />
        <AppLayoutInset>
          <AppLayoutMain scrollResetKey={key}>Page</AppLayoutMain>
        </AppLayoutInset>
      </AppLayout>
    );
    const view = render(page("/a"));
    const main = screen.getByRole("main");
    main.scrollTop = 400;
    view.rerender(page("/a"));
    expect(main.scrollTop).toBe(400);
    view.rerender(page("/b"));
    expect(main.scrollTop).toBe(0);
  });

  it("useAppLayoutMain scrolls to the top", () => {
    mockViewport(WIDE);
    let result: ReturnType<typeof useAppLayoutMain> | undefined;
    const view = renderAppLayout({ children: <MainProbe onValue={(value) => (result = value)} /> });
    expect(result?.scrollRef.current).toBe(view.main());
    view.main().scrollTop = 250;
    result?.scrollToTop();
    expect(view.main().scrollTop).toBe(0);
  });

  it("maxWidth keeps the padding", () => {
    mockViewport(WIDE);
    render(
      <AppLayout>
        <AppLayoutInset>
          <AppLayoutMain maxWidth="4xl" contentClassName="extra">
            <span data-testid="child" />
          </AppLayoutMain>
        </AppLayoutInset>
      </AppLayout>,
    );
    const box = screen.getByTestId("child").parentElement;
    expect(box?.className).toContain("max-w-4xl");
    expect(box?.className).toContain("p-4");
    expect(box?.className).toContain("extra");
  });
});
