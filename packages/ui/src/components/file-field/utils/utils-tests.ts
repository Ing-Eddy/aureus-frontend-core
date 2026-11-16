import { describe, expect, it } from "vitest";
import type { FileItem } from "../types";
import { acceptMatches } from "./accept-matches";
import { diffFiles } from "./diff-files";
import { isExistingFile, isNewFile, toExistingFile, toExistingFiles } from "./file-guards";
import { createFileId } from "./file-ids";
import { fileToBase64 } from "./file-to-base64";
import { formatFileSize } from "./format-file-size";
import { hasPendingUploads } from "./has-pending-uploads";
import { toFormData } from "./to-form-data";
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

describe("formatFileSize", () => {
  it("uses the largest unit that fits, formatted by Intl", () => {
    const intl = (value: number, unit: string, locale: string) =>
      new Intl.NumberFormat(locale, {
        style: "unit",
        unit,
        unitDisplay: "short",
        maximumFractionDigits: 1,
      }).format(value);
    expect(formatFileSize(512, "en-US")).toBe(intl(512, "byte", "en-US"));
    expect(formatFileSize(1500, "en-US")).toBe(intl(1.5, "kilobyte", "en-US"));
    expect(formatFileSize(2_000_000, "en-US")).toBe(intl(2, "megabyte", "en-US"));
    expect(formatFileSize(3_200_000_000, "en-US")).toBe(intl(3.2, "gigabyte", "en-US"));
    expect(formatFileSize(1500, "es-ES")).toContain("1,5");
  });
});

interface Stored {
  id: number;
  url: string;
}

describe("diffFiles", () => {
  const a = toExistingFile<Stored>({ id: 1, url: "/1" }, (d) => d.id);
  const b = toExistingFile<Stored>({ id: 2, url: "/2" }, (d) => d.id);
  const photo = file("photo.png", 3, "image/png");
  it("returns added files, kept data and removed data", () => {
    const current: FileItem<Stored>[] = [b, { kind: "new", id: "n1", file: photo }];
    expect(diffFiles([a, b], current)).toEqual({
      added: [photo],
      kept: [{ id: 2, url: "/2" }],
      removed: [{ id: 1, url: "/1" }],
    });
  });
  it("accepts single values and null", () => {
    expect(diffFiles(a, null)).toEqual({ added: [], kept: [], removed: [a.data] });
    expect(diffFiles(null, a)).toEqual({ added: [], kept: [a.data], removed: [] });
  });
});

describe("helpers", () => {
  it("builds existing items with stable ids", () => {
    expect(toExistingFiles(["x", "y"]).map((i) => i.id)).toEqual(["existing-0", "existing-1"]);
    expect(toExistingFiles([{ k: 7 }], (d) => d.k)[0]?.id).toBe("existing-7");
  });
  it("narrows items", () => {
    const item: FileItem<string> = { kind: "new", id: "1", file: file("a", 1) };
    expect(isNewFile(item)).toBe(true);
    expect(isExistingFile(item)).toBe(false);
  });
  it("appends only new files to FormData", () => {
    const a = file("a.txt", 1);
    const data = toFormData([{ kind: "new", id: "1", file: a }, toExistingFile("stored")], "docs");
    expect(data.getAll("docs")).toHaveLength(1);
    expect((data.get("docs") as File).name).toBe("a.txt");
  });
  it("reports pending uploads while a new item remains", () => {
    expect(hasPendingUploads([toExistingFile("x")])).toBe(false);
    expect(hasPendingUploads({ kind: "new", id: "1", file: file("a", 1) })).toBe(true);
    expect(hasPendingUploads(null)).toBe(false);
  });
  it("reads a file as a data URL", async () => {
    const url = await fileToBase64(new File(["hi"], "a.txt", { type: "text/plain" }));
    expect(url).toBe("data:text/plain;base64,aGk=");
  });
  it("creates unique ids", () => {
    expect(createFileId()).not.toBe(createFileId());
  });
});
