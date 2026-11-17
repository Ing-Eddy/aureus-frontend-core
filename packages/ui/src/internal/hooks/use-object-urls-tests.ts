import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { FileItem } from "../types";
import { useObjectUrls } from "./use-object-urls";

afterEach(() => vi.restoreAllMocks());

const image = (id: string): FileItem<string> => ({
  kind: "new",
  id,
  file: new File(["x"], `${id}.png`, { type: "image/png" }),
});

describe("useObjectUrls", () => {
  it("creates URLs for new images only, and revokes each one on removal and unmount", () => {
    const create = vi.spyOn(URL, "createObjectURL");
    const revoke = vi.spyOn(URL, "revokeObjectURL");
    const pdf: FileItem<string> = {
      kind: "new",
      id: "p",
      file: new File(["x"], "a.pdf", { type: "application/pdf" }),
    };
    const stored: FileItem<string> = { kind: "existing", id: "s", data: "s" };
    const { result, rerender, unmount } = renderHook(({ items }) => useObjectUrls(items), {
      initialProps: { items: [image("a"), image("b"), pdf, stored] },
    });
    expect(create).toHaveBeenCalledTimes(2);
    expect([...result.current.keys()]).toEqual(["a", "b"]);

    rerender({ items: [image("b")] });
    expect(revoke).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(2);

    unmount();
    expect(revoke).toHaveBeenCalledTimes(2);
  });
});
