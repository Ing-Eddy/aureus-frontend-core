import { zodResolver } from "@hookform/resolvers/zod";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type Mock, vi } from "vitest";
import { z } from "zod";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export const tripSchema = z.object({
  stay: z
    .object({ from: z.string(), to: z.string().nullable() })
    .nullable()
    .refine((range) => range !== null && range.to !== null, "Elige la fecha de salida."),
  days: z.array(z.string()).min(1, "Elige al menos un día."),
});

/** Accepts any value, to observe what react-hook-form submits for disabled or loading fields. */
export const lenientSchema = z.object({ stay: z.unknown(), days: z.unknown() });

export type Trip = { stay?: { from: string; to: string | null } | null; days?: string[] };
type Schema = typeof tripSchema | typeof lenientSchema;

function Harness({
  children,
  defaultValues,
  schema,
  onSubmit,
}: {
  children: ReactNode;
  defaultValues: Trip;
  schema: Schema;
  onSubmit: (values: Trip) => void;
}) {
  const form = useForm<Trip>({
    resolver: zodResolver(schema as unknown as typeof lenientSchema) as never,
    defaultValues,
  });
  return (
    <TooltipProvider>
      <FormProvider {...form}>
        <form noValidate onSubmit={form.handleSubmit((values) => onSubmit(values))}>
          {children}
          <button type="submit">Guardar</button>
        </form>
      </FormProvider>
    </TooltipProvider>
  );
}

/** Renders `children` inside a schema-driven form, the way consumers use controls. */
export function renderInForm(
  children: ReactNode,
  defaultValues: Trip = { stay: null, days: [] },
  schema: Schema = tripSchema,
): RenderResult & { onSubmit: Mock<(values: Trip) => void> } {
  const onSubmit = vi.fn<(values: Trip) => void>();
  const result = render(
    <Harness defaultValues={defaultValues} schema={schema} onSubmit={onSubmit}>
      {children}
    </Harness>,
  );
  return { ...result, onSubmit };
}
