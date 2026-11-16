import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FileField } from "../file-field";
import type { FileItem } from "../types";
import { diffFiles, toExistingFile, toExistingFiles } from "../utils";
import { fileInput, makeFile, renderWithTooltips, type Stored, texts } from "./render-file-field";

const stored: Stored[] = [
  { id: 1, filename: "a.pdf", url: "/files/1" },
  { id: 2, filename: "b.pdf", url: "/files/2" },
];

const pick = (container: HTMLElement, files: File[]) =>
  fireEvent.change(fileInput(container), { target: { files } });

describe("FileField value", () => {
  it("updates a form with stored files: remove one, add one", async () => {
    const initial = toExistingFiles(stored, (s) => s.id);
    const onValueChange = vi.fn();
    const { container } = renderWithTooltips(
      <FileField
        {...texts}
        label="Adjuntos"
        multiple
        defaultValue={initial}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Quitar a.pdf" }));
    const photo = makeFile("photo.png", 5, "image/png");
    pick(container, [photo]);
    await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(2));
    const value = onValueChange.mock.calls[1]?.[0] as FileItem<Stored>[];
    expect(value.map((item) => item.kind)).toEqual(["existing", "new"]);
    expect(screen.getByRole("link", { name: "b.pdf" }).getAttribute("href")).toBe("/files/2");
    expect(diffFiles(initial, value)).toEqual({
      added: [photo],
      kept: [stored[1]],
      removed: [stored[0]],
    });
  });

  it("replaces the single file", async () => {
    const onValueChange = vi.fn();
    const { container } = renderWithTooltips(
      <FileField
        {...texts}
        label="Contrato"
        defaultValue={toExistingFile(stored[0] as Stored, (s) => s.id)}
        onValueChange={onValueChange}
      />,
    );
    const next = makeFile("nuevo.pdf");
    pick(container, [next]);
    await waitFor(() => expect(onValueChange).toHaveBeenCalled());
    expect(onValueChange.mock.calls[0]?.[0]).toMatchObject({ kind: "new", file: next });
    expect(screen.queryByRole("link", { name: "a.pdf" })).toBeNull();
  });

  it("removes the single file to null and keeps focus in the field", () => {
    const onValueChange = vi.fn();
    const { container } = renderWithTooltips(
      <FileField
        {...texts}
        label="Contrato"
        defaultValue={toExistingFile(stored[0] as Stored)}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Quitar a.pdf" }));
    expect(onValueChange).toHaveBeenCalledWith(null);
    expect(document.activeElement).toBe(fileInput(container));
  });

  it("follows a controlled value", () => {
    const { rerender } = renderWithTooltips(
      <FileField {...texts} label="Adjuntos" multiple value={[]} />,
    );
    expect(screen.queryByRole("list")).toBeNull();
    rerender(
      <FileField
        {...texts}
        label="Adjuntos"
        multiple
        value={toExistingFiles(stored, (s) => s.id)}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("shows sizes formatted for the locale", () => {
    renderWithTooltips(
      <FileField
        {...texts}
        label="Adjuntos"
        multiple
        locale="es-ES"
        defaultValue={[{ kind: "new", id: "n", file: makeFile("x.pdf", 1500) }]}
      />,
    );
    expect(document.querySelector("[data-slot=file-item-size]")?.textContent).toContain("1,5");
  });
});
