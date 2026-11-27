let count = 0;

/** An id known before the engine sees the toast, because the call may be waiting for a Toaster. */
export function createToastId(): string {
  count += 1;
  return `aureus-toast-${count}`;
}
