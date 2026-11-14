import { describe, expect, it } from "vitest";
import { resolveActionSize } from "./resolve-action-size";

describe("resolveActionSize", () => {
  it("uses xs for text", () => {
    expect(resolveActionSize("Copy")).toBe("xs");
  });

  it("uses icon-xs for a single element", () => {
    expect(resolveActionSize(<svg />)).toBe("icon-xs");
  });

  it("uses xs for mixed content", () => {
    expect(resolveActionSize(["Copy", <svg key="icon" />])).toBe("xs");
  });

  it("keeps an explicit size", () => {
    expect(resolveActionSize(<svg />, "sm")).toBe("sm");
    expect(resolveActionSize("Copy", "icon-sm")).toBe("icon-sm");
  });
});
