import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest runs without globals, so Testing Library cannot register its automatic cleanup.
afterEach(cleanup);

// jsdom has no ResizeObserver; Radix's popper (tooltip content) needs one.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// jsdom has no layout; `input-otp` calls elementFromPoint to detect password-manager badges.
if (typeof document !== "undefined" && typeof document.elementFromPoint !== "function") {
  document.elementFromPoint = () => null;
}

// jsdom has no object URLs; file fields create them for image previews. Tests spy on these.
if (typeof URL.createObjectURL !== "function") {
  let next = 0;
  URL.createObjectURL = () => {
    next += 1;
    return `blob:test/${next}`;
  };
}
if (typeof URL.revokeObjectURL !== "function") {
  URL.revokeObjectURL = () => {};
}

// jsdom has no pointer capture or scrollIntoView; Radix menus (dropdown, select) call them.
if (typeof Element !== "undefined") {
  for (const method of [
    "hasPointerCapture",
    "releasePointerCapture",
    "setPointerCapture",
  ] as const) {
    if (typeof Element.prototype[method] !== "function") {
      Object.defineProperty(Element.prototype, method, {
        configurable: true,
        writable: true,
        value: method === "hasPointerCapture" ? () => false : () => {},
      });
    }
  }
  if (typeof Element.prototype.scrollIntoView !== "function") {
    Element.prototype.scrollIntoView = () => {};
  }
}
