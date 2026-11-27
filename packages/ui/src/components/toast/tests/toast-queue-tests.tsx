import { cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { toast } from "../utils/helpers";
import { connectToaster } from "../utils/libs";
import { renderToastProbe } from "./render-toast-probe";

afterEach(() => {
  cleanup();
  toast.dismiss();
  vi.restoreAllMocks();
});

describe("calls made before a Toaster is mounted", () => {
  it("are delivered in order when it mounts", () => {
    const first = toast.info("a");
    toast.info("b");
    toast.update(first, { title: "a2" });
    const probe = renderToastProbe();
    expect(probe.open().map((entry) => entry.title)).toEqual(["b", "a2"]);
  });

  it("are dropped for a toast dismissed before it mounts", () => {
    const first = toast.info("a");
    toast.info("b");
    toast.dismiss(first);
    const probe = renderToastProbe();
    expect(probe.open().map((entry) => entry.title)).toEqual(["b"]);
  });

  it("are all dropped by dismiss without an id", () => {
    toast.info("a");
    toast.dismiss();
    const probe = renderToastProbe();
    expect(probe.open()).toEqual([]);
  });

  it("are not delivered twice", () => {
    toast.info("a");
    const first = renderToastProbe();
    first.unmount();
    const second = renderToastProbe();
    expect(second.open()).toEqual([]);
  });
});

describe("connected Toasters", () => {
  it("warns when a second one connects", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const disconnectFirst = connectToaster();
    expect(warn).not.toHaveBeenCalled();
    const disconnectSecond = connectToaster();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("more than one `Toaster`"));
    disconnectSecond();
    disconnectFirst();
  });
});
