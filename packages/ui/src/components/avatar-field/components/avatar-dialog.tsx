import { DownloadIcon, PencilIcon, RefreshCwIcon, Trash2Icon, XIcon } from "lucide-react";
import { type ClipboardEvent, type ComponentProps, type ReactNode, useRef } from "react";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/shadcn/ui/dialog";
import { AvatarEditor, type AvatarEditorProps } from "./avatar-editor";
import { AvatarViewer, type AvatarViewerProps } from "./avatar-viewer";

/** The texts of the dialog. */
export interface AvatarDialogTexts {
  /** Title of the dialog. */
  dialogTitle: ReactNode;
  /** Name of the close button. */
  closeLabel: string;
  /** Text of the change button. */
  changeLabel: ReactNode;
  /** Text of the edit button. */
  editLabel?: ReactNode;
  /** Text of the remove button. */
  removeLabel?: ReactNode;
  /** Text of the link to the original. */
  downloadLabel?: ReactNode;
}

/** Props of `AvatarDialog`. */
export interface AvatarDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Called when it asks to open or close. */
  onOpenChange: (open: boolean) => void;
  /** Looking at the photo, or editing it. */
  view: "inspect" | "edit";
  /** Switches the view. */
  onViewChange: (view: "inspect" | "edit") => void;
  /** The dialog's texts. */
  texts: AvatarDialogTexts;
  /** Props of the large photo. */
  viewer: AvatarViewerProps;
  /** The editor's props, with `editable`; no edit action without them. */
  editor?: Omit<AvatarEditorProps, "onCancel">;
  /** Opens the system picker of the field's file input; no change action without it (read-only). */
  onChange?: () => void;
  /** Removes the photo, with `removable`. */
  onRemove?: () => void;
  /** URL of the original, with `downloadable`. */
  downloadUrl?: string;
  /** Adds pasted images, with `pasteable`. */
  onPaste?: (event: ClipboardEvent<HTMLElement>) => void;
  /** Where focus goes when the dialog closes. */
  onCloseAutoFocus: NonNullable<ComponentProps<typeof DialogContent>["onCloseAutoFocus"]>;
  /** Disables the actions. */
  disabled: boolean;
  /** Extra classes of the dialog. */
  className?: string;
}

/** Icon-and-text actions keep a 44 px target on coarse pointers. */
const actionClassName = "pointer-coarse:min-h-11";

/**
 * The inspection dialog: the large photo and its actions (change, edit, remove, open the
 * original), or the editor. shadcn's built-in close button has a fixed English name, so it is
 * turned off and replaced by one named with `closeLabel`. Switching views moves focus to the new
 * view's first control.
 */
export function AvatarDialog({
  open,
  onOpenChange,
  view,
  onViewChange,
  texts,
  viewer,
  editor,
  onChange,
  onRemove,
  downloadUrl,
  onPaste,
  onCloseAutoFocus,
  disabled,
  className,
}: AvatarDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const focusFirst = () =>
    requestAnimationFrame(() =>
      contentRef.current
        ?.querySelector<HTMLElement>(
          "[data-slot=avatar-dialog-body] :is(button, [tabindex='0'], a)",
        )
        ?.focus(),
    );
  const switchTo = (next: "inspect" | "edit") => {
    onViewChange(next);
    focusFirst();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={contentRef}
        showCloseButton={false}
        aria-modal="true"
        aria-describedby={undefined}
        onCloseAutoFocus={onCloseAutoFocus}
        onPaste={onPaste}
        data-slot="avatar-dialog"
        data-view={view}
        className={cn("gap-4 sm:max-w-sm", className)}
      >
        <div className="flex items-center justify-between gap-2">
          <DialogTitle>{texts.dialogTitle}</DialogTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={texts.closeLabel}
            onClick={() => onOpenChange(false)}
            className="pointer-coarse:size-11"
          >
            <XIcon aria-hidden="true" />
          </Button>
        </div>
        <div data-slot="avatar-dialog-body" className="flex min-w-0 flex-col gap-4">
          {view === "edit" && editor ? (
            <AvatarEditor {...editor} onCancel={() => switchTo("inspect")} />
          ) : (
            <>
              <AvatarViewer {...viewer} />
              <div className="flex flex-wrap justify-center gap-2">
                {onChange ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    onClick={onChange}
                    className={actionClassName}
                  >
                    <RefreshCwIcon aria-hidden="true" />
                    {texts.changeLabel}
                  </Button>
                ) : null}
                {editor ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    onClick={() => switchTo("edit")}
                    className={actionClassName}
                  >
                    <PencilIcon aria-hidden="true" />
                    {texts.editLabel}
                  </Button>
                ) : null}
                {downloadUrl ? (
                  <Button variant="outline" asChild className={actionClassName}>
                    <a href={downloadUrl} target="_blank" rel="noreferrer" download>
                      <DownloadIcon aria-hidden="true" />
                      {texts.downloadLabel}
                    </a>
                  </Button>
                ) : null}
                {onRemove ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    onClick={onRemove}
                    className={cn(actionClassName, "text-destructive")}
                  >
                    <Trash2Icon aria-hidden="true" />
                    {texts.removeLabel}
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
