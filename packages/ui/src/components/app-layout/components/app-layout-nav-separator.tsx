import { cn } from "cn";
import { useContext } from "react";
import { NavListContext } from "../hooks";
import type { AppLayoutNavSeparatorProps } from "../types";
import { navSeparatorClassName } from "../utils";

/** A decorative line between groups, or between rows inside a group (as a list item there). */
export function AppLayoutNavSeparator({ className, ...rest }: AppLayoutNavSeparatorProps) {
  const inList = useContext(NavListContext);
  const Comp = inList ? "li" : "div";
  return (
    <Comp
      aria-hidden="true"
      data-slot="app-layout-nav-separator"
      className={cn(navSeparatorClassName, className)}
      {...rest}
    />
  );
}
