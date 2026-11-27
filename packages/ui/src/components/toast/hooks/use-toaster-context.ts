import { createContext, useContext } from "react";
import type { ToasterBaseProps, ToastPosition } from "../types";

/** The settings of a Toaster that each of its toasts reads. */
export interface ToasterContextValue
  extends Required<Pick<ToasterBaseProps, "position" | "appearance">>,
    Pick<ToasterBaseProps, "expandable" | "icons"> {
  /** Where the toasts stack. */
  position: ToastPosition;
  /** Whether toasts show a close button unless they say otherwise. */
  closeButton: boolean;
  /** Accessible name of the close buttons. */
  closeLabel: string | undefined;
}

/** Provided by `Toaster` around its list of toasts. */
export const ToasterContext = createContext<ToasterContextValue | null>(null);

/** The settings of the surrounding Toaster. */
export function useToasterContext(): ToasterContextValue {
  const context = useContext(ToasterContext);
  if (!context) throw new Error("A toast must be rendered inside `Toaster`.");
  return context;
}
