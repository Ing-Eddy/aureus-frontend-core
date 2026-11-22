import { cn } from "cn";
import { ChevronDownIcon } from "lucide-react";
import { useContext, useId, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shadcn/ui/collapsible";
import { NavListContext, SidebarPresentationContext, useAppLayoutContext } from "../hooks";
import type { AppLayoutNavGroupProps } from "../types";
import {
  groupClassName,
  groupCollapsedClassName,
  groupLabelButtonClassName,
  groupLabelClassName,
  menuClassName,
  menuCollapsedClassName,
} from "../utils";

const chevronClassName =
  "ms-auto transition-transform duration-200 motion-reduce:transition-none group-data-[state=closed]/nav-group:-rotate-90 rtl:group-data-[state=closed]/nav-group:rotate-90";

/**
 * A list of navigation rows with an optional title. With `collapsible`, the title is a button that
 * shows or hides the rows. While the sidebar is collapsed the title is hidden, the rows are always
 * shown, and groups are separated by a line.
 */
export function AppLayoutNavGroup({
  label,
  collapsible = false,
  defaultOpen = true,
  children,
  className,
  ...rest
}: AppLayoutNavGroupProps) {
  useAppLayoutContext("AppLayoutNavGroup");
  const { collapsed } = useContext(SidebarPresentationContext);
  const labelId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const hasLabel = label !== undefined && label !== null && label !== false;
  const list = (
    <NavListContext.Provider value={true}>
      <ul
        data-slot="app-layout-nav-menu"
        aria-labelledby={hasLabel ? labelId : undefined}
        className={cn(menuClassName, collapsed && menuCollapsedClassName)}
      >
        {children}
      </ul>
    </NavListContext.Provider>
  );
  const groupClass = cn(
    groupClassName,
    "group/nav-group",
    collapsed && groupCollapsedClassName,
    className,
  );

  if (collapsible && hasLabel) {
    return (
      <Collapsible asChild open={collapsed || open} onOpenChange={setOpen}>
        <div data-slot="app-layout-nav-group" className={groupClass} {...rest}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              id={labelId}
              data-slot="app-layout-nav-group-label"
              hidden={collapsed}
              className={cn(groupLabelClassName, groupLabelButtonClassName)}
            >
              {label}
              <ChevronDownIcon aria-hidden className={chevronClassName} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent data-slot="app-layout-nav-group-content">{list}</CollapsibleContent>
        </div>
      </Collapsible>
    );
  }

  return (
    <div data-slot="app-layout-nav-group" className={groupClass} {...rest}>
      {hasLabel ? (
        <div
          id={labelId}
          data-slot="app-layout-nav-group-label"
          className={cn(groupLabelClassName, collapsed && "sr-only")}
        >
          {label}
        </div>
      ) : null}
      {list}
    </div>
  );
}
