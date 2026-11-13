import { Alert, AlertDescription, AlertTitle } from "@aureus-core/ui/shadcn/alert";
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
import { type ChartConfig, ChartContainer } from "@aureus-core/ui/shadcn/chart";
import { Checkbox } from "@aureus-core/ui/shadcn/checkbox";
import { Field, FieldGroup, FieldLabel } from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import { NativeSelect, NativeSelectOption } from "@aureus-core/ui/shadcn/native-select";
import { Switch } from "@aureus-core/ui/shadcn/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@aureus-core/ui/shadcn/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aureus-core/ui/shadcn/tabs";
import { monthlyVisitors } from "@fixtures/chart-data";
import { payments } from "@fixtures/payments";
import {
  CircleAlertIcon,
  HomeIcon,
  InboxIcon,
  PlusIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { useId } from "react";
import * as Recharts from "recharts";

const buttonVariants = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const;

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig;

const navItems = [
  { label: "Home", icon: HomeIcon, active: true },
  { label: "Inbox", icon: InboxIcon, active: false },
  { label: "Team", icon: UsersIcon, active: false },
  { label: "Settings", icon: SettingsIcon, active: false },
];

/** Portal-free showcase rendered inside each preview frame (design D5). Demo copy stays in English. */
export function PreviewSample() {
  const id = useId();
  return (
    <div className="flex flex-col gap-6 p-6 text-foreground">
      <section aria-label="Buttons" className="flex flex-wrap items-center gap-2">
        {buttonVariants.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant === "default" ? "Primary" : variant[0]?.toUpperCase() + variant.slice(1)}
          </Button>
        ))}
        <Button size="icon" aria-label="Add">
          <PlusIcon />
        </Button>
      </section>

      <section aria-label="Badges" className="flex flex-wrap items-center gap-2">
        <Badge>Badge</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </section>

      <div className="grid gap-6 @container">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>Deploy your new project in one click.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
                <Input id={`${id}-name`} placeholder="My project" />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-framework`}>Framework</FieldLabel>
                <NativeSelect id={`${id}-framework`} className="w-full">
                  <NativeSelectOption value="vite">Vite</NativeSelectOption>
                  <NativeSelectOption value="next">Next.js</NativeSelectOption>
                  <NativeSelectOption value="remix">React Router</NativeSelectOption>
                </NativeSelect>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id={`${id}-terms`} defaultChecked />
                <FieldLabel htmlFor={`${id}-terms`}>Accept terms</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Switch id={`${id}-notify`} />
                <FieldLabel htmlFor={`${id}-notify`}>Email notifications</FieldLabel>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
      </div>

      <Alert>
        <CircleAlertIcon />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          <span className="text-muted-foreground">Muted text</span> sits next to regular text here.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Check your card details and try again.</AlertDescription>
      </Alert>

      <Tabs defaultValue="overview">
        <TabsList aria-label="Sample sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="rounded-lg border p-4 text-sm">
          Overview content, on the <code className="font-mono">--background</code> surface.
        </TabsContent>
        <TabsContent value="analytics" className="rounded-lg border p-4 text-sm">
          Analytics content.
        </TabsContent>
        <TabsContent value="reports" className="rounded-lg border p-4 text-sm">
          Reports content.
        </TabsContent>
      </Tabs>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.slice(0, 4).map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.email}</TableCell>
              <TableCell className="text-muted-foreground capitalize">{payment.status}</TableCell>
              <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ChartContainer
        config={chartConfig}
        className="h-48 w-full"
        role="figure"
        aria-label="Visitors per month"
      >
        <Recharts.BarChart accessibilityLayer data={[...monthlyVisitors]}>
          <Recharts.CartesianGrid vertical={false} />
          <Recharts.XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: string) => value.slice(0, 3)}
          />
          <Recharts.Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Recharts.Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </Recharts.BarChart>
      </ChartContainer>

      <nav
        aria-label="Sidebar sample"
        className="flex w-56 flex-col gap-1 rounded-lg border border-sidebar-border bg-sidebar p-2 text-sidebar-foreground"
      >
        {navItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "flex items-center gap-2 rounded-md bg-sidebar-primary px-2 py-1.5 text-sm text-sidebar-primary-foreground"
                : "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring"
            }
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
