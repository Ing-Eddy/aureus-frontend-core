import { describe, expect, it } from "vitest";
import { acceptMatches } from "./accept-matches";
import { createFileId } from "./file-ids";
import { validateFiles } from "./validate-files";

const file = (name: string, size: number, type = "") =>
  new File([new Uint8Array(size)], name, { type });

describe("acceptMatches", () => {
  const pdf = file("Contract.PDF", 1, "application/pdf");
  const png = file("photo.png", 1, "image/png");
  it("matches extensions, exact types and families, ignoring case", () => {
    expect(acceptMatches(pdf, ".pdf")).toBe(true);
    expect(acceptMatches(pdf, "application/pdf")).toBe(true);
    expect(acceptMatches(png, "image/*")).toBe(true);
    expect(acceptMatches(png, "IMAGE/*, .pdf")).toBe(true);
    expect(acceptMatches(pdf, "image/*")).toBe(false);
  });
  it("accepts everything without a rule", () => {
    expect(acceptMatches(pdf, undefined)).toBe(true);
    expect(acceptMatches(pdf, " ")).toBe(true);
  });
});

describe("validateFiles", () => {
  const none = { count: 0, totalSize: 0 };
  it("rejects by type and size with every reason", () => {
    const { accepted, rejected } = validateFiles(
      [file("a.txt", 5, "text/plain"), file("b.png", 50, "image/png")],
      none,
      { accept: "image/*", maxSize: 10 },
    );
    expect(accepted).toEqual([]);
    expect(rejected.map((r) => r.reasons)).toEqual([["type"], ["size-max"]]);
  });
  it("rejects small files with size-min", () => {
    expect(validateFiles([file("a", 1)], none, { minSize: 2 }).rejected[0]?.reasons).toEqual([
      "size-min",
    ]);
  });
  it("counts in pick order, including what the value already holds", () => {
    const picked = [file("1", 1), file("2", 1), file("3", 1)];
    const { accepted, rejected } = validateFiles(
      picked,
      { count: 1, totalSize: 0 },
      { maxFiles: 2 },
    );
    expect(accepted.map((f) => f.name)).toEqual(["1"]);
    expect(rejected.map((r) => [r.file.name, r.reasons])).toEqual([
      ["2", ["count"]],
      ["3", ["count"]],
    ]);
  });
  it("checks the total size with the current files", () => {
    const { accepted, rejected } = validateFiles(
      [file("a", 4), file("b", 4)],
      { count: 1, totalSize: 3 },
      { maxTotalSize: 10 },
    );
    expect(accepted.map((f) => f.name)).toEqual(["a"]);
    expect(rejected[0]?.reasons).toEqual(["total-size"]);
  });
  it("does not let a rejected file use up the count", () => {
    const { accepted } = validateFiles([file("big", 99), file("ok", 1)], none, {
      maxSize: 10,
      maxFiles: 1,
    });
    expect(accepted.map((f) => f.name)).toEqual(["ok"]);
  });
});

describe("createFileId", () => {
  it("creates unique ids", () => {
    expect(createFileId()).not.toBe(createFileId());
  });
});
