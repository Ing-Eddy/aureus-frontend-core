import { type RenderResult, render, screen, within } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { DataTable } from "..";
import type {
  DataTableColumn,
  DataTablePaginationOptions,
  DataTableProps,
  DataTableSearchOptions,
  DataTableSortingOptions,
} from "../types";

export interface Person {
  id: string;
  name: string;
  email: string;
  age: number;
}

const NAMES = ["Ada", "Grace", "Alan", "Linus", "Katherine", "Barbara", "Dennis", "Edsger"];

/** `count` people with ids p1…pN, names cycling through NAMES with their index. */
export function people(count: number): Person[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `p${index + 1}`,
    name: `${NAMES[index % NAMES.length]} ${index + 1}`,
    email: `user${index + 1}@example.com`,
    age: 20 + ((index * 7) % 40),
  }));
}

export const personColumns: DataTableColumn<Person>[] = [
  { accessorKey: "name", header: "Name", sortable: true, hideable: true },
  { accessorKey: "email", header: "Email", sortable: true, hideable: true },
  { accessorKey: "age", header: "Age", sortable: true, align: "end" },
];

export const searchTexts = {
  label: "Search people",
  submitLabel: "Search",
  clearLabel: "Clear search",
} satisfies Partial<DataTableSearchOptions>;

export const sortingTexts = {
  sortLabel: (column: string, next: string) => `Sort by ${column} ${next}`,
} satisfies DataTableSortingOptions;

export const paginationTexts = {
  previousLabel: "Previous page",
  nextLabel: "Next page",
  pageLabel: (page: number, count: number) => `Page ${page} of ${count}`,
} satisfies DataTablePaginationOptions;

/** Renders a DataTable of people (inside the TooltipProvider apps mount once). */
export function renderTable(
  props: Partial<DataTableProps<Person>> = {},
): RenderResult & { user: UserEvent } {
  const user = userEvent.setup();
  const all = {
    data: people(5),
    columns: personColumns,
    getRowId: (person: Person) => person.id,
    "aria-label": "People",
    ...props,
  } as DataTableProps<Person>;
  const result = render(
    <TooltipProvider>
      <DataTable {...all} />
    </TooltipProvider>,
  );
  return { user, ...result };
}

/** The visible text of every body row (cells joined with " | "). */
export function bodyRows(): string[] {
  const table = screen.getByRole("table");
  const [, ...groups] = within(table).getAllByRole("rowgroup");
  const body = groups[0];
  if (!body) return [];
  return within(body)
    .queryAllByRole("row")
    .map((row) =>
      within(row)
        .queryAllByRole("cell")
        .map((cell) => cell.textContent ?? "")
        .join(" | "),
    );
}

/** The names in the body, in order. */
export function names(): string[] {
  return bodyRows().map(
    (row) => row.split(" | ").find((cell) => /^[A-Z][a-z]+ \d+$/.test(cell)) ?? "",
  );
}
