import { cn } from "cn";
import { useLayoutEffect, useRef } from "react";
import { scrollElementToTop, useAppLayoutContext, useScrollable } from "../hooks";
import type { AppLayoutMainProps } from "../types";
import { mainClassName, mainContentClassName, mainMaxWidthClassNames } from "../utils";

/**
 * The page's `main` landmark. It scrolls on its own, and its content always keeps a minimum padding
 * from every edge. When `scrollResetKey` changes, it scrolls back to the top. While its content
 * overflows it is a tab stop, so keyboard users can scroll a page without focusable content;
 * otherwise it can still receive focus from the skip link.
 *
 * ```tsx
 * <AppLayoutMain maxWidth="5xl" scrollResetKey={pathname}>
 *   {page}
 * </AppLayoutMain>
 * ```
 */
export function AppLayoutMain({
  children,
  className,
  contentClassName,
  maxWidth,
  scrollResetKey,
  ...rest
}: AppLayoutMainProps) {
  const { mainId, mainRef } = useAppLayoutContext("AppLayoutMain");
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollable = useScrollable(mainRef, contentRef);
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs when the key changes.
  useLayoutEffect(() => {
    scrollElementToTop(mainRef.current);
  }, [scrollResetKey, mainRef]);
  return (
    <main
      ref={mainRef}
      id={mainId}
      tabIndex={scrollable ? 0 : -1}
      data-slot="app-layout-main"
      className={cn(mainClassName, className)}
      {...rest}
    >
      <div
        ref={contentRef}
        data-slot="app-layout-main-content"
        className={cn(
          mainContentClassName,
          maxWidth && mainMaxWidthClassNames[maxWidth],
          contentClassName,
        )}
      >
        {children}
      </div>
    </main>
  );
}
