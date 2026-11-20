import { useRef } from "react";
import { useModalContext, useModalWarnings } from "../hooks";
import type { ModalContentProps } from "../types";
import { ModalDialogView } from "./modal-dialog-view";
import { ModalDrawerView } from "./modal-drawer-view";

/**
 * The panel: a centred dialog or a drawer, following the modal's mode. Changing the mode remounts
 * only this part. Pass `ModalTitle` inside it; the close button is opt-in and needs `closeLabel`.
 */
export function ModalContent(props: ModalContentProps) {
  const context = useModalContext("ModalContent");
  useModalWarnings({ closeButton: props.closeButton, closeLabel: props.closeLabel });
  // Kept here, outside the views, so the warning stays once per part across mode changes.
  const titleWarned = useRef(false);
  const View = context.mode === "dialog" ? ModalDialogView : ModalDrawerView;
  return <View context={context} props={props} titleWarned={titleWarned} />;
}
