import type { RowData } from "@tanstack/react-table";
import { SearchIcon, XIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shadcn/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shadcn/ui/tooltip";
import { useDataTableContext } from "../hooks/use-data-table-context";

/** The search box at the inline start of the toolbar. */
export function DataTableSearch<TData extends RowData>() {
  const { props, search, searchInputRef } = useDataTableContext<TData>();
  const options = props.search;
  if (!options) return null;

  const input = (
    <InputGroupInput
      ref={searchInputRef}
      type="text"
      enterKeyHint="search"
      autoComplete="off"
      aria-label={options.label}
      placeholder={options.placeholder}
      value={search.value}
      onChange={(event) => search.setValue(event.target.value)}
    />
  );

  return (
    <search className="min-w-0 flex-1 basis-full @md/data-table:max-w-sm @md/data-table:basis-auto">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          search.submit();
        }}
      >
        <InputGroup className="bg-background">
          {options.tooltip !== undefined ? (
            <Tooltip>
              <TooltipTrigger asChild>{input}</TooltipTrigger>
              <TooltipContent>{options.tooltip}</TooltipContent>
            </Tooltip>
          ) : (
            input
          )}
          <InputGroupAddon align="inline-end">
            {search.value !== "" && (
              <InputGroupButton
                size="icon-xs"
                aria-label={options.clearLabel}
                onClick={search.clear}
              >
                <XIcon aria-hidden />
              </InputGroupButton>
            )}
            <InputGroupButton type="submit" size="icon-xs" aria-label={options.submitLabel}>
              <SearchIcon aria-hidden />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </search>
  );
}
