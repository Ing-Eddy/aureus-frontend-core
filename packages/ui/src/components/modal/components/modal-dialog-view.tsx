import { Dialog as DialogPrimitive } from "radix-ui";
import type { RefObject } from "react";
import { cn } from "@/shadcn/lib/utils";
import { Dialog, DialogOverlay, DialogPortal } from "@/shadcn/ui/dialog";
import { type ModalContextValue, ModalPanelContext, useModalPanel } from "../hooks";
import type { ModalContentProps } from "../types";
import { dialogContentClassName, dialogSizeClassNames } from "../utils";
import { ModalCloseButton } from "./modal-close-button";
import { ModalPanelLifecycle } from "./modal-panel-lifecycle";

export interface ModalViewProps {
  context: ModalContextValue;
  props: ModalContentProps;
  titleWarned: RefObject<boolean>;
}

/** The dialog presentation: Radix Dialog with shadcn's look. */
export function ModalDialogView({ context, props, titleWarned }: ModalViewProps) {
  const panel = useModalPanel(context, props);
  return (
    <Dialog open={context.open} onOpenChange={panel.onPrimitiveOpenChange} modal={context.modal}>
      <DialogPortal container={panel.container}>
        <DialogOverlay data-slot="modal-overlay" className={panel.overlayClassName} />
        <DialogPrimitive.Content
          {...panel.contentProps}
          className={cn(dialogContentClassName, dialogSizeClassNames[panel.size], panel.className)}
        >
          <ModalPanelContext.Provider value={panel.panelValue}>
            {panel.children}
            {panel.closeButton ? (
              <ModalCloseButton label={panel.closeLabel} className={panel.closeButtonClassName} />
            ) : null}
            <ModalPanelLifecycle
              panelRef={panel.panelRef}
              titleCount={panel.titleCount}
              titleWarned={titleWarned}
            />
          </ModalPanelContext.Provider>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
