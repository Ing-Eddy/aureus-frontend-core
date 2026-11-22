import { cn } from "cn";
import { useAppLayoutContext } from "../hooks";
import { railClassName, railSideClassNames } from "../utils";

/** A thin button on the sidebar's inner edge that toggles it. Not in the tab order. */
export function AppLayoutSidebarRail({ label }: { label: string }) {
  const { toggle, side } = useAppLayoutContext("AppLayoutSidebar");
  return (
    <button
      type="button"
      data-slot="app-layout-sidebar-rail"
      aria-label={label}
      tabIndex={-1}
      onClick={toggle}
      className={cn(railClassName, railSideClassNames[side])}
    />
  );
}
