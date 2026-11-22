import { afterEach, describe, expect, it, vi } from "vitest";
import { resetWarnings, warnOnce } from "../warn-once";

afterEach(() => {
  resetWarnings();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("warnOnce", () => {
  it("logs once per key", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    warnOnce("a", "[useX] first.");
    warnOnce("a", "[useX] first.");
    warnOnce("b", "[useX] second.");
    expect(warn.mock.calls).toEqual([["[useX] first."], ["[useX] second."]]);
  });

  it("logs again after resetWarnings", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    warnOnce("a", "x");
    resetWarnings();
    warnOnce("a", "x");
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("logs nothing in production builds", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.resetModules();
    const { warnOnce: productionWarnOnce } = await import("../warn-once");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    productionWarnOnce("a", "x");
    expect(warn).not.toHaveBeenCalled();
  });
});
