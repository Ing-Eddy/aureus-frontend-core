import { Toast, type ToastObject } from "@base-ui/react/toast";
import { act, render } from "@testing-library/react";
import { useEffect } from "react";
import type { ToastData } from "../types";
import { connectToaster, toastManager } from "../utils/libs";

/** A real Base UI provider connected to the library's manager, exposing what its store holds. */
export function renderToastProbe() {
  const state: { toasts: ToastObject<ToastData>[] } = { toasts: [] };
  function Probe() {
    state.toasts = Toast.useToastManager<ToastData>().toasts;
    return null;
  }
  // The connection is made by the provider's parent, like in `Toaster`: its effect runs after the
  // provider has subscribed to the manager.
  function Host() {
    useEffect(() => connectToaster(), []);
    return (
      <Toast.Provider toastManager={toastManager} limit={10}>
        <Probe />
      </Toast.Provider>
    );
  }
  const view = render(<Host />);
  return {
    ...view,
    /** Newest first, without the toasts that are closing. */
    open: () => state.toasts.filter((toast) => toast.transitionStatus !== "ending"),
    run: <T,>(operation: () => T): T => {
      let result!: T;
      act(() => {
        result = operation();
      });
      return result;
    },
  };
}
