import { cn } from "cn";
import { XIcon } from "lucide-react";
import { type CSSProperties, useLayoutEffect, useRef } from "react";
import { Button } from "@/shadcn/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/shadcn/ui/sheet";
import { SidebarPresentationContext, useAppLayoutContext } from "../hooks";
import type { AppLayoutSidebarProps } from "../types";
import { sheetClassName, sheetCloseButtonClassName, sidebarInnerClassName } from "../utils";

/**
 * The mobile sidebar: a modal sheet that slides from the sidebar's side. It always shows the
 * expanded content. Focus returns to the element that opened it.
 */
export function AppLayoutSidebarSheet({
  children,
  className,
  style,
  mobileTitle,
  mobileDescription,
  mobileWidth = "18rem",
  mobileClassName,
  mobileCloseButton,
  mobileCloseLabel,
  variant: _variant,
  collapsible: _collapsible,
  width: _width,
  collapsedWidth: _collapsedWidth,
  rail: _rail,
  railLabel: _railLabel,
  ...rest
}: AppLayoutSidebarProps) {
  const { mobileOpen, setMobileOpen, physicalSide, direction, sidebarId, side } =
    useAppLayoutContext("AppLayoutSidebar");

  // The sheet has no Radix trigger, so remember what had focus to give it back on close.
  const returnFocusRef = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (!mobileOpen) return;
    const active = document.activeElement;
    returnFocusRef.current = active instanceof HTMLElement ? active : null;
  }, [mobileOpen]);

  return (
    <SidebarPresentationContext.Provider value={{ collapsed: false, mobile: true }}>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          id={sidebarId}
          side={physicalSide}
          dir={direction}
          showCloseButton={false}
          data-slot="app-layout-sidebar"
          data-mobile="true"
          data-logical-side={side}
          // Without a description, tell Radix there is none on purpose.
          {...(mobileDescription ? {} : { "aria-describedby": undefined })}
          className={cn(sheetClassName, mobileClassName)}
          style={{ "--app-layout-sidebar-width-mobile": mobileWidth } as CSSProperties}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocusRef.current?.focus();
          }}
        >
          <SheetTitle className="sr-only">{mobileTitle}</SheetTitle>
          {mobileDescription ? (
            <SheetDescription className="sr-only">{mobileDescription}</SheetDescription>
          ) : null}
          <div
            data-slot="app-layout-sidebar-inner"
            className={cn(sidebarInnerClassName, className)}
            style={style}
            {...rest}
          >
            {children}
          </div>
          {mobileCloseButton && mobileCloseLabel ? (
            <SheetClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={mobileCloseLabel}
                className={sheetCloseButtonClassName}
              >
                <XIcon aria-hidden />
              </Button>
            </SheetClose>
          ) : null}
        </SheetContent>
      </Sheet>
    </SidebarPresentationContext.Provider>
  );
}
