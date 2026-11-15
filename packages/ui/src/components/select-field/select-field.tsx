import { ChevronDownIcon, XIcon } from "lucide-react";
import { type KeyboardEvent, useMemo, useRef, useState } from "react";
import { FieldAction, FieldLoading, FieldShell } from "@/internal/components";
import { useFieldA11y } from "@/internal/hooks";
import { fieldFrameClassName } from "@/internal/utils/constants";
import { mergeRefs } from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import { InputGroupAddon, InputGroupButton } from "@/shadcn/ui/input-group";
import {
  ComboboxRoot,
  ListboxRoot,
  SelectChips,
  type SelectViewProps,
  selectStyles,
} from "./components";
import {
  CREATE_ID,
  type FeatureTexts,
  SELECT_ALL_ID,
  useMissingTextWarnings,
  useSelectOptions,
  useSelectValue,
} from "./hooks";
import type { SelectFieldProps } from "./types";

/**
 * A single or multiple select with the shared field layout. It ships no default texts: every
 * message is optional and shows nothing when omitted, and the texts a feature needs (search,
 * clear, chips, summary, select all, create) are required when the feature is enabled.
 */
export function SelectField(props: SelectFieldProps) {
  const {
    label,
    required,
    loading,
    disabled,
    info,
    infoLabel,
    loadingLabel,
    helperText,
    error,
    errorMessage,
    className,
    classNames,
    options,
    placeholder,
    emptyMessage,
    closeOnSelect,
    name,
    id,
    ref,
    action,
    onBlur,
    onOpenChange,
    "aria-describedby": describedBy,
  } = props;
  const multiple = props.multiple === true;
  const searchable = props.searchable === true;
  const chips = props.multiple === true && props.multipleDisplay === "chips";

  useMissingTextWarnings("SelectField", props as FeatureTexts);

  const selection = useSelectValue({
    multiple,
    options,
    value: props.value,
    defaultValue: props.defaultValue,
    onValueChange: props.onValueChange as (value: string | null | string[]) => void,
    maxSelected: props.multiple ? props.maxSelected : undefined,
  });

  const [query, setQuery] = useState("");
  const list = useSelectOptions({
    options,
    query: searchable ? query : "",
    filter: props.searchable ? props.filter !== false : true,
    creatable: props.searchable === true && props.creatable === true,
    selectAll: props.multiple === true && Boolean(props.selectAll),
    multiple,
    selectedIds: selection.selectedIds,
    maxSelected: props.multiple ? props.maxSelected : undefined,
  });

  const locked = Boolean(disabled || loading);
  const [open, setOpenState] = useState(false);
  const shouldClose = closeOnSelect ?? !multiple;
  const setOpen = (next: boolean, reason?: string) => {
    if (next && locked) return;
    // Picking an option closes only when closeOnSelect says so.
    if (!next && reason === "item-press" && !shouldClose) return;
    setOpenState(next);
    if (!next) setQuery("");
    onOpenChange?.(next);
  };

  const a11y = useFieldA11y({
    id,
    describedBy,
    required,
    loading,
    disabled,
    error,
    hasHelper: Boolean(helperText || (error && errorMessage)),
    hasInfo: Boolean(info),
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const mergedRef = useMemo(() => mergeRefs(triggerRef, ref), [ref]);
  const frameRef = useRef<HTMLDivElement>(null);
  const focusTrigger = () => triggerRef.current?.focus();

  const handleValueChange = (next: string | null | string[]) => {
    const ids = Array.isArray(next) ? next : next === null ? [] : [next];
    if (ids.includes(CREATE_ID)) {
      if (props.searchable && props.creatable) props.onCreate(query.trim());
      setQuery("");
      return;
    }
    if (ids.includes(SELECT_ALL_ID)) {
      selection.toggleAll();
      return;
    }
    selection.set(ids);
    if (shouldClose) setOpen(false);
  };

  const selected = selection.selectedOptions;
  const placeholderNode =
    placeholder !== undefined ? (
      <span data-slot="select-placeholder" className={selectStyles.placeholder}>
        {placeholder}
      </span>
    ) : null;

  let triggerContent = placeholderNode;
  if (selected.length > 0) {
    if (!multiple) {
      triggerContent = <span className={selectStyles.value}>{selected[0]?.label}</span>;
    } else if (props.multiple && props.multipleDisplay === "summary") {
      triggerContent = <span className={selectStyles.value}>{props.renderSummary(selected)}</span>;
    } else {
      // Chips are siblings of the button; the button still carries the selection for screen readers.
      triggerContent = (
        <span className="sr-only">{selected.map((option) => option.label).join(", ")}</span>
      );
    }
  }

  const status =
    props.searchable && props.optionsLoading && props.optionsLoadingMessage
      ? props.optionsLoadingMessage
      : props.searchable && list.noResults && props.noResultsMessage
        ? props.noResultsMessage
        : list.isEmpty && emptyMessage
          ? emptyMessage
          : null;

  const clearable = props.clearable === true && selected.length > 0 && !locked;
  const afterTrigger = (
    <InputGroupAddon align="inline-end" className="cursor-default">
      {loading ? <FieldLoading label={loadingLabel} /> : null}
      {action ? (
        <FieldAction
          {...action}
          disabled={locked || action.disabled}
          className={cn(classNames?.action, action.className)}
        />
      ) : null}
      {clearable && props.clearable ? (
        <InputGroupButton
          size="icon-xs"
          aria-label={props.clearLabel}
          data-slot="select-clear"
          onClick={() => {
            selection.clear();
            focusTrigger();
          }}
        >
          <XIcon aria-hidden="true" />
        </InputGroupButton>
      ) : null}
      <span
        aria-hidden="true"
        data-slot="select-chevron"
        className={selectStyles.chevron}
        onPointerDown={(event) => {
          event.preventDefault();
          focusTrigger();
          setOpen(!open);
        }}
      >
        <ChevronDownIcon />
      </span>
    </InputGroupAddon>
  );

  const view: SelectViewProps = {
    multiple,
    value: selection.raw,
    onValueChange: handleValueChange,
    open,
    onOpenChange: setOpen,
    disabled: locked,
    name,
    frameRef,
    frameClassName: cn(
      "group/select",
      fieldFrameClassName,
      locked && "bg-input/50 opacity-50 dark:bg-input/80",
      chips && selectStyles.chipsFrame,
      classNames?.control,
    ),
    beforeTrigger:
      props.multiple && props.multipleDisplay === "chips" ? (
        <SelectChips
          options={selected}
          removeChipLabel={props.removeChipLabel}
          disabled={locked}
          className={classNames?.chip}
          onRemove={(value) => {
            selection.remove(value);
            focusTrigger();
          }}
        />
      ) : null,
    afterTrigger,
    triggerRef: mergedRef,
    triggerProps: {
      id: a11y.inputId,
      className: cn(
        selectStyles.trigger,
        chips && selected.length > 0 && selectStyles.chipsTrigger,
        classNames?.trigger,
        classNames?.input,
      ),
      "aria-describedby": a11y.inputProps["aria-describedby"],
      "aria-invalid": a11y.inputProps["aria-invalid"],
      "aria-required": a11y.inputProps["aria-required"],
      "aria-busy": a11y.inputProps["aria-busy"],
      onBlur: (event) => {
        if (!open) onBlur?.(event);
      },
      onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
        if (chips && !open && event.key === "Backspace" && selected.length > 0 && !locked) {
          event.preventDefault();
          selection.removeLast();
        }
      },
    },
    triggerContent,
    listLabelledBy: label ? a11y.labelId : undefined,
    popupClassName: classNames?.popup,
    optionClassName: classNames?.option,
    status,
    limitMessage:
      props.multiple && list.atLimit && props.maxSelectedMessage
        ? props.maxSelectedMessage
        : undefined,
    groups: list.groups,
    selectAllLabel: props.multiple ? props.selectAll?.label : undefined,
    selectAllState: selection.selectAllState,
    createLabel: props.searchable && props.creatable ? props.createLabel : undefined,
    itemToStringLabel: (value: string) =>
      options.find((option) => option.value === value)?.label ?? value,
    search: props.searchable
      ? {
          label: props.searchLabel,
          placeholder: props.searchPlaceholder,
          query,
          onQueryChange: (next) => {
            setQuery(next);
            props.onSearchChange?.(next);
          },
        }
      : undefined,
  };

  return (
    <FieldShell
      inputId={a11y.inputId}
      helperId={a11y.helperId}
      infoId={a11y.infoId}
      rootProps={a11y.rootProps}
      label={label}
      required={required}
      info={info}
      infoLabel={infoLabel}
      helperText={helperText}
      error={error}
      errorMessage={errorMessage}
      className={className}
      classNames={classNames}
    >
      {searchable ? <ComboboxRoot {...view} /> : <ListboxRoot {...view} />}
    </FieldShell>
  );
}
