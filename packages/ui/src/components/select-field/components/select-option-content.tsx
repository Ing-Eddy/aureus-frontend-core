import { CheckIcon, MinusIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/shadcn/lib/utils";
import type { SelectAllState } from "../hooks";
import type { SelectOption } from "../types";
import { selectStyles } from "./styles";

/** Wraps the label text (Base UI Select needs `Select.ItemText` for typeahead). */
export type TextWrapper = ComponentType<{ children: ReactNode; className?: string }>;

const PlainText: TextWrapper = ({ children, className }) => (
  <span className={className}>{children}</span>
);

/**
 * Check (single) or checkbox (multiple), shown from the item's `data-selected` attribute. Base UI
 * sets it empty (`data-selected=""`), so the arbitrary `data-[selected]` variant is used: shadcn's
 * `data-selected` variant only matches `data-selected="true"`.
 */
export function SelectionIndicator({
  multiple,
  state,
}: {
  multiple: boolean;
  /** Explicit state for the select-all row; otherwise follows `data-selected`. */
  state?: SelectAllState;
}) {
  if (!multiple) {
    return (
      <span
        className={cn(selectStyles.indicator, "opacity-0 group-data-[selected]/option:opacity-100")}
      >
        <CheckIcon aria-hidden="true" />
      </span>
    );
  }
  const checked = state ? state !== "none" : undefined;
  return (
    <span
      data-slot="select-checkbox"
      className={cn(
        selectStyles.checkbox,
        checked === undefined
          ? "group-data-[selected]/option:border-primary group-data-[selected]/option:bg-primary group-data-[selected]/option:text-primary-foreground [&_svg]:opacity-0 group-data-[selected]/option:[&_svg]:opacity-100"
          : checked && "border-primary bg-primary text-primary-foreground",
      )}
    >
      {state === "some" ? <MinusIcon aria-hidden="true" /> : <CheckIcon aria-hidden="true" />}
    </span>
  );
}

/** The inside of an option row: indicator, icon, label and description. */
export function SelectOptionContent({
  option,
  multiple,
  Text = PlainText,
}: {
  option: SelectOption;
  multiple: boolean;
  Text?: TextWrapper;
}) {
  return (
    <>
      <SelectionIndicator multiple={multiple} />
      {option.icon ? (
        <span className="inline-flex shrink-0 [&_svg]:size-4">{option.icon}</span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <Text className="truncate">{option.label}</Text>
        {option.description ? (
          <span className="truncate text-xs text-muted-foreground group-data-highlighted/option:text-accent-foreground/80">
            {option.description}
          </span>
        ) : null}
      </span>
    </>
  );
}
