import { act, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { toast } from "../utils/helpers";
import { renderToastProbe } from "./render-toast-probe";

afterEach(() => {
  cleanup();
  toast.dismiss();
  vi.restoreAllMocks();
});

describe("toast API", () => {
  it.each(["neutral", "success", "info", "warning", "danger", "loading"] as const)(
    "%s adds a toast of that status and returns its id",
    (status) => {
      const probe = renderToastProbe();
      const id = probe.run(() => toast[status]("Title", { description: "Text" }));
      expect(probe.open()).toMatchObject([
        { id, type: status, title: "Title", description: "Text", priority: "low" },
      ]);
    },
  );

  it("maps durations: omitted, milliseconds and Infinity", () => {
    const probe = renderToastProbe();
    probe.run(() => toast.info("a"));
    probe.run(() => toast.info("b", { duration: 1000 }));
    probe.run(() => toast.info("c", { duration: Number.POSITIVE_INFINITY }));
    expect(probe.open().map((entry) => entry.timeout)).toEqual([0, 1000, undefined]);
  });

  it("warns about a duration that is not positive and uses the Toaster's", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const probe = renderToastProbe();
    probe.run(() => toast.info("a", { duration: 0 }));
    expect(probe.open()[0]?.timeout).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("toast: `duration`"));
  });

  it("replaces a toast with the same id, keeping nothing from it", () => {
    const probe = renderToastProbe();
    probe.run(() =>
      toast.info("Old", {
        id: "same",
        description: "Old text",
        duration: Number.POSITIVE_INFINITY,
        priority: "high",
        keepOpenOnClick: true,
      }),
    );
    probe.run(() => toast.success("New", { id: "same" }));
    expect(probe.open()).toHaveLength(1);
    const [replaced] = probe.open();
    expect(replaced).toMatchObject({ type: "success", title: "New", priority: "low" });
    expect(replaced?.description).toBeUndefined();
    expect(replaced?.timeout).toBeUndefined();
    expect(replaced?.data?.keepOpenOnClick).toBeUndefined();
  });

  it("update merges the patch into the toast", () => {
    const probe = renderToastProbe();
    const id = probe.run(() =>
      toast.loading("Saving", { description: "Text", appearance: "tinted" }),
    );
    probe.run(() => toast.update(id, { status: "success", title: "Saved", keepOpenOnClick: true }));
    expect(probe.open()).toMatchObject([
      {
        type: "success",
        title: "Saved",
        description: "Text",
        data: { appearance: "tinted", keepOpenOnClick: true },
      },
    ]);
    probe.run(() => toast.update(id, { description: undefined, duration: 2000 }));
    expect(probe.open()[0]?.description).toBeUndefined();
    expect(probe.open()[0]).toMatchObject({ title: "Saved", timeout: 2000 });
    expect(probe.open()[0]?.data?.duration).toBe(2000);
  });

  it("custom is persistent unless it sets a duration", () => {
    const probe = renderToastProbe();
    probe.run(() => toast.custom(() => null, { "aria-label": "Call" }));
    expect(probe.open()[0]).toMatchObject({ timeout: 0, data: { ariaLabel: "Call" } });
    probe.run(() => toast.custom(() => null, { "aria-label": "Brief", duration: 500 }));
    expect(probe.open()[0]).toMatchObject({ timeout: 500 });
  });

  it("a status or title patch turns a custom toast into a standard one", () => {
    const probe = renderToastProbe();
    const id = probe.run(() => toast.custom(() => null, { "aria-label": "Call" }));
    probe.run(() => toast.update(id, { className: "x" }));
    expect(probe.open()[0]?.data?.render).toBeTypeOf("function");
    probe.run(() => toast.update(id, { status: "success", title: "Done" }));
    expect(probe.open()[0]?.data?.render).toBeUndefined();
    expect(probe.open()[0]?.data?.ariaLabel).toBeUndefined();
  });

  it("dismiss closes one toast, or all of them without an id", () => {
    const probe = renderToastProbe();
    const first = probe.run(() => toast.info("a"));
    probe.run(() => toast.info("b"));
    probe.run(() => toast.info("c"));
    probe.run(() => toast.dismiss(first));
    expect(probe.open().map((entry) => entry.title)).toEqual(["c", "b"]);
    probe.run(() => toast.dismiss());
    expect(probe.open()).toEqual([]);
  });
});

describe("toast.promise", () => {
  it("turns the loading toast into the success one", async () => {
    const probe = renderToastProbe();
    let resolve!: (value: string) => void;
    const promise = new Promise<string>((done) => {
      resolve = done;
    });
    const id = probe.run(() =>
      toast.promise(promise, {
        loading: { title: "Saving", description: "Wait" },
        success: (number) => ({ title: "Saved", description: number }),
        danger: "Failed",
      }),
    );
    expect(probe.open()).toMatchObject([{ id, type: "loading", title: "Saving" }]);
    await act(async () => resolve("F-1"));
    expect(probe.open()).toMatchObject([
      { id, type: "success", title: "Saved", description: "F-1" },
    ]);
  });

  it("turns it into a danger toast on rejection, without rejecting itself", async () => {
    const probe = renderToastProbe();
    let reject!: (error: Error) => void;
    const promise = new Promise<string>((_, fail) => {
      reject = fail;
    });
    const id = probe.run(() =>
      toast.promise(promise, {
        loading: { title: "Saving", description: "Wait" },
        success: "Saved",
        danger: (error) => (error as Error).message,
      }),
    );
    await act(async () => reject(new Error("No network")));
    expect(probe.open()).toMatchObject([{ id, type: "danger", title: "No network" }]);
    expect(probe.open()[0]?.description).toBeUndefined();
  });

  it("takes a React element as a title", () => {
    const probe = renderToastProbe();
    const title = <strong>Saving</strong>;
    probe.run(() =>
      toast.promise(new Promise(() => {}), { loading: title, success: "a", danger: "b" }),
    );
    expect(probe.open()[0]?.title).toBe(title);
  });
});
