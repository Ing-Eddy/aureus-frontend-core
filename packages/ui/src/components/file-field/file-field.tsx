import { RefreshCwIcon, UploadIcon } from "lucide-react";
import { type ReactElement, type ReactNode, useMemo, useRef, useState } from "react";
import { FieldAction, FieldLoading, FieldShell, FileTrigger } from "@/internal/components";
import {
  useFieldA11y,
  useFileInput,
  useFileUploads,
  useInheritedDirection,
  useObjectUrls,
} from "@/internal/hooks";
import { createFileId, mergeRefs } from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import {
  FileDropzone,
  FileItems,
  type FileItemTexts,
  FileItemView,
  FileSingle,
} from "./components";
import {
  type FileValue,
  type FileWarningSources,
  useFileItems,
  useFileReorder,
  useFileWarnings,
} from "./hooks";
import type {
  FileFieldMultipleProps,
  FileFieldProps,
  FileFieldSingleProps,
  FileInfo,
  FileItem,
} from "./types";

/**
 * A file field for create and update forms. Its value holds new files (picked now) and existing
 * files (the backend's data), so an update form shows the stored files and sends only what
 * changed (`diffFiles`). Files travel with the form, or, with `upload`, are uploaded as soon as
 * they are picked. It ships no default texts: `chooseLabel` and `removeLabel` are always required,
 * and every feature that needs a text requires it while it is on.
 */
export function FileField<E = unknown>(props: FileFieldMultipleProps<E>): ReactElement;
export function FileField<E = unknown>(props: FileFieldSingleProps<E>): ReactElement;
export function FileField(props: FileFieldProps<unknown>): ReactElement {
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
    chooseLabel,
    removeLabel,
    accept,
    maxSize,
    minSize,
    onReject,
    rejectionMessage,
    addedAnnouncement,
    removedAnnouncement,
    locale,
    pasteable,
    capture,
    transform,
    name,
    id,
    ref,
    onBlur,
    action,
    "aria-describedby": describedBy,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  } = props;
  const multiple = props.multiple === true;
  const requested = props.appearance ?? "list";
  // Invalid combinations (warned in development) fall back to the list.
  const appearance =
    (requested === "grid" && !multiple) || (requested === "single" && multiple)
      ? "list"
      : requested;
  const reorderable = multiple && props.reorderable === true;

  useFileWarnings("FileField", props as FileWarningSources);

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

  const { items, add, remove, replace, move } = useFileItems<unknown>({
    multiple,
    value: props.value as FileValue<unknown> | undefined,
    defaultValue: props.defaultValue as FileValue<unknown> | undefined,
    onValueChange: props.onValueChange as ((value: FileValue<unknown>) => void) | undefined,
  });
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const infoOf = (item: FileItem<unknown>): FileInfo =>
    item.kind === "new"
      ? { name: item.file.name, size: item.file.size, type: item.file.type }
      : getFileInfo(item.data);

  const [announcement, setAnnouncement] = useState<ReactNode>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedInputRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const direction = useInheritedDirection(rootRef);

  const uploads = useFileUploads<unknown>({
    upload: props.upload,
    onUploadError: (file, uploadError) => {
      props.onUploadError?.(file, uploadError);
      if (props.uploadErrorText) setAnnouncement(props.uploadErrorText(file.name));
    },
    replace,
    remove,
  });

  const input = useFileInput({
    multiple,
    restrictions: {
      accept,
      maxSize,
      minSize,
      maxFiles: props.multiple ? props.maxFiles : undefined,
      maxTotalSize: props.multiple ? props.maxTotalSize : undefined,
    },
    getCurrent: () => ({
      count: itemsRef.current.length,
      totalSize: itemsRef.current.reduce((sum, item) => sum + (infoOf(item).size ?? 0), 0),
    }),
    transform,
    onAccept: (files) => {
      const added = files.map(
        (file): FileItem<unknown> => ({ kind: "new", id: createFileId(), file }),
      );
      // Without `multiple` the new file replaces the current one: stop its upload, if any.
      if (!multiple) for (const item of itemsRef.current) uploads.forget(item.id);
      add(added);
      if (props.upload) for (const item of added) if (item.kind === "new") uploads.start(item);
      if (addedAnnouncement) setAnnouncement(addedAnnouncement(added.length));
    },
    onReject,
    disabled: locked,
    pasteable: Boolean(pasteable),
  });

  const removeItem = (item: FileItem<unknown>) => {
    uploads.forget(item.id);
    remove(item.id);
    if (removedAnnouncement) setAnnouncement(removedAnnouncement(infoOf(item).name));
    // The removed button is gone: keep focus in the field.
    inputRef.current?.focus();
  };

  const reorder = useFileReorder({
    ids: items.map((item) => item.id),
    enabled: reorderable && !locked,
    move,
    containerRef: listRef,
    direction,
    announce: (itemId, position, total) => {
      const item = itemsRef.current.find((current) => current.id === itemId);
      if (item && props.moveAnnouncement) {
        setAnnouncement(props.moveAnnouncement(infoOf(item).name, position, total));
      }
    },
  });

  const previews = useObjectUrls(items);
  const previewOf = (item: FileItem<unknown>, fileInfo: FileInfo) =>
    item.kind === "new"
      ? previews.get(item.id)
      : fileInfo.type?.startsWith("image/")
        ? fileInfo.url
        : undefined;
  const newFiles = useMemo(
    () => items.flatMap((item) => (item.kind === "new" ? [item.file] : [])),
    [items],
  );

  const texts: FileItemTexts = {
    removeLabel,
    uploadProgressLabel: props.uploadProgressLabel,
    cancelUploadLabel: props.cancelUploadLabel,
    retryUploadLabel: props.retryUploadLabel,
    uploadErrorText: props.uploadErrorText,
    moveLabel: props.moveLabel,
  };

  // The input is named by the trigger's text, then by the field's name.
  const nameId = `${a11y.inputId}-name`;
  const labelledBy = label ? a11y.labelId : (ariaLabelledBy ?? (ariaLabel ? nameId : undefined));
  const full = props.multiple && props.maxFiles !== undefined && items.length >= props.maxFiles;
  const triggerProps = {
    inputProps: { ...a11y.inputProps, disabled: locked || Boolean(full) },
    labelledBy,
    accept,
    multiple,
    capture,
    name,
    newFiles,
    onChange: input.onInputChange,
    inputRef: mergedInputRef,
    className: classNames?.trigger,
  };

  const actionNode = action ? (
    <FieldAction
      {...action}
      componentName="FileField"
      disabled={locked || action.disabled}
      className={cn(classNames?.action, action.className)}
    />
  ) : null;

  const chooseTrigger = (
    <FileTrigger {...triggerProps}>
      <UploadIcon aria-hidden="true" />
      {chooseLabel}
    </FileTrigger>
  );
  const entry = props.dropzone ? (
    <FileDropzone
      text={props.dropzoneText}
      dragging={input.dragging}
      disabled={locked}
      handlers={input.dropzoneProps}
      className={classNames?.dropzone}
    >
      {chooseTrigger}
      {actionNode}
    </FileDropzone>
  ) : (
    <div data-slot="file-entry" className="flex flex-wrap items-center gap-2">
      {chooseTrigger}
      {actionNode}
    </div>
  );

  const single = appearance === "single" ? items[0] : undefined;
  let content: ReactNode;
  if (single) {
    const singleInfo = infoOf(single);
    content = (
      <FileSingle
        id={single.id}
        info={singleInfo}
        previewUrl={previewOf(single, singleInfo)}
        upload={uploads.states.get(single.id)}
        locale={locale}
        disabled={locked}
        texts={texts}
        replaceTrigger={
          <FileTrigger {...triggerProps} variant="icon">
            <RefreshCwIcon aria-hidden="true" />
            <span className="sr-only">{props.replaceLabel?.(singleInfo.name)}</span>
          </FileTrigger>
        }
        onRemove={() => removeItem(single)}
        onCancel={() => uploads.cancel(single.id)}
        onRetry={() => single.kind === "new" && uploads.retry(single)}
        dropHandlers={props.dropzone ? input.dropzoneProps : undefined}
        dragging={input.dragging}
        className={classNames?.preview}
      />
    );
  } else {
    content = (
      <>
        {entry}
        <FileItems
          layout={appearance === "grid" ? "grid" : "list"}
          containerRef={listRef}
          className={classNames?.items}
          items={items.map((item) => {
            const itemInfo = infoOf(item);
            return {
              id: item.id,
              node: (
                <FileItemView
                  id={item.id}
                  info={itemInfo}
                  previewUrl={previewOf(item, itemInfo)}
                  layout={appearance === "grid" ? "grid" : "list"}
                  upload={uploads.states.get(item.id)}
                  locale={locale}
                  disabled={locked}
                  texts={texts}
                  onRemove={() => removeItem(item)}
                  onCancel={() => uploads.cancel(item.id)}
                  onRetry={() => item.kind === "new" && uploads.retry(item)}
                  handleProps={reorderable ? reorder.handleProps(item.id) : undefined}
                  className={classNames?.item}
                  previewClassName={classNames?.preview}
                />
              ),
            };
          })}
        />
      </>
    );
  }

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
      {/* biome-ignore lint/a11y/noStaticElementInteractions: listens to paste and to focus leaving the field; it is not itself interactive. */}
      <div
        ref={rootRef}
        data-slot="file-field"
        className="flex min-w-0 flex-col gap-3"
        onPaste={input.onPaste}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onBlur?.(event);
        }}
      >
        {ariaLabel && !label && !ariaLabelledBy ? (
          <span id={nameId} hidden>
            {ariaLabel}
          </span>
        ) : null}
        {content}
        {rejectionMessage && input.rejections.length > 0 ? (
          <div
            role="alert"
            data-slot="file-rejections"
            className="flex flex-col gap-0.5 text-sm text-destructive"
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
        <div aria-live="polite" data-slot="file-announcer" className="sr-only">
          {announcement}
        </div>
      </div>
    </FieldShell>
  );
}
