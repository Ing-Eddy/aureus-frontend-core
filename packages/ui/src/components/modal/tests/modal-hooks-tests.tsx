import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { type ModalContextValue, useModalDismiss, useModalFocus, useModalMode } from "../hooks";
import { dialogContentClassName, dialogSizeClassNames, drawerContentClassName } from "../utils";
import { mockViewport, NARROW, WIDE } from "./render-modal";

afterEach(() => vi.unstubAllGlobals());

function fakeContext(overrides: Partial<ModalContextValue> = {}): ModalContextValue {
  return {
    open: true,
    openRef: { current: true },
    setOpen: vi.fn(),
    mode: "dialog",
    contentId: "panel",
    triggerRef: { current: null },
    previouslyFocusedRef: { current: null },
    reasonRef: { current: null },
    reportComplete: vi.fn(),
    closeOnEscape: true,
    closeOnOutsidePress: true,
    closeOnSwipe: true,
    modal: true,
    drawer: {
      direction: "bottom",
      handleOnly: false,
      scaleBackground: false,
      repositionInputs: true,
    },
    ...overrides,
  };
}

const keyEvent = () => new KeyboardEvent("keydown", { key: "Escape", cancelable: true });
const outsideEvent = (
  target: EventTarget = document.body,
  type = "dismissableLayer.pointerDownOutside",
) => {
  const event = new CustomEvent(type, { cancelable: true, detail: {} });
  Object.defineProperty(event, "target", { value: target });
  return event as never;
};

describe("useModalDismiss", () => {
  it("records the reason the primitive reports, then clears it", () => {
    const context = fakeContext();
    const { result } = renderHook(() => useModalDismiss(context, {}));
    result.current.onEscapeKeyDown(keyEvent());
    expect(context.reasonRef.current).toBe("escape-key");

    result.current.onPrimitiveOpenChange(false);
    expect(context.setOpen).toHaveBeenCalledWith(false, "escape-key");
    expect(context.reasonRef.current).toBeNull();
  });

  it("reports an unrecorded drawer close as a swipe", () => {
    const context = fakeContext({ mode: "drawer" });
    const { result } = renderHook(() => useModalDismiss(context, {}));
    result.current.onPrimitiveOpenChange(false);
    expect(context.setOpen).toHaveBeenCalledWith(false, "swipe");
  });

  it("each closeOn flag blocks only its own path", () => {
    const context = fakeContext({ closeOnEscape: false });
    const { result } = renderHook(() => useModalDismiss(context, {}));
    const escapeEvent = keyEvent();
    result.current.onEscapeKeyDown(escapeEvent);
    expect(escapeEvent.defaultPrevented).toBe(true);

    const outside = outsideEvent();
    result.current.onPointerDownOutside(outside);
    expect((outside as Event).defaultPrevented).toBe(false);
    expect(context.reasonRef.current).toBe("outside-press");
  });

  it("closes the drawer itself when Vaul ignores close requests", () => {
    const context = fakeContext({ mode: "drawer", closeOnSwipe: false });
    const { result } = renderHook(() => useModalDismiss(context, {}));
    const escapeEvent = keyEvent();
    result.current.onEscapeKeyDown(escapeEvent);
    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(context.setOpen).toHaveBeenCalledWith(false, "escape-key");

    result.current.onPointerDownOutside(outsideEvent());
    expect(context.setOpen).toHaveBeenCalledWith(false, "outside-press");
  });

  it("closes a non-modal drawer itself on an outside press", () => {
    const context = fakeContext({ mode: "drawer", modal: false });
    const { result } = renderHook(() => useModalDismiss(context, {}));
    result.current.onPointerDownOutside(outsideEvent());
    expect(context.setOpen).toHaveBeenCalledWith(false, "outside-press");
  });

  it("the consumer's preventDefault wins, and presses on the trigger are ignored", () => {
    const trigger = document.createElement("button");
    const context = fakeContext({ triggerRef: { current: trigger } });
    const onInteractOutside = vi.fn((event: Event) => event.preventDefault());
    const { result } = renderHook(() => useModalDismiss(context, { onInteractOutside }));
    result.current.onPointerDownOutside(outsideEvent());
    expect(context.reasonRef.current).toBeNull();

    const plain = renderHook(() => useModalDismiss(context, {})).result.current;
    const onTrigger = outsideEvent(trigger);
    plain.onPointerDownOutside(onTrigger);
    expect((onTrigger as Event).defaultPrevented).toBe(true);
    expect(context.reasonRef.current).toBeNull();
  });

  it("handles focus outside only from onInteractOutside", () => {
    const context = fakeContext();
    const onInteractOutside = vi.fn();
    const { result } = renderHook(() => useModalDismiss(context, { onInteractOutside }));
    result.current.onInteractOutside(outsideEvent());
    expect(onInteractOutside).not.toHaveBeenCalled();

    result.current.onInteractOutside(outsideEvent(document.body, "dismissableLayer.focusOutside"));
    expect(onInteractOutside).toHaveBeenCalledOnce();
  });
});

describe("useModalFocus", () => {
  it("focuses returnFocusRef, then the trigger, then the previous element", () => {
    const button = () => {
      const element = document.createElement("button");
      document.body.append(element);
      return element;
    };
    const [first, second, third] = [button(), button(), button()];
    const context = fakeContext({
      open: false,
      openRef: { current: false },
      triggerRef: { current: second },
      previouslyFocusedRef: { current: third },
    });
    const close = (returnTo?: HTMLElement) =>
      renderHook(() =>
        useModalFocus(context, { returnFocusRef: { current: returnTo ?? null } }),
      ).result.current.onCloseAutoFocus(new Event("close", { cancelable: true }));

    close(first);
    expect(document.activeElement).toBe(first);
    close();
    expect(document.activeElement).toBe(second);
    second.remove();
    close();
    expect(document.activeElement).toBe(third);
  });

  it("leaves focus alone when the panel unmounts only because the mode changed", () => {
    const button = document.createElement("button");
    document.body.append(button);
    const context = fakeContext({ triggerRef: { current: button } });
    const onCloseAutoFocus = vi.fn();
    const { result } = renderHook(() => useModalFocus(context, { onCloseAutoFocus }));
    const event = new Event("close", { cancelable: true });
    result.current.onCloseAutoFocus(event);

    expect(event.defaultPrevented).toBe(true);
    expect(onCloseAutoFocus).not.toHaveBeenCalled();
    expect(document.activeElement).not.toBe(button);
  });

  it("focuses initialFocusRef unless the consumer prevents it", () => {
    const input = document.createElement("input");
    document.body.append(input);
    const context = fakeContext();
    const { result } = renderHook(() =>
      useModalFocus(context, { initialFocusRef: { current: input } }),
    );
    const event = new Event("open", { cancelable: true });
    result.current.onOpenAutoFocus(event);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(input);
  });
});

describe("useModalMode", () => {
  it("resolves the responsive mode and reports changes once", () => {
    const viewport = mockViewport(WIDE);
    const onModeChange = vi.fn();
    const { result } = renderHook(() =>
      useModalMode({
        mode: "responsive",
        breakpoint: 768,
        lockModeWhileOpen: false,
        open: false,
        onModeChange,
      }),
    );
    expect(result.current).toBe("dialog");
    viewport.resize(NARROW);
    expect(result.current).toBe("drawer");
    expect(onModeChange).toHaveBeenCalledExactlyOnceWith("drawer");
  });
});

describe("modal classes", () => {
  it("keep shadcn's main tokens", () => {
    for (const token of ["bg-popover", "rounded-xl", "text-popover-foreground"]) {
      expect(dialogContentClassName).toContain(token);
    }
    for (const token of ["bg-popover", "data-[vaul-drawer-direction=bottom]:rounded-t-xl"]) {
      expect(drawerContentClassName).toContain(token);
    }
  });

  it("size only adds dialog width or height classes", () => {
    for (const classes of Object.values(dialogSizeClassNames)) {
      for (const name of classes.split(" ")) expect(name).toMatch(/max-w|h-\[/);
    }
  });
});
