/**
 * Employees for the DataTable stories: 60 fixed rows (no randomness), with fields for nested
 * columns (contact), totals (salary) and paging.
 */
export interface Employee {
  id: string;
  name: string;
  department: "Engineering" | "Design" | "Sales" | "Support" | "Finance";
  email: string;
  phone: string;
  /** ISO date. */
  startDate: string;
  salary: number;
  status: "active" | "on leave" | "inactive";
}

const FIRST = [
  "Ada",
  "Grace",
  "Alan",
  "Linus",
  "Katherine",
  "Barbara",
  "Dennis",
  "Edsger",
  "Hedy",
  "Margaret",
  "Tim",
  "Radia",
];
const LAST = [
  "Lovelace",
  "Hopper",
  "Turing",
  "Torvalds",
  "Johnson",
  "Liskov",
  "Ritchie",
  "Dijkstra",
  "Lamarr",
  "Hamilton",
  "Berners-Lee",
  "Perlman",
];
const DEPARTMENTS: Employee["department"][] = [
  "Engineering",
  "Design",
  "Sales",
  "Support",
  "Finance",
];
const STATUSES: Employee["status"][] = ["active", "active", "active", "on leave", "inactive"];

export const employees: readonly Employee[] = Array.from({ length: 60 }, (_, index) => {
  const first = FIRST[index % FIRST.length] as string;
  const last = LAST[(index * 5) % LAST.length] as string;
  const month = String((index % 12) + 1).padStart(2, "0");
  const day = String(((index * 7) % 27) + 1).padStart(2, "0");
  return {
    id: `emp-${String(index + 1).padStart(3, "0")}`,
    name: `${first} ${last}`,
    department: DEPARTMENTS[index % DEPARTMENTS.length] as Employee["department"],
    email: `${first.toLowerCase()}.${last.toLowerCase()}${index + 1}@example.com`,
    phone: `+1 555 ${String(1000 + index * 37).slice(-4)}`,
    startDate: `${2015 + (index % 11)}-${month}-${day}`,
    salary: 42000 + ((index * 3517) % 68000),
    status: STATUSES[index % STATUSES.length] as Employee["status"],
  };
});
