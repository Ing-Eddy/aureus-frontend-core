import { zodResolver } from "@hookform/resolvers/zod";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type Mock, vi } from "vitest";
import { z } from "zod";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export const orderSchema = z.object({
  amount: z
    .number({ error: "Enter an amount." })
    .min(1, "The amount must be at least 1.")
    .max(10000),
  qty: z.number().nullable(),
});

/** Accepts any value, to observe what react-hook-form submits for disabled or loading fields. */
export const lenientSchema = z.object({ amount: z.unknown(), qty: z.unknown() });

export type Order = { amount: number | null; qty: number | null };
type Schema = typeof orderSchema | typeof lenientSchema;

interface HarnessProps {
  children: ReactNode;
  defaultValues: Order;
  schema: Schema;
  onSubmit: (values: Order) => void;
}

function Harness({ children, defaultValues, schema, onSubmit }: HarnessProps) {
  const form = useForm<Order>({
    resolver: zodResolver(schema as unknown as typeof lenientSchema) as never,
    defaultValues,
  });
  return (
    <TooltipProvider>
      <FormProvider {...form}>
        <form noValidate onSubmit={form.handleSubmit((values) => onSubmit(values))}>
          {children}
          <button type="submit">Save</button>
        </form>
      </FormProvider>
    </TooltipProvider>
  );
}

/** Renders `children` inside a schema-driven form, the way consumers use controls. */
export function renderInForm(
  children: ReactNode,
  defaultValues: Order,
  schema: Schema = orderSchema,
): RenderResult & { onSubmit: Mock<(values: Order) => void> } {
  const onSubmit = vi.fn<(values: Order) => void>();
  const result = render(
    <Harness defaultValues={defaultValues} schema={schema} onSubmit={onSubmit}>
      {children}
    </Harness>,
  );
  return { ...result, onSubmit };
}
