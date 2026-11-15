import { Combobox } from "@base-ui/react/combobox";
import { Select } from "@base-ui/react/select";
import { SearchIcon } from "lucide-react";
import type { FocusEvent, KeyboardEvent, ReactNode, Ref, RefObject } from "react";
import { cn } from "@/shadcn/lib/utils";
import { InputGroup } from "@/shadcn/ui/input-group";
import {
  CREATE_ID,
  type ListGroup,
  type ListRow,
  SELECT_ALL_ID,
  type SelectAllState,
} from "../hooks";
import { SelectionIndicator, SelectOptionContent, type TextWrapper } from "./select-option-content";
import { selectStyles } from "./styles";

/** Everything both roots render the same way. */
export interface SelectViewProps {
  multiple: boolean;
  value: string | null | string[];
  onValueChange: (next: string | null | string[]) => void;
  open: boolean;
  onOpenChange: (open: boolean, reason?: string) => void;
  disabled: boolean;
  name?: string;
  /** The frame: the popup is anchored to it, so it is as wide as the field. */
  frameRef: RefObject<HTMLDivElement | null>;
  frameClassName: string;
  /** Rendered in the frame before the button (chips). */
  beforeTrigger?: ReactNode;
  /** Rendered in the frame after the button (spinner, action, clear, chevron). */
  afterTrigger?: ReactNode;
  triggerRef: Ref<HTMLButtonElement>;
  triggerProps: {
    id: string;
    className: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
    "aria-required"?: boolean;
    "aria-busy"?: boolean;
    onBlur: (event: FocusEvent<HTMLButtonElement>) => void;
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  };
  triggerContent: ReactNode;
  popupClassName?: string;
  optionClassName?: string;
  /** Names the listbox: the field label's id, when there is a label. */
  listLabelledBy?: string;
  /** Status region content (loading, no results, empty) — only what the developer provided. */
  status: ReactNode;
  /** Shown above the list when the selection limit is reached. */
  limitMessage?: ReactNode;
  groups: ListGroup[];
  selectAllLabel?: ReactNode;
  selectAllState: SelectAllState;
  createLabel?: (query: string) => ReactNode;
  itemToStringLabel: (id: string) => string;
  search?: {
    label: string;
    placeholder?: string;
    query: string;
    onQueryChange: (query: string) => void;
  };
}

function rowKey(row: ListRow) {
  return row.kind === "option"
    ? row.option.value
    : row.kind === "create"
      ? CREATE_ID
      : SELECT_ALL_ID;
}

/** Inside of a row, the same for both roots. */
function RowContent({
  row,
  multiple,
  Text,
  selectAllLabel,
  selectAllState,
  createLabel,
}: {
  row: ListRow;
  multiple: boolean;
  Text?: TextWrapper;
  selectAllLabel?: ReactNode;
  selectAllState: SelectAllState;
  createLabel?: (query: string) => ReactNode;
}) {
  if (row.kind === "option")
    return <SelectOptionContent option={row.option} multiple={multiple} Text={Text} />;
  if (row.kind === "select-all") {
    return (
      <>
        <SelectionIndicator multiple state={selectAllState} />
        <span className="min-w-0 flex-1 truncate">
          {Text ? <Text>{selectAllLabel}</Text> : selectAllLabel}
        </span>
      </>
    );
  }
  return <span className="min-w-0 flex-1 truncate">{createLabel?.(row.query)}</span>;
}

function rowProps(row: ListRow, selectAllState: SelectAllState) {
  if (row.kind === "select-all") {
    return {
      "aria-checked": selectAllState === "some" ? ("mixed" as const) : selectAllState === "all",
    };
  }
  return {};
}

function StatusArea({ status, limitMessage }: Pick<SelectViewProps, "status" | "limitMessage">) {
  return (
    <>
      {limitMessage ? (
        <div data-slot="select-limit" className={selectStyles.limit}>
          {limitMessage}
        </div>
      ) : null}
      <div
        data-slot="select-status"
        role="status"
        aria-live="polite"
        className={selectStyles.status}
      >
        {status}
      </div>
    </>
  );
}

const SelectItemText: TextWrapper = ({ children, className }) => (
  <Select.ItemText className={className}>{children}</Select.ItemText>
);

/** Without search: Base UI Select (listbox semantics, typeahead). */
export function ListboxRoot(view: SelectViewProps) {
  const renderRow = (row: ListRow) => (
    <Select.Item
      key={rowKey(row)}
      value={rowKey(row)}
      disabled={row.kind === "option" && row.disabled}
      className={cn(selectStyles.option, view.optionClassName)}
      {...rowProps(row, view.selectAllState)}
    >
      <RowContent
        row={row}
        multiple={view.multiple}
        Text={SelectItemText}
        selectAllLabel={view.selectAllLabel}
        selectAllState={view.selectAllState}
        createLabel={view.createLabel}
      />
    </Select.Item>
  );

  return (
    <Select.Root
      multiple={view.multiple as never}
      value={view.value as never}
      onValueChange={(next) => view.onValueChange(next as string | null | string[])}
      open={view.open}
      onOpenChange={(open, details) => view.onOpenChange(open, details.reason)}
      disabled={view.disabled}
      name={view.name}
      itemToStringLabel={view.itemToStringLabel as never}
    >
      <InputGroup ref={view.frameRef} className={view.frameClassName} data-open={view.open}>
        {view.beforeTrigger}
        <Select.Trigger
          ref={view.triggerRef}
          data-slot="input-group-control"
          {...view.triggerProps}
        >
          {view.triggerContent}
        </Select.Trigger>
        {view.afterTrigger}
      </InputGroup>
      <Select.Portal>
        <Select.Positioner
          anchor={view.frameRef}
          alignItemWithTrigger={false}
          align="start"
          sideOffset={4}
          className="z-50"
        >
          <Select.Popup
            data-slot="select-popup"
            className={cn(selectStyles.popup, view.popupClassName)}
          >
            <StatusArea status={view.status} limitMessage={view.limitMessage} />
            <Select.List aria-labelledby={view.listLabelledBy} className={selectStyles.list}>
              {view.groups.map((group) =>
                group.title ? (
                  <Select.Group key={group.key}>
                    <Select.GroupLabel className={selectStyles.groupLabel}>
                      {group.title}
                    </Select.GroupLabel>
                    {group.rows.map(renderRow)}
                  </Select.Group>
                ) : (
                  group.rows.map(renderRow)
                ),
              )}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

/** With search: Base UI Combobox, search box inside the popup. */
export function ComboboxRoot(view: SelectViewProps) {
  const items = view.groups.map((group) => ({
    value: group.key,
    title: group.title,
    items: group.rows,
  }));

  return (
    <Combobox.Root
      items={items}
      filter={null}
      multiple={view.multiple as never}
      value={view.value as never}
      onValueChange={(next) => view.onValueChange(next as string | null | string[])}
      open={view.open}
      onOpenChange={(open, details) => view.onOpenChange(open, details.reason)}
      inputValue={view.search?.query ?? ""}
      onInputValueChange={(query) => view.search?.onQueryChange(query)}
      disabled={view.disabled}
      name={view.name}
      itemToStringLabel={view.itemToStringLabel as never}
    >
      <InputGroup ref={view.frameRef} className={view.frameClassName} data-open={view.open}>
        {view.beforeTrigger}
        <Combobox.Trigger
          ref={view.triggerRef}
          data-slot="input-group-control"
          {...view.triggerProps}
        >
          {view.triggerContent}
        </Combobox.Trigger>
        {view.afterTrigger}
      </InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner anchor={view.frameRef} align="start" sideOffset={4} className="z-50">
          <Combobox.Popup
            // The popup is a dialog (it holds the search box); it takes the search box's name.
            aria-label={view.search?.label}
            data-slot="select-popup"
            className={cn(selectStyles.popup, view.popupClassName)}
          >
            <div className="relative">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Combobox.Input
                aria-label={view.search?.label}
                placeholder={view.search?.placeholder}
                className={cn(selectStyles.search, "ps-8")}
              />
            </div>
            <StatusArea status={view.status} limitMessage={view.limitMessage} />
            <Combobox.List aria-labelledby={view.listLabelledBy} className={selectStyles.list}>
              {(group: (typeof items)[number]) => (
                <Combobox.Group key={group.value} items={group.items}>
                  {group.title ? (
                    <Combobox.GroupLabel className={selectStyles.groupLabel}>
                      {group.title}
                    </Combobox.GroupLabel>
                  ) : null}
                  <Combobox.Collection>
                    {(row: ListRow) => (
                      <Combobox.Item
                        key={rowKey(row)}
                        value={rowKey(row)}
                        disabled={row.kind === "option" && row.disabled}
                        className={cn(selectStyles.option, view.optionClassName)}
                        {...rowProps(row, view.selectAllState)}
                      >
                        <RowContent
                          row={row}
                          multiple={view.multiple}
                          selectAllLabel={view.selectAllLabel}
                          selectAllState={view.selectAllState}
                          createLabel={view.createLabel}
                        />
                      </Combobox.Item>
                    )}
                  </Combobox.Collection>
                </Combobox.Group>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
