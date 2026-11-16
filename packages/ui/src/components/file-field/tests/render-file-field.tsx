import { type RenderResult, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import type { FileInfo } from "../types";

/** The backend's data of a stored file, as the tests' backend returns it. */
export interface Stored {
  id: number;
  filename: string;
  url: string;
  bytes?: number;
  mime?: string;
}

export const getFileInfo = (data: Stored): FileInfo => ({
  name: data.filename,
  url: data.url,
  size: data.bytes,
  type: data.mime,
});

/** The texts every file field requires, in Spanish, as a consumer would pass them. */
export const texts = {
  chooseLabel: "Elegir archivo",
  removeLabel: (name: string) => `Quitar ${name}`,
  getFileInfo,
};

export const makeFile = (name: string, size = 10, type = "application/pdf") =>
  new File([new Uint8Array(size)], name, { type });

export const renderWithTooltips = (element: ReactElement): RenderResult =>
  render(<TooltipProvider>{element}</TooltipProvider>);

/** The text of an element as assistive technology reads it: without `aria-hidden` content. */
function visibleText(element: Element | null) {
  if (!element) return "";
  const clone = element.cloneNode(true) as Element;
  for (const hidden of clone.querySelectorAll("[aria-hidden=true]")) hidden.remove();
  return clone.textContent?.trim() ?? "";
}

/** The accessible name an `aria-labelledby` list gives, from the referenced elements' text. */
export function labelledByText(element: Element) {
  return (element.getAttribute("aria-labelledby") ?? "")
    .split(" ")
    .filter(Boolean)
    .map((id) => visibleText(document.getElementById(id)))
    .join(" ");
}

/** The text of the elements an `aria-describedby` list points at. */
export function describedByText(element: Element) {
  return (element.getAttribute("aria-describedby") ?? "")
    .split(" ")
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent?.trim())
    .join(" ");
}

export const fileInput = (container: HTMLElement) =>
  container.querySelector("input[type=file]") as HTMLInputElement;
