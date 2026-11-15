import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSwitchChange } from "./use-switch-change";

const toValue = (checked: boolean) => checked;

function deferred() {
  let resolve!: (value: boolean) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<boolean>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("useSwitchChange", () => {
  it("commits immediately without a guard", () => {
    const commit = vi.fn();
    const { result } = renderHook(() => useSwitchChange({ commit, toValue }));
    act(() => result.current.request(true));
    expect(commit).toHaveBeenCalledWith(true);
    expect(result.current.pending).toBe(false);
  });

  it("follows a synchronous guard", () => {
    const commit = vi.fn();
    const onBeforeChange = vi.fn((next: boolean) => next);
    const { result } = renderHook(() => useSwitchChange({ commit, toValue, onBeforeChange }));
    act(() => result.current.request(false));
    expect(commit).not.toHaveBeenCalled();
    act(() => result.current.request(true));
    expect(commit).toHaveBeenCalledWith(true);
  });

  it("waits for a promise, ignores requests meanwhile, and commits on true", async () => {
    const commit = vi.fn();
    const { promise, resolve } = deferred();
    const onBeforeChange = vi.fn(() => promise);
    const { result } = renderHook(() => useSwitchChange({ commit, toValue, onBeforeChange }));
    act(() => result.current.request(true));
    expect(result.current.pending).toBe(true);
    act(() => result.current.request(false));
    expect(onBeforeChange).toHaveBeenCalledTimes(1);
    await act(async () => resolve(true));
    expect(result.current.pending).toBe(false);
    expect(commit).toHaveBeenCalledWith(true);
  });

  it("keeps the state when the promise resolves false or rejects", async () => {
    const commit = vi.fn();
    const first = deferred();
    const second = deferred();
    const onBeforeChange = vi
      .fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const { result } = renderHook(() => useSwitchChange({ commit, toValue, onBeforeChange }));
    act(() => result.current.request(true));
    await act(async () => first.resolve(false));
    act(() => result.current.request(true));
    await act(async () => second.reject(new Error("offline")));
    expect(commit).not.toHaveBeenCalled();
    expect(result.current.pending).toBe(false);
  });

  it("does not commit after unmounting", async () => {
    const commit = vi.fn();
    const { promise, resolve } = deferred();
    const { result, unmount } = renderHook(() =>
      useSwitchChange({ commit, toValue, onBeforeChange: () => promise }),
    );
    act(() => result.current.request(true));
    unmount();
    await act(async () => resolve(true));
    expect(commit).not.toHaveBeenCalled();
  });
});
