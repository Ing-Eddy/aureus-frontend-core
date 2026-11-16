import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FileField } from "../file-field";
import type { FileItem, FileUploadContext } from "../types";
import { fileInput, makeFile, renderWithTooltips, type Stored, texts } from "./render-file-field";

function controlledUpload() {
  const calls: {
    file: File;
    context: FileUploadContext;
    resolve: (data: Stored) => void;
    reject: (error: unknown) => void;
  }[] = [];
  const upload = vi.fn(
    (file: File, context: FileUploadContext) =>
      new Promise<Stored>((resolve, reject) => {
        calls.push({ file, context, resolve, reject });
      }),
  );
  return { upload, calls };
}

const uploadTexts = {
  uploadProgressLabel: (name: string) => `Subiendo ${name}`,
  cancelUploadLabel: (name: string) => `Cancelar ${name}`,
  retryUploadLabel: (name: string) => `Reintentar ${name}`,
  uploadErrorText: (name: string) => `No se pudo subir ${name}`,
};

describe("FileField immediate upload", () => {
  it("shows progress and turns the item into an existing one in place", async () => {
    const { upload, calls } = controlledUpload();
    const onValueChange = vi.fn();
    const { container } = renderWithTooltips(
      <FileField
        {...texts}
        {...uploadTexts}
        label="Adjuntos"
        multiple
        upload={upload}
        defaultValue={[{ kind: "new", id: "first", file: makeFile("first.pdf") }]}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.change(fileInput(container), { target: { files: [makeFile("contract.pdf")] } });
    await waitFor(() => expect(upload).toHaveBeenCalledTimes(1));
    act(() => calls[0]?.context.onProgress(50));
    const bar = screen.getByRole("progressbar", { name: "Subiendo contract.pdf" });
    expect(bar.getAttribute("aria-valuenow")).toBe("50");
    expect(screen.getByRole("button", { name: "Cancelar contract.pdf" })).toBeTruthy();

    await act(async () => calls[0]?.resolve({ id: 7, filename: "contract.pdf", url: "/files/7" }));
    const value = onValueChange.mock.lastCall?.[0] as FileItem<Stored>[];
    expect(value[1]).toMatchObject({ kind: "existing", data: { id: 7, url: "/files/7" } });
    expect(value[1]?.id).toBe(
      ((onValueChange.mock.calls[0]?.[0] ?? []) as FileItem<Stored>[])[1]?.id,
    );
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.getByRole("link", { name: "contract.pdf" })).toBeTruthy();
  });

  it("shows the error, announces it and retries", async () => {
    const { upload, calls } = controlledUpload();
    const onUploadError = vi.fn();
    const { container } = renderWithTooltips(
      <FileField
        {...texts}
        {...uploadTexts}
        label="Contrato"
        upload={upload}
        onUploadError={onUploadError}
      />,
    );
    fireEvent.change(fileInput(container), { target: { files: [makeFile("contract.pdf")] } });
    await waitFor(() => expect(upload).toHaveBeenCalled());
    await act(async () => calls[0]?.reject(new Error("500")));
    expect(onUploadError).toHaveBeenCalled();
    expect(document.querySelector("[data-slot=file-item-error]")?.textContent).toBe(
      "No se pudo subir contract.pdf",
    );
    expect(document.querySelector("[data-slot=file-announcer]")?.textContent).toBe(
      "No se pudo subir contract.pdf",
    );
    fireEvent.click(screen.getByRole("button", { name: "Reintentar contract.pdf" }));
    expect(upload).toHaveBeenCalledTimes(2);
  });

  it("cancels: aborts the request and removes the item", async () => {
    const { upload, calls } = controlledUpload();
    const onValueChange = vi.fn();
    const { container } = renderWithTooltips(
      <FileField
        {...texts}
        {...uploadTexts}
        label="Adjuntos"
        multiple
        upload={upload}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.change(fileInput(container), { target: { files: [makeFile("big.zip")] } });
    await waitFor(() => expect(upload).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: "Cancelar big.zip" }));
    expect(calls[0]?.context.signal.aborted).toBe(true);
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("aborts pending uploads on unmount", async () => {
    const { upload, calls } = controlledUpload();
    const { container, unmount } = renderWithTooltips(
      <FileField {...texts} {...uploadTexts} label="Adjuntos" multiple upload={upload} />,
    );
    fireEvent.change(fileInput(container), { target: { files: [makeFile("a"), makeFile("b")] } });
    await waitFor(() => expect(upload).toHaveBeenCalledTimes(2));
    unmount();
    expect(calls.every((call) => call.context.signal.aborted)).toBe(true);
  });

  it("uploads the transformed file", async () => {
    const { upload } = controlledUpload();
    const transform = vi.fn(async (file: File) => new File(["min"], `min-${file.name}`));
    const { container } = renderWithTooltips(
      <FileField {...texts} {...uploadTexts} label="Foto" upload={upload} transform={transform} />,
    );
    fireEvent.change(fileInput(container), { target: { files: [makeFile("photo.png")] } });
    await waitFor(() => expect(upload).toHaveBeenCalled());
    expect(upload.mock.calls[0]?.[0].name).toBe("min-photo.png");
  });
});
