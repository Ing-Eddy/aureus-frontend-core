import { type RenderResult, render } from "@testing-library/react";
import type { ReactElement } from "react";
import type { FileInfo } from "@/internal/types";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

/** A stored photo, as the tests' backend returns it. */
export interface Photo {
  id: number;
  filename: string;
  url: string;
}

export const stored: Photo = { id: 7, filename: "ada.jpg", url: "/users/7.jpg" };

export const getFileInfo = (photo: Photo): FileInfo => ({
  name: photo.filename,
  url: photo.url,
  type: "image/jpeg",
});

/** The texts every avatar field requires, in Spanish, as a consumer would pass them. */
export const texts = {
  getFileInfo,
  chooseLabel: "Subir foto",
  changeLabel: "Cambiar foto",
  inspectLabel: (name: string) => `Ver ${name}`,
  dialogTitle: "Foto de perfil",
  closeLabel: "Cerrar",
};

export const editorTexts = {
  editable: true as const,
  editLabel: "Editar",
  cropAreaLabel: "Área de recorte",
  zoomLabel: "Zoom",
  rotateLeftLabel: "Girar a la izquierda",
  rotateRightLabel: "Girar a la derecha",
  flipHorizontalLabel: "Voltear en horizontal",
  flipVerticalLabel: "Voltear en vertical",
  resetLabel: "Restablecer",
  applyLabel: "Aplicar",
  cancelLabel: "Cancelar",
};

export const imageFile = (name = "me.png") => new File(["x"], name, { type: "image/png" });

export const renderWithTooltips = (element: ReactElement): RenderResult =>
  render(<TooltipProvider>{element}</TooltipProvider>);

export const fileInput = (container: HTMLElement) =>
  container.querySelector("input[type=file]") as HTMLInputElement;

/** The text of an element as assistive technology reads it: without `aria-hidden` content. */
function visibleText(element: Element | null) {
  if (!element) return "";
  const clone = element.cloneNode(true) as Element;
  for (const hidden of clone.querySelectorAll("[aria-hidden=true]")) hidden.remove();
  return clone.textContent?.trim() ?? "";
}

/** The accessible name an `aria-labelledby` list gives. */
export function labelledByText(element: Element) {
  return (element.getAttribute("aria-labelledby") ?? "")
    .split(" ")
    .filter(Boolean)
    .map((id) => visibleText(document.getElementById(id)))
    .join(" ");
}
