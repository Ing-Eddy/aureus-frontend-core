import {
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import type { FileRejection } from "@/internal/types";
import { type CurrentFiles, type FileRestrictions, validateFiles } from "@/internal/utils/helpers";

/** Options of `useFileInput`. */
export interface UseFileInputOptions {
  /** Whether files are added to the current ones, or one file replaces them. */
  multiple: boolean;
  /**
   * Checked on the picked files, before `transform`. Without `multiple`, the count is one and the
   * total size is not checked.
   */
  restrictions: FileRestrictions;
  /** What the value holds now, for the count and total-size limits. */
  getCurrent: () => CurrentFiles;
  /**
   * Replaces each accepted file before it enters the value. A rejected promise rejects the file
   * with reason `"transform"`.
   */
  transform?: (file: File) => Promise<File>;
  /** Called with the accepted (and transformed) files, in pick order. */
  onAccept: (files: File[]) => void;
  /** Called with the files that did not enter, when there are any. */
  onReject?: (rejections: FileRejection[]) => void;
  /** Ignores every way in (picker, drop, paste). */
  disabled: boolean;
  /** Whether pasted files are added. */
  pasteable: boolean;
}

/** Whether a drag carries files (not text or a link). */
const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer.types).includes("Files");

/**
 * The one pipeline every file goes through, whether picked, dropped or pasted: restrictions,
 * `transform`, then the accepted files and the rejections. Also tracks whether files are being
 * dragged over the dropzone, and the rejections of the last attempt.
 */
export function useFileInput(options: UseFileInputOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const [rejections, setRejections] = useState<FileRejection[]>([]);
  const [dragging, setDragging] = useState(false);
  const depth = useRef(0);

  const addFiles = useCallback(async (input: FileList | readonly File[]) => {
    const { multiple, restrictions, getCurrent, transform, onAccept, onReject, disabled } =
      optionsRef.current;
    const files = Array.from(input);
    if (disabled || files.length === 0) return;
    // Without `multiple`, the picked file replaces the current one: only one file can enter.
    const current = multiple ? getCurrent() : { count: 0, totalSize: 0 };
    const limits = multiple
      ? restrictions
      : { ...restrictions, maxFiles: 1, maxTotalSize: undefined };
    const { accepted, rejected } = validateFiles(files, current, limits);

    let ready = accepted;
    if (transform && accepted.length > 0) {
      const results = await Promise.allSettled(accepted.map((file) => transform(file)));
      ready = [];
      results.forEach((result, index) => {
        if (result.status === "fulfilled") ready.push(result.value);
        else rejected.push({ file: accepted[index] as File, reasons: ["transform"] });
      });
    }

    setRejections(rejected);
    if (ready.length > 0) onAccept(ready);
    if (rejected.length > 0) onReject?.(rejected);
  }, []);

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.currentTarget;
      if (files) void addFiles(files);
      // Reset, so picking the same file again fires `change`.
      event.currentTarget.value = "";
    },
    [addFiles],
  );

  const dropzoneProps = {
    onDragEnter: (event: DragEvent<HTMLElement>) => {
      if (!hasFiles(event) || optionsRef.current.disabled) return;
      event.preventDefault();
      depth.current += 1;
      setDragging(true);
    },
    onDragOver: (event: DragEvent<HTMLElement>) => {
      if (!hasFiles(event) || optionsRef.current.disabled) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    onDragLeave: (event: DragEvent<HTMLElement>) => {
      if (!hasFiles(event)) return;
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setDragging(false);
    },
    onDrop: (event: DragEvent<HTMLElement>) => {
      depth.current = 0;
      setDragging(false);
      if (optionsRef.current.disabled || event.dataTransfer.files.length === 0) return;
      event.preventDefault();
      void addFiles(event.dataTransfer.files);
    },
  };

  const onPaste = useCallback(
    (event: ClipboardEvent<HTMLElement>) => {
      if (!optionsRef.current.pasteable) return;
      const files = event.clipboardData?.files;
      if (!files || files.length === 0) return;
      event.preventDefault();
      void addFiles(files);
    },
    [addFiles],
  );

  return { addFiles, onInputChange, dropzoneProps, onPaste, dragging, rejections };
}
