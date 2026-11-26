import { CameraIcon, RotateCwIcon, XIcon } from "lucide-react";
import { type ReactElement, type ReactNode, useMemo, useRef, useState } from "react";
import { FieldAction, FieldLoading, FieldShell, FileTrigger } from "@/internal/components";
import {
  useControllableState,
  useFieldA11y,
  useFileInput,
  useFileUploads,
  useObjectUrls,
} from "@/internal/hooks";
import type { FileInfo, FileItem, NewFileItem } from "@/internal/types";
import { isDev } from "@/internal/utils/constants";
import { createFileId, mergeRefs } from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { AvatarDialog, AvatarPreview, shapeClassName } from "./components";
import { type AvatarWarningSources, corsProblem, useAvatarWarnings } from "./hooks";
import type { AvatarFieldProps } from "./types";
import { AvatarEditError, type CropState, type ImageSize, renderCrop } from "./utils";

/**
 * A profile photo field. It shows the stored photo (the backend's data, through `getFileInfo`)
 * or a fallback, opens a dialog to inspect, change, remove or open the photo, and, with
 * `editable`, an editor to crop, zoom, rotate and flip it. Its value is the file field's model,
 * so `diffFiles`, `toFormData` and `upload` work as in `FileField`. It ships no default texts.
 *
 * ```tsx
 * <AvatarField
 *   label={t("user.photo")}
 *   initialsFrom={user.name}
 *   getFileInfo={(stored: Attachment) => ({ name: stored.name, url: stored.url })}
 *   chooseLabel={t("avatar.choose")}
 *   changeLabel={t("avatar.change")}
 *   inspectLabel={(name) => t("avatar.view", { name })}
 *   dialogTitle={t("avatar.title")}
 *   closeLabel={t("common.close")}
 *   value={photo}
 *   onValueChange={setPhoto}
 * />
 * ```
 */
export function AvatarField<E = unknown>(props: AvatarFieldProps<E>): ReactElement;
export function AvatarField(props: AvatarFieldProps<unknown>): ReactElement {
  const {
    label,
    required,
    loading,
    loadingLabel,
    disabled,
    info,
    infoLabel,
    helperText,
    error,
    errorMessage,
    className,
    classNames,
    getFileInfo,
    shape = "circle",
    size = "lg",
    fallback,
    initialsFrom,
    inspectLabel,
    dialogTitle,
    closeLabel,
    accept = "image/*",
    maxSize,
    minSize,
    onReject,
    rejectionMessage,
    capture,
    transform,
    changedAnnouncement,
    removedAnnouncement,
    editedAnnouncement,
    name,
    id,
    ref,
    onBlur,
    action,
    "aria-describedby": describedBy,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  } = props;

  useAvatarWarnings("AvatarField", props as AvatarWarningSources);

  const a11y = useFieldA11y({
    id,
    describedBy,
    required,
    loading,
    disabled,
    error,
    hasHelper: Boolean(helperText || (error && errorMessage)),
    hasInfo: Boolean(info),
  });
  const locked = Boolean(disabled || loading);
  const readOnly = props.readOnly === true;
  // Untyped code may still pass editing features with `readOnly`: they are ignored (and warned).
  const editable = !readOnly && props.editable === true;
  const removable = !readOnly && props.removable === true;
  const dropzone = !readOnly && props.dropzone === true;

  const [photo, setPhotoValue] = useControllableState<FileItem<unknown> | null>({
    value: props.value,
    defaultValue: props.defaultValue ?? null,
    onChange: props.onValueChange,
  });
  const latest = useRef(photo);
  latest.current = photo;
  const setPhoto = (next: FileItem<unknown> | null) => {
    latest.current = next;
    setPhotoValue(next);
  };

  const [announcement, setAnnouncement] = useState<ReactNode>("");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"inspect" | "edit">("inspect");
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedInputRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const corsWarned = useRef(false);

  const uploads = useFileUploads<unknown>({
    upload: props.upload,
    onUploadError: (file, uploadError) => {
      props.onUploadError?.(file, uploadError);
      if (props.uploadErrorText) setAnnouncement(props.uploadErrorText(file.name));
    },
    replace: (itemId, item) => {
      if (latest.current?.id === itemId) setPhoto(item);
    },
    remove: (itemId) => {
      if (latest.current?.id === itemId) setPhoto(null);
    },
  });

  /** Makes a new photo the value, replacing (and stopping the upload of) the current one. */
  const adoptPhoto = (file: File, announce: ReactNode) => {
    if (latest.current) uploads.forget(latest.current.id);
    const item: NewFileItem = { kind: "new", id: createFileId(), file };
    setPhoto(item);
    if (props.upload) uploads.start(item);
    if (announce) setAnnouncement(announce);
  };

  const { chooseLabel, changeLabel, pasteable } = props;
  const input = useFileInput({
    multiple: false,
    restrictions: { accept, maxSize, minSize },
    getCurrent: () => ({ count: 0, totalSize: 0 }),
    transform,
    onAccept: ([file]) => {
      if (!file) return;
      adoptPhoto(file, changedAnnouncement);
      setView("inspect");
    },
    onReject,
    // Read-only fields take no files: drops and pastes are ignored.
    disabled: locked || readOnly,
    pasteable: Boolean(pasteable),
  });

  const items = useMemo(() => (photo ? [photo] : []), [photo]);
  const previews = useObjectUrls(items);
  const infoOf = (item: FileItem<unknown>): FileInfo =>
    item.kind === "new"
      ? { name: item.file.name, size: item.file.size, type: item.file.type }
      : getFileInfo(item.data);
  const photoInfo = photo ? infoOf(photo) : undefined;
  const src = photo ? (photo.kind === "new" ? previews.get(photo.id) : photoInfo?.url) : undefined;
  const upload = photo ? uploads.states.get(photo.id) : undefined;
  const newFiles = useMemo(() => (photo?.kind === "new" ? [photo.file] : []), [photo]);

  const remove = () => {
    if (latest.current) uploads.forget(latest.current.id);
    setPhoto(null);
    if (removedAnnouncement) setAnnouncement(removedAnnouncement);
    setOpen(false);
  };

  const applyEdit = async (image: HTMLImageElement, imageSize: ImageSize, state: CropState) => {
    if (!editable || !props.editable || !photoInfo) return;
    try {
      const edited = await renderCrop(image, imageSize, state, {
        outputSize: props.outputSize ?? 512,
        outputType: props.outputType ?? "image/png",
        outputQuality: props.outputQuality ?? 0.92,
        name: photoInfo.name,
      });
      const ready = transform ? await transform(edited) : edited;
      adoptPhoto(ready, editedAnnouncement);
      setView("inspect");
    } catch (editError) {
      const reason = editError instanceof AvatarEditError ? editError.reason : "render";
      if (reason === "cors" && isDev && !corsWarned.current) {
        corsWarned.current = true;
        console.warn(`AvatarField: ${corsProblem}.`);
      }
      props.onEditError?.({ reason, error: editError });
    }
  };

  /**
   * The circular button's visible side for each avatar size. Its target is 8 px larger (an
   * invisible ring), so it is at least 24 px even on the smallest avatar.
   */
  const badgeSize = { sm: "size-4", md: "size-5", lg: "size-7", xl: "size-8" }[size];
  // The input is named by the trigger's text, then by the field's name.
  const nameId = `${a11y.inputId}-name`;
  const labelledBy = label ? a11y.labelId : (ariaLabelledBy ?? (ariaLabel ? nameId : undefined));
  const photoName = photoInfo?.name ?? "";

  return (
    <FieldShell
      inputId={a11y.inputId}
      helperId={a11y.helperId}
      infoId={a11y.infoId}
      rootProps={a11y.rootProps}
      label={label}
      required={required}
      info={info}
      infoLabel={infoLabel}
      helperText={helperText}
      error={error}
      errorMessage={errorMessage}
      className={className}
      classNames={classNames}
      labelFor={false}
      labelledByRoot
      rootAria={{
        "aria-busy": loading || undefined,
        "aria-disabled": locked || undefined,
        "aria-label": label ? undefined : ariaLabel,
        "aria-labelledby": label ? undefined : ariaLabelledBy,
      }}
      headerEnd={loading ? <FieldLoading label={loadingLabel} /> : null}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: listens to focus leaving the field; it is not itself interactive. */}
      <div
        data-slot="avatar-field"
        className="flex min-w-0 flex-wrap items-center gap-4"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onBlur?.(event);
        }}
      >
        {ariaLabel && !label && !ariaLabelledBy ? (
          <span id={nameId} hidden>
            {ariaLabel}
          </span>
        ) : null}
        <span data-slot="avatar-frame" className="relative inline-flex shrink-0">
          {photo ? (
            <button
              ref={avatarButtonRef}
              type="button"
              data-slot="avatar-inspect"
              aria-label={inspectLabel(photoName)}
              disabled={locked}
              onClick={() => {
                setView("inspect");
                setOpen(true);
              }}
              className={cn(
                "inline-flex shrink-0 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50",
                shapeClassName(shape),
              )}
            >
              <AvatarPreview
                src={src}
                shape={shape}
                size={size}
                fallback={fallback}
                initialsFrom={initialsFrom}
                progress={
                  upload?.status === "uploading"
                    ? { value: upload.progress, label: props.uploadProgressLabel?.(photoName) }
                    : undefined
                }
                className={classNames?.avatar}
              />
            </button>
          ) : (
            <AvatarPreview
              shape={shape}
              size={size}
              fallback={fallback}
              initialsFrom={initialsFrom}
              className={classNames?.avatar}
            />
          )}
          {readOnly ? null : (
            <FileTrigger
              variant="badge"
              inputProps={{ ...a11y.inputProps, disabled: locked }}
              labelledBy={labelledBy}
              accept={accept}
              multiple={false}
              capture={capture}
              name={name}
              newFiles={newFiles}
              onChange={input.onInputChange}
              inputRef={mergedInputRef}
              wrapperClassName={cn(
                "absolute",
                shape === "circle" ? "-end-1 -bottom-1" : "-end-1.5 -bottom-1.5",
              )}
              className={cn(badgeSize, classNames?.trigger)}
            >
              <CameraIcon aria-hidden="true" />
              <span className="sr-only">{photo ? changeLabel : chooseLabel}</span>
            </FileTrigger>
          )}
        </span>
        {upload || action ? (
          <div className="flex min-w-0 flex-col items-start gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {upload?.status === "uploading" && props.cancelUploadLabel ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={props.cancelUploadLabel(photoName)}
                  onClick={() => photo && uploads.cancel(photo.id)}
                  className="pointer-coarse:size-11"
                >
                  <XIcon aria-hidden="true" />
                </Button>
              ) : null}
              {upload?.status === "error" && props.retryUploadLabel && photo?.kind === "new" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={props.retryUploadLabel(photoName)}
                  onClick={() => uploads.retry(photo)}
                  className="pointer-coarse:size-11"
                >
                  <RotateCwIcon aria-hidden="true" />
                </Button>
              ) : null}
              {action ? (
                <FieldAction
                  {...action}
                  componentName="AvatarField"
                  disabled={locked || action.disabled}
                  className={cn(classNames?.action, action.className)}
                />
              ) : null}
            </div>
            {upload?.status === "error" && props.uploadErrorText ? (
              <span data-slot="avatar-upload-error" className="text-xs text-destructive">
                {props.uploadErrorText(photoName)}
              </span>
            ) : null}
          </div>
        ) : null}
        {rejectionMessage && input.rejections.length > 0 ? (
          <div
            role="alert"
            data-slot="avatar-rejections"
            className="basis-full text-sm text-destructive"
          >
            {input.rejections.map((rejection) => (
              <p
                key={`${rejection.file.name}-${rejection.file.size}-${rejection.file.lastModified}`}
                className="m-0"
              >
                {rejectionMessage(rejection)}
              </p>
            ))}
          </div>
        ) : null}
        <div aria-live="polite" data-slot="avatar-announcer" className="sr-only">
          {announcement}
        </div>
      </div>
      {photo ? (
        <AvatarDialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) setView("inspect");
          }}
          view={view}
          onViewChange={setView}
          texts={{
            dialogTitle,
            closeLabel,
            changeLabel: changeLabel ?? "",
            editLabel: props.editLabel,
            removeLabel: props.removeLabel,
            downloadLabel: props.downloadLabel,
          }}
          viewer={{
            src,
            shape,
            fallback: (
              <AvatarPreview
                shape={shape}
                size="xl"
                fallback={fallback}
                initialsFrom={initialsFrom}
              />
            ),
            dropzoneText: props.dropzoneText,
            dragging: input.dragging,
            dropHandlers: dropzone ? input.dropzoneProps : undefined,
            className: classNames?.preview,
          }}
          editor={
            editable && props.editable && src
              ? {
                  src,
                  shape,
                  texts: {
                    cropAreaLabel: props.cropAreaLabel,
                    zoomLabel: props.zoomLabel,
                    rotateLeftLabel: props.rotateLeftLabel,
                    rotateRightLabel: props.rotateRightLabel,
                    flipHorizontalLabel: props.flipHorizontalLabel,
                    flipVerticalLabel: props.flipVerticalLabel,
                    resetLabel: props.resetLabel,
                    applyLabel: props.applyLabel,
                    cancelLabel: props.cancelLabel,
                  },
                  disabled: locked,
                  onApply: applyEdit,
                }
              : undefined
          }
          onChange={readOnly ? undefined : () => inputRef.current?.click()}
          onRemove={removable ? remove : undefined}
          downloadUrl={props.downloadable ? src : undefined}
          onPaste={input.onPaste}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            (latest.current ? avatarButtonRef.current : inputRef.current)?.focus();
          }}
          disabled={locked}
          className={classNames?.dialog}
        />
      ) : null}
    </FieldShell>
  );
}
