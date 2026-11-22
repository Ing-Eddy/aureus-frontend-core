import { Typography } from "@aureus-core/ui/components/typography";
import { Badge } from "@aureus-core/ui/shadcn/badge";
import { Button } from "@aureus-core/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@aureus-core/ui/shadcn/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@aureus-core/ui/shadcn/table";
import { payments } from "@fixtures/payments";
import { useId } from "react";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** Real package components: how the typography reads in a dense interface. */
export function UiSample() {
  const id = useId();
  return (
    <div className="grid gap-6">
      <header className="grid gap-1">
        <Typography variant="overline" tone="muted">
          Billing
        </Typography>
        <Typography variant="h1">Invoices</Typography>
        <Typography variant="lead" tone="muted">
          Review what you owe and update how you pay.
        </Typography>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment details</CardTitle>
            <CardDescription>Used for every invoice from next month.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`${id}-email`}>Billing email</FieldLabel>
                <Input id={`${id}-email`} type="email" defaultValue="billing@example.com" />
                <FieldDescription>Receipts are sent to this address.</FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="gap-2">
            <Button>Save</Button>
            <Button variant="outline">Cancel</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This month</CardTitle>
            <CardDescription>
              <Badge variant="secondary">3 open</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1">
            <Typography variant="display" as="p" tabularNums>
              $1,284.00
            </Typography>
            <Typography variant="caption" tone="muted">
              Due on December 1 · paid with <Typography variant="code">ACH</Typography>
            </Typography>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-end">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.slice(0, 4).map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{payment.status}</Badge>
              </TableCell>
              <TableCell className="text-end tabular-nums">
                {currency.format(payment.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
