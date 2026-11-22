import type { ReactNode } from "react";
import { firstLetter, letterClassName } from "../utils";

/**
 * A row's icon, or, while the sidebar is collapsed and there is no icon, the first letter of its
 * label. Both are decorative: the label stays the accessible name.
 */
export function AppLayoutNavIcon({
  icon,
  label,
  collapsed,
}: {
  icon?: ReactNode;
  label: string;
  collapsed: boolean;
}) {
  if (icon) {
    return (
      <span aria-hidden="true" data-slot="app-layout-nav-icon" className="contents">
        {icon}
      </span>
    );
  }
  if (!collapsed) return null;
  return (
    <span aria-hidden="true" data-slot="app-layout-nav-letter" className={letterClassName}>
      {firstLetter(label)}
    </span>
  );
}
