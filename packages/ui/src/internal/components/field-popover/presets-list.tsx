import type { ReactNode } from "react";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";

/** One shortcut of the calendar. */
export interface PresetsListItem {
  /** Stable and unique among the items. */
  key: string;
  /** Visible text of the button. */
  label: ReactNode;
  /** Its value equals the current value. */
  pressed: boolean;
  /** Called when the button is pressed. */
  onSelect: () => void;
}

/** Props of `PresetsList`. */
export interface PresetsListProps {
  /** Accessible name of the group, from the field's `presetsLabel`. */
  label: string | undefined;
  /** The shortcuts, in order. */
  items: readonly PresetsListItem[];
  /** Extra classes of the group. */
  className?: string;
}

/** The shortcuts beside the calendar: a named group of toggle buttons. */
export function PresetsList({ label, items, className }: PresetsListProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset would add a legend and its own layout.
    <div
      role="group"
      aria-label={label}
      data-slot="field-presets"
      className={cn(
        "flex flex-wrap gap-1 border-b pb-2 sm:flex-col sm:flex-nowrap sm:border-e sm:border-b-0 sm:pe-2 sm:pb-0",
        className,
      )}
    >
      {items.map((item) => (
        <Button
          key={item.key}
          type="button"
          variant={item.pressed ? "secondary" : "ghost"}
          size="sm"
          aria-pressed={item.pressed}
          onClick={item.onSelect}
          className="justify-start pointer-coarse:h-11"
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
