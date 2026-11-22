import { type RefObject, useEffect, useState } from "react";

export type CopyState = "idle" | "copied" | "failed";

/**
 * Copies `text` to the clipboard. When the clipboard is blocked (permissions, insecure context), it
 * selects the contents of `fallback` for a manual copy and resolves `false`.
 */
export async function copyText(text: string, fallback?: HTMLElement | null): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const selection = fallback ? getSelection() : null;
    if (fallback && selection) {
      const range = document.createRange();
      range.selectNodeContents(fallback);
      selection.removeAllRanges();
      selection.addRange(range);
      fallback.focus();
    }
    return false;
  }
}

/** A copy action whose "copied" state returns to idle after two seconds. */
export function useCopy(text: string, fallback: RefObject<HTMLElement | null>) {
  const [state, setState] = useState<CopyState>("idle");
  useEffect(() => {
    if (state !== "copied") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);
  const copy = async () => setState((await copyText(text, fallback.current)) ? "copied" : "failed");
  return { state, copy };
}
