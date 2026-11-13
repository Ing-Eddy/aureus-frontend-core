import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Mode } from "../core/theme-types";

interface PreviewFrameProps {
  mode: Mode;
  /** Accessible name of the iframe. */
  title: string;
  /** Theme variables and adapter rules (`previewCss`). */
  css: string;
  /** Google Fonts stylesheet to load inside the frame, if any. */
  fontsUrl?: string;
  children: ReactNode;
}

const emptyDocument =
  "<!doctype html><html><head><meta charset='utf-8'></head><body></body></html>";
const clonedAttribute = "data-preview-clone";

/** Copies the playground's stylesheets (package CSS, Tailwind utilities) into the frame. */
function syncStylesheets(target: Document): Promise<void> {
  for (const node of target.head.querySelectorAll(`[${clonedAttribute}]`)) node.remove();
  const anchor = target.head.querySelector("[data-preview-theme]");
  const loads: Promise<void>[] = [];
  for (const node of document.head.querySelectorAll<HTMLElement>("style, link[rel='stylesheet']")) {
    const clone = target.importNode(node, true) as HTMLElement;
    clone.setAttribute(clonedAttribute, "");
    if (clone instanceof HTMLLinkElement && node instanceof HTMLLinkElement) {
      clone.href = node.href;
      loads.push(
        new Promise((resolve) => {
          clone.addEventListener("load", () => resolve(), { once: true });
          clone.addEventListener("error", () => resolve(), { once: true });
        }),
      );
    }
    target.head.insertBefore(clone, anchor);
  }
  return Promise.all(loads).then(() => undefined);
}

/**
 * One isolated preview (design D5): a same-origin iframe with its own `<html>`, so the dark frame
 * gets `.dark` and the light one does not, whatever the playground toolbar says. The children are
 * rendered into it through a portal, so they share React state and context with the builder.
 */
export function PreviewFrame({ mode, title, css, fontsUrl, children }: PreviewFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameDocument, setFrameDocument] = useState<Document>();
  const [ready, setReady] = useState(false);
  const [height, setHeight] = useState(480);

  // srcdoc frames load asynchronously; grab the document once it exists.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const attach = () => {
      const doc = frame.contentDocument;
      if (!doc?.body) return;
      if (!doc.head.querySelector("[data-preview-theme]")) {
        const theme = doc.createElement("style");
        theme.setAttribute("data-preview-theme", "");
        doc.head.append(theme);
      }
      setFrameDocument(doc);
    };
    // Before the srcdoc loads, the frame briefly holds an about:blank document: skip that one.
    const current = frame.contentDocument;
    if (current?.URL === "about:srcdoc" && current.readyState === "complete") attach();
    frame.addEventListener("load", attach);
    return () => frame.removeEventListener("load", attach);
  }, []);

  // Clone the playground's styles, and keep them in sync (Vite HMR rewrites <style> tags in dev).
  useEffect(() => {
    if (!frameDocument) return;
    let cancelled = false;
    syncStylesheets(frameDocument).then(() => {
      if (!cancelled) setReady(true);
    });
    let frame = 0;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => void syncStylesheets(frameDocument));
    });
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [frameDocument]);

  useEffect(() => {
    const themeStyle = frameDocument?.head.querySelector("[data-preview-theme]");
    if (themeStyle) themeStyle.textContent = css;
  }, [frameDocument, css]);

  useEffect(() => {
    if (!frameDocument) return;
    const root = frameDocument.documentElement;
    root.classList.toggle("dark", mode === "dark");
    root.style.colorScheme = mode;
  }, [frameDocument, mode]);

  useEffect(() => {
    if (!frameDocument) return;
    const existing = frameDocument.head.querySelector<HTMLLinkElement>("[data-preview-fonts]");
    if (!fontsUrl) {
      existing?.remove();
      return;
    }
    if (existing?.href === fontsUrl) return;
    const link = existing ?? frameDocument.createElement("link");
    link.rel = "stylesheet";
    link.href = fontsUrl;
    link.setAttribute("data-preview-fonts", "");
    if (!existing) frameDocument.head.append(link);
  }, [frameDocument, fontsUrl]);

  // The frame grows with its content, so the builder page scrolls as one.
  useEffect(() => {
    if (!frameDocument) return;
    const body = frameDocument.body;
    const update = () =>
      setHeight(Math.max(body.scrollHeight, frameDocument.documentElement.scrollHeight));
    const view = frameDocument.defaultView;
    if (!view) return;
    const observer = new view.ResizeObserver(update);
    observer.observe(body);
    update();
    return () => observer.disconnect();
  }, [frameDocument]);

  return (
    <iframe
      ref={frameRef}
      title={title}
      srcDoc={emptyDocument}
      data-mode={mode}
      data-ready={ready ? "true" : undefined}
      className="w-full rounded-lg border border-border bg-transparent"
      style={{ height }}
    >
      {frameDocument ? createPortal(children, frameDocument.body) : null}
    </iframe>
  );
}
