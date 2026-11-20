import { useContext, useEffect } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/shadcn/lib/utils";
import { DrawerOverlay, DrawerPortal } from "@/shadcn/ui/drawer";
import { ModalPanelContext, useModalPanel } from "../hooks";
import { drawerContentClassName, drawerHandleClassName } from "../utils";
import { ModalCloseButton } from "./modal-close-button";
import type { ModalViewProps } from "./modal-dialog-view";
import { ModalPanelLifecycle } from "./modal-panel-lifecycle";

/**
 * Keeps the page usable behind a non-modal drawer. Vaul does not pass `modal` to Radix, which
 * disables pointer events on the page; Vaul only restores them when it changes the state itself,
 * not when `open` changes from outside. Radix restores the previous value when the drawer closes.
 */
function NonModalPointerEvents() {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.body.style.pointerEvents = "auto";
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return null;
}

/**
 * The drawer presentation: Vaul with shadcn's look. Inside another modal's drawer it stacks as a
 * nested drawer. Vaul does not move focus by default; `autoFocus` makes it behave like the dialog.
 */
export function ModalDrawerView({ context, props, titleWarned }: ModalViewProps) {
  const panel = useModalPanel(context, props);
  const parentPanel = useContext(ModalPanelContext);
  const Root = parentPanel?.mode === "drawer" ? DrawerPrimitive.NestedRoot : DrawerPrimitive.Root;
  const { drawer } = context;
  const vertical = drawer.direction === "bottom" || drawer.direction === "top";
  const handle =
    panel.drawerHandle && vertical ? (
      <div
        aria-hidden="true"
        data-slot="modal-handle"
        className={cn(
          drawerHandleClassName,
          drawer.direction === "bottom" ? "mt-4" : "mb-4",
          panel.handleClassName,
        )}
      />
    ) : null;

  return (
    <Root
      open={context.open}
      onOpenChange={panel.onPrimitiveOpenChange}
      modal={context.modal}
      direction={drawer.direction}
      dismissible={context.closeOnSwipe}
      snapPoints={drawer.snapPoints}
      activeSnapPoint={drawer.activeSnapPoint}
      setActiveSnapPoint={drawer.onActiveSnapPointChange}
      onDrag={drawer.onDrag}
      onRelease={drawer.onRelease}
      handleOnly={drawer.handleOnly}
      shouldScaleBackground={drawer.scaleBackground}
      repositionInputs={drawer.repositionInputs}
      autoFocus
    >
      <DrawerPortal container={panel.container}>
        <DrawerOverlay data-slot="modal-overlay" className={panel.overlayClassName} />
        <DrawerPrimitive.Content
          {...panel.contentProps}
          className={cn(drawerContentClassName, panel.className)}
        >
          <ModalPanelContext.Provider value={panel.panelValue}>
            {drawer.direction === "bottom" ? handle : null}
            {panel.children}
            {drawer.direction === "top" ? handle : null}
            {panel.closeButton ? (
              <ModalCloseButton label={panel.closeLabel} className={panel.closeButtonClassName} />
            ) : null}
            {context.modal ? null : <NonModalPointerEvents />}
            <ModalPanelLifecycle
              panelRef={panel.panelRef}
              titleCount={panel.titleCount}
              titleWarned={titleWarned}
            />
          </ModalPanelContext.Provider>
        </DrawerPrimitive.Content>
      </DrawerPortal>
    </Root>
  );
}
