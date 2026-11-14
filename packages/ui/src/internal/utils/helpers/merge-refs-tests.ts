import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { mergeRefs } from "./merge-refs";

describe("mergeRefs", () => {
  it("assigns the node to callback and object refs", () => {
    const callback = vi.fn();
    const object = createRef<HTMLInputElement>();
    const node = document.createElement("input");

    mergeRefs(callback, object)(node);

    expect(callback).toHaveBeenCalledWith(node);
    expect(object.current).toBe(node);
  });

  it("ignores null and undefined refs", () => {
    const object = createRef<HTMLInputElement>();
    const node = document.createElement("input");

    expect(() => mergeRefs<HTMLInputElement>(null, undefined, object)(node)).not.toThrow();
    expect(object.current).toBe(node);
  });

  it("forwards null on detach", () => {
    const callback = vi.fn();
    const object = createRef<HTMLInputElement>();
    const merged = mergeRefs(callback, object);

    merged(document.createElement("input"));
    merged(null);

    expect(callback).toHaveBeenLastCalledWith(null);
    expect(object.current).toBeNull();
  });
});
