/** Rows for the DataTable composition. Dates are fixed so sorting and snapshots are stable. */
export interface Payment {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  date: string; // ISO date
}

export const payments: readonly Payment[] = [
  { id: "pay_001", amount: 316, status: "success", email: "ken99@example.com", date: "2026-01-04" },
  { id: "pay_002", amount: 242, status: "success", email: "abe45@example.com", date: "2026-01-06" },
  {
    id: "pay_003",
    amount: 837,
    status: "processing",
    email: "monserrat44@example.com",
    date: "2026-01-09",
  },
  {
    id: "pay_004",
    amount: 874,
    status: "success",
    email: "silas22@example.com",
    date: "2026-01-11",
  },
  {
    id: "pay_005",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
    date: "2026-01-14",
  },
  {
    id: "pay_006",
    amount: 129,
    status: "pending",
    email: "jason78@example.com",
    date: "2026-01-15",
  },
  { id: "pay_007", amount: 455, status: "success", email: "rosa@example.com", date: "2026-01-18" },
  { id: "pay_008", amount: 98, status: "failed", email: "omar.k@example.com", date: "2026-01-21" },
  {
    id: "pay_009",
    amount: 610,
    status: "processing",
    email: "li.wei@example.com",
    date: "2026-01-23",
  },
  {
    id: "pay_010",
    amount: 389,
    status: "success",
    email: "nora.b@example.com",
    date: "2026-01-27",
  },
  {
    id: "pay_011",
    amount: 1520,
    status: "pending",
    email: "felix@example.com",
    date: "2026-02-02",
  },
  { id: "pay_012", amount: 64, status: "success", email: "ines.m@example.com", date: "2026-02-05" },
];

export const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
