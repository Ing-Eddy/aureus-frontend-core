import { zodResolver } from "@hookform/resolvers/zod";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type Mock, vi } from "vitest";
import { z } from "zod";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export const filtersSchema = z.object({
  volume: z.number().max(80, "Demasiado alto."),
  price: z
    .tuple([z.number(), z.number()])
    .refine(([low, high]) => high - low >= 100, "El rango debe ser de al menos 100."),
});

/** Accepts any value, to observe what react-hook-form submits for disabled or loading fields. */
export const lenientSchema = z.object({ volume: z.unknown(), price: z.unknown() });

export type Filters = { volume?: number; price?: [number, number] };
type Schema = typeof filtersSchema | typeof lenientSchema;

function Harness({
  children,
  defaultValues,
  schema,
  onSubmit,
}: {
  children: ReactNode;
  defaultValues: Filters;
  schema: Schema;
  onSubmit: (values: Filters) => void;
}) {
  const form = useForm<Filters>({
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
  defaultValues: Filters = { volume: 40, price: [200, 800] },
  schema: Schema = filtersSchema,
): RenderResult & { onSubmit: Mock<(values: Filters) => void> } {
  const onSubmit = vi.fn<(values: Filters) => void>();
  const result = render(
    <Harness defaultValues={defaultValues} schema={schema} onSubmit={onSubmit}>
      {children}
    </Harness>,
  );
  return { ...result, onSubmit };
}
