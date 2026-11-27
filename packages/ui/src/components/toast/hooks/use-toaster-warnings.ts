import { useMissingTexts } from "@/internal/hooks";
import type { ToasterProps } from "../types";

/** Development warnings for the texts untyped code can leave out of a Toaster. */
export function useToasterWarnings({ label, closeButton, closeLabel }: ToasterProps) {
  useMissingTexts("Toaster", [
    [!label, "`label` is required"],
    [closeButton && !closeLabel, "`closeButton` needs `closeLabel`"],
  ]);
}
