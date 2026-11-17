import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { FileUploadContext, NewFileItem } from "../types";
import { useFileUploads } from "./use-file-uploads";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const item: NewFileItem = { kind: "new", id: "f1", file: new File(["x"], "contract.pdf") };

function setup() {
  const calls: { context: FileUploadContext; done: ReturnType<typeof deferred<string>> }[] = [];
  const upload = vi.fn((_file: File, context: FileUploadContext) => {
    const done = deferred<string>();
    calls.push({ context, done });
    return done.promise;
  });
  const replace = vi.fn();
  const remove = vi.fn();
  const onUploadError = vi.fn();
  const hook = renderHook(() => useFileUploads({ upload, replace, remove, onUploadError }));
  return { hook, calls, upload, replace, remove, onUploadError };
}

describe("useFileUploads", () => {
  it("tracks progress and replaces the item in place when it completes", async () => {
    const { hook, calls, replace } = setup();
    act(() => hook.result.current.start(item));
    expect(hook.result.current.states.get("f1")).toEqual({ status: "uploading", progress: 0 });
    act(() => calls[0]?.context.onProgress(50));
    expect(hook.result.current.states.get("f1")?.progress).toBe(50);
    await act(async () => calls[0]?.done.resolve("stored"));
    expect(replace).toHaveBeenCalledWith("f1", { kind: "existing", id: "f1", data: "stored" });
    expect(hook.result.current.states.has("f1")).toBe(false);
  });

  it("marks a failure, reports it, and retries", async () => {
    const { hook, calls, upload, onUploadError } = setup();
    act(() => hook.result.current.start(item));
    const error = new Error("network");
    await act(async () => calls[0]?.done.reject(error));
    expect(hook.result.current.states.get("f1")?.status).toBe("error");
    expect(onUploadError).toHaveBeenCalledWith(item.file, error);
    act(() => hook.result.current.retry(item));
    expect(upload).toHaveBeenCalledTimes(2);
    expect(hook.result.current.states.get("f1")?.status).toBe("uploading");
  });

  it("cancels: aborts the signal and removes the item, and a late result changes nothing", async () => {
    const { hook, calls, remove, replace } = setup();
    act(() => hook.result.current.start(item));
    act(() => hook.result.current.cancel("f1"));
    expect(calls[0]?.context.signal.aborted).toBe(true);
    expect(remove).toHaveBeenCalledWith("f1");
    await act(async () => calls[0]?.done.resolve("late"));
    expect(replace).not.toHaveBeenCalled();
  });

  it("aborts every pending upload on unmount", () => {
    const { hook, calls } = setup();
    act(() => hook.result.current.start(item));
    act(() => hook.result.current.start({ ...item, id: "f2" }));
    hook.unmount();
    expect(calls.every((call) => call.context.signal.aborted)).toBe(true);
  });
});
