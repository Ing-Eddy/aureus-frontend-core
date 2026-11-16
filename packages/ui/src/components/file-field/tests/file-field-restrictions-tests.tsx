import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FileField } from "../file-field";
import { fileInput, makeFile, renderWithTooltips, texts } from "./render-file-field";

describe("FileField restrictions", () => {
  it("rejects a file that is too large", async () => {
    const onValueChange = vi.fn();
    const onReject = vi.fn();
    const { container } = renderWithTooltips(
      <FileField
        {...texts}
        label="Foto"
        maxSize={1_048_576}
        onValueChange={onValueChange}
        onReject={onReject}
        rejectionMessage={(r) => `${r.file.name} supera 1 MB`}
      />,
    );
    fireEvent.change(fileInput(container), {
      target: { files: [makeFile("photo.png", 2_097_152, "image/png")] },
    });
    await waitFor(() => expect(onReject).toHaveBeenCalled());
    expect(onReject.mock.calls[0]?.[0][0].reasons).toEqual(["size-max"]);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("alert").textContent).toBe("photo.png supera 1 MB");
  });

  it("adds what fits under maxFiles and rejects the rest", async () => {
    const onValueChange = vi.fn();
    const onReject = vi.fn();
    const { container } = renderWithTooltips(
      <FileField
        {...texts}
        label="Adjuntos"
        multiple
        maxFiles={2}
        defaultValue={[{ kind: "new", id: "x", file: makeFile("x.pdf") }]}
        onValueChange={onValueChange}
        onReject={onReject}
      />,
    );
    fireEvent.change(fileInput(container), {
      target: { files: [makeFile("1.pdf"), makeFile("2.pdf"), makeFile("3.pdf")] },
    });
    await waitFor(() => expect(onValueChange).toHaveBeenCalled());
    expect(onValueChange.mock.calls[0]?.[0]).toHaveLength(2);
    expect(onReject.mock.calls[0]?.[0].map((r: { reasons: string[] }) => r.reasons)).toEqual([
      ["count"],
      ["count"],
    ]);
    // Full: the choose button is disabled.
    expect(fileInput(container).disabled).toBe(true);
  });

  it("checks accept on dropped files and sets it on the input", async () => {
    const onValueChange = vi.fn();
    const onReject = vi.fn();
    const { container } = renderWithTooltips(
      <FileField
        {...texts}
        label="Fotos"
        multiple
        accept="image/*"
        dropzone
        dropzoneText="Arrastra fotos aquí"
        onValueChange={onValueChange}
        onReject={onReject}
      />,
    );
    expect(fileInput(container).accept).toBe("image/*");
    fireEvent.drop(container.querySelector("[data-slot=file-dropzone]") as HTMLElement, {
      dataTransfer: {
        files: [makeFile("a.png", 1, "image/png"), makeFile("b.pdf")],
        types: ["Files"],
      },
    });
    await waitFor(() => expect(onValueChange).toHaveBeenCalled());
    expect(onValueChange.mock.calls[0]?.[0]).toHaveLength(1);
    expect(onReject.mock.calls[0]?.[0][0].reasons).toEqual(["type"]);
  });

  it("rejects by total size across the current files", async () => {
    const onReject = vi.fn();
    const { container } = renderWithTooltips(
      <FileField
        {...texts}
        label="Adjuntos"
        multiple
        maxTotalSize={100}
        defaultValue={[{ kind: "new", id: "x", file: makeFile("x.pdf", 80) }]}
        onReject={onReject}
      />,
    );
    fireEvent.change(fileInput(container), { target: { files: [makeFile("y.pdf", 30)] } });
    await waitFor(() => expect(onReject).toHaveBeenCalled());
    expect(onReject.mock.calls[0]?.[0][0].reasons).toEqual(["total-size"]);
  });
});
