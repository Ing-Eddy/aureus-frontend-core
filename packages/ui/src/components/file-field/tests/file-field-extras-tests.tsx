import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FileField } from "../file-field";
import type { FileItem } from "../types";
import { fileInput, makeFile, renderWithTooltips, type Stored, texts } from "./render-file-field";

const three = (): FileItem<Stored>[] =>
  ["a.pdf", "b.pdf", "c.pdf"].map((name) => ({ kind: "new", id: name, file: makeFile(name) }));

describe("FileField extras", () => {
  it("reorders with the keyboard and announces the position", () => {
    const onValueChange = vi.fn();
    renderWithTooltips(
      <FileField
        {...texts}
        label="Fotos"
        multiple
        reorderable
        moveLabel={(name) => `Mover ${name}`}
        moveAnnouncement={(name, position, total) => `${name}, posición ${position} de ${total}`}
        defaultValue={three()}
        onValueChange={onValueChange}
      />,
    );
    const handle = screen.getByRole("button", { name: "Mover a.pdf" });
    handle.focus();
    fireEvent.keyDown(handle, { key: " " });
    fireEvent.keyDown(handle, { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("button", { name: "Mover a.pdf" }), { key: " " });
    expect(
      ((onValueChange.mock.lastCall?.[0] ?? []) as FileItem<Stored>[]).map((i) => i.id),
    ).toEqual(["b.pdf", "a.pdf", "c.pdf"]);
    expect(document.querySelector("[data-slot=file-announcer]")?.textContent).toBe(
      "a.pdf, posición 2 de 3",
    );
  });

  it("has no move handles without reorderable", () => {
    renderWithTooltips(<FileField {...texts} label="Fotos" multiple defaultValue={three()} />);
    expect(document.querySelector("[data-file-handle]")).toBeNull();
  });

  it("adds pasted files with pasteable", async () => {
    const onValueChange = vi.fn();
    const { container } = renderWithTooltips(
      <FileField {...texts} label="Fotos" multiple pasteable onValueChange={onValueChange} />,
    );
    fireEvent.paste(fileInput(container), {
      clipboardData: { files: [makeFile("pasted.png", 3, "image/png")] },
    });
    await waitFor(() => expect(onValueChange).toHaveBeenCalled());
    expect(((onValueChange.mock.lastCall?.[0] ?? []) as FileItem<Stored>[])[0]).toMatchObject({
      kind: "new",
    });
  });

  it("sets capture on the input", () => {
    const { container } = renderWithTooltips(
      <FileField {...texts} label="Foto" capture="environment" />,
    );
    expect(fileInput(container).getAttribute("capture")).toBe("environment");
  });

  it("adds dropped files through the dropzone and shows its text", async () => {
    const onValueChange = vi.fn();
    const { container } = renderWithTooltips(
      <FileField
        {...texts}
        label="Adjuntos"
        multiple
        dropzone
        dropzoneText="Arrastra archivos aquí"
        onValueChange={onValueChange}
      />,
    );
    const zone = container.querySelector("[data-slot=file-dropzone]") as HTMLElement;
    expect(zone.textContent).toContain("Arrastra archivos aquí");
    expect(zone.contains(fileInput(container))).toBe(true);
    fireEvent.drop(zone, {
      dataTransfer: { files: [makeFile("1.pdf"), makeFile("2.pdf")], types: ["Files"] },
    });
    await waitFor(() => expect(onValueChange).toHaveBeenCalled());
    expect(onValueChange.mock.lastCall?.[0]).toHaveLength(2);
  });

  it("shows a large preview with replace and remove in the single appearance", () => {
    const { container } = renderWithTooltips(
      <FileField
        {...texts}
        label="Portada"
        appearance="single"
        replaceLabel={(name) => `Sustituir ${name}`}
        defaultValue={{ kind: "new", id: "c", file: makeFile("cover.png", 3, "image/png") }}
      />,
    );
    expect(container.querySelector("[data-slot=file-single] img")).toBeTruthy();
    expect(container.querySelectorAll("input[type=file]")).toHaveLength(1);
    const input = fileInput(container);
    const label = document.getElementById(`${input.id}-choose`);
    expect(label?.textContent).toBe("Sustituir cover.png");
    expect(screen.getByRole("button", { name: "Quitar cover.png" })).toBeTruthy();
  });

  it("shows tiles in the grid appearance", () => {
    renderWithTooltips(
      <FileField {...texts} label="Fotos" multiple appearance="grid" defaultValue={three()} />,
    );
    expect(screen.getByRole("list").getAttribute("data-layout")).toBe("grid");
    expect(document.querySelector("[data-orientation=vertical]")).toBeTruthy();
  });
});
