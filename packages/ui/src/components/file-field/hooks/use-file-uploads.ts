import { useCallback, useEffect, useRef, useState } from "react";
import type { FileItem, FileUploadContext, FileUploadState, NewFileItem } from "../types";

export interface UseFileUploadsOptions<E> {
  upload?: (file: File, context: FileUploadContext) => Promise<E>;
  onUploadError?: (file: File, error: unknown) => void;
  /** Puts the uploaded item in place of the new one. */
  replace: (id: string, item: FileItem<E>) => void;
  /** Takes a cancelled item out of the value. */
  remove: (id: string) => void;
}

/**
 * Immediate uploads, keyed by item id. The state (uploading with its progress, or failed) lives
 * here, not in the form value. A completed upload turns the new item into an existing one, in
 * place and with the same id. Cancelling and unmounting abort the request through its signal.
 */
export function useFileUploads<E>(options: UseFileUploadsOptions<E>) {
  const [states, setStates] = useState<ReadonlyMap<string, FileUploadState>>(() => new Map());
  const controllers = useRef(new Map<string, AbortController>());
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const setState = useCallback((id: string, state: FileUploadState | undefined) => {
    setStates((previous) => {
      const next = new Map(previous);
      if (state) next.set(id, state);
      else next.delete(id);
      return next;
    });
  }, []);

  const start = useCallback(
    (item: NewFileItem) => {
      const upload = optionsRef.current.upload;
      if (!upload) return;
      controllers.current.get(item.id)?.abort();
      const controller = new AbortController();
      controllers.current.set(item.id, controller);
      setState(item.id, { status: "uploading", progress: 0 });

      let last = 0;
      const onProgress = (percent: number) => {
        const progress = Math.round(Math.min(100, Math.max(0, percent)));
        if (controller.signal.aborted || progress === last) return;
        last = progress;
        setState(item.id, { status: "uploading", progress });
      };

      upload(item.file, { signal: controller.signal, onProgress }).then(
        (data) => {
          if (controller.signal.aborted) return;
          controllers.current.delete(item.id);
          setState(item.id, undefined);
          optionsRef.current.replace(item.id, { kind: "existing", id: item.id, data });
        },
        (error: unknown) => {
          if (controller.signal.aborted) return;
          controllers.current.delete(item.id);
          setState(item.id, { status: "error", progress: 0 });
          optionsRef.current.onUploadError?.(item.file, error);
        },
      );
    },
    [setState],
  );

  /** Stops tracking an item: aborts its upload, if any, and drops its state. */
  const forget = useCallback(
    (id: string) => {
      controllers.current.get(id)?.abort();
      controllers.current.delete(id);
      setState(id, undefined);
    },
    [setState],
  );

  /** Aborts the upload and removes the item. */
  const cancel = useCallback(
    (id: string) => {
      forget(id);
      optionsRef.current.remove(id);
    },
    [forget],
  );

  useEffect(() => {
    const active = controllers.current;
    return () => {
      for (const controller of active.values()) controller.abort();
      active.clear();
    };
  }, []);

  return { states, start, retry: start, cancel, forget };
}
