import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FileField } from "../file-field";
import { toExistingFiles } from "../utils";
import {
  describedByText,
  fileInput,
  labelledByText,
  makeFile,
  renderWithTooltips,
  type Stored,
  texts,
} from "./render-file-field";

const stored: Stored[] = [
  { id: 1, filename: "contrato.pdf", url: "/files/1", bytes: 2048, mime: "application/pdf" },
];

describe("FileField accessibility", () => {
  it("names, describes and marks the choose button (the native input)", () => {
    const { container } = renderWithTooltips(
      <FileField {...texts} label="Contrato" required helperText="PDF, hasta 10 MB" />,
    );
    const input = fileInput(container);
    expect(labelledByText(input)).toBe("Elegir archivo Contrato");
    expect(describedByText(input)).toContain("PDF, hasta 10 MB");
    expect(input.getAttribute("aria-required")).toBe("true");
    expect(input.className).toContain("sr-only");
    const trigger = container.querySelector("[data-slot=file-trigger]") as HTMLLabelElement;
    expect(trigger.htmlFor).toBe(input.id);
  });

  it("names the group with the label", () => {
    renderWithTooltips(<FileField {...texts} label="Adjuntos" multiple />);
    expect(screen.getByRole("group", { name: "Adjuntos" })).toBeTruthy();
  });

  it("uses aria-label when there is no visible label", () => {
    const { container } = renderWithTooltips(<FileField {...texts} aria-label="Foto de perfil" />);
    expect(labelledByText(fileInput(container))).toBe("Elegir archivo Foto de perfil");
  });

  it("names every action with the file's name and links stored files", () => {
    renderWithTooltips(
      <FileField
        {...texts}
        label="Adjuntos"
        multiple
        defaultValue={[
          ...toExistingFiles(stored, (s) => s.id),
          { kind: "new", id: "n", file: makeFile("foto.png", 5, "image/png") },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "Quitar contrato.pdf" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Quitar foto.png" })).toBeTruthy();
    const link = screen.getByRole("link", { name: "contrato.pdf" });
    expect(link.getAttribute("href")).toBe("/files/1");
    expect(screen.getByRole("list").children).toHaveLength(2);
  });

  it("announces rejections as an alert, with the developer's text", async () => {
    const { container } = renderWithTooltips(
      <FileField
        {...texts}
        label="Contrato"
        maxSize={1024}
        rejectionMessage={(r) => `${r.file.name} supera 1 KB`}
      />,
    );
    fireEvent.change(fileInput(container), { target: { files: [makeFile("grande.pdf", 4096)] } });
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe("grande.pdf supera 1 KB"),
    );
  });

  it("shows nothing for a rejection without a message", async () => {
    const { container } = renderWithTooltips(<FileField {...texts} label="Contrato" maxSize={1} />);
    fireEvent.change(fileInput(container), { target: { files: [makeFile("a.pdf", 10)] } });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("marks loading as busy and disables every control", () => {
    const { container } = renderWithTooltips(
      <FileField
        {...texts}
        label="Adjuntos"
        multiple
        loading
        loadingLabel="Cargando"
        defaultValue={toExistingFiles(stored, (s) => s.id)}
      />,
    );
    const input = fileInput(container);
    expect(input.disabled).toBe(true);
    expect(input.getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("group", { name: "Adjuntos" }).getAttribute("aria-busy")).toBe("true");
    expect(
      (screen.getByRole("button", { name: "Quitar contrato.pdf" }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(screen.getByRole("status", { name: "Cargando" })).toBeTruthy();
  });
});
