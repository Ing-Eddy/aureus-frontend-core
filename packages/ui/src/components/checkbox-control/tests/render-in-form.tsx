import { zodResolver } from "@hookform/resolvers/zod";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type Mock, vi } from "vitest";
import { z } from "zod";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export const settingsSchema = z.object({
  terms: z.literal(true, { error: "Debes aceptar los términos." }),
  newsletter: z.boolean(),
  active: z.enum(["S", "N"]),
});

/** Accepts any value, to observe what react-hook-form submits for disabled or loading fields. */
export const lenientSchema = z.object({
  terms: z.unknown(),
  newsletter: z.unknown(),
  active: z.unknown(),
});

export type Settings = { terms: boolean; newsletter: boolean; active: "S" | "N" };
type Schema = typeof settingsSchema | typeof lenientSchema;

export const defaults: Settings = { terms: false, newsletter: false, active: "N" };

function Harness({
  children,
  defaultValues,
  schema,
  onSubmit,
}: {
  children: ReactNode;
  defaultValues: Partial<Settings>;
  schema: Schema;
  onSubmit: (values: Settings) => void;
}) {
  const form = useForm<Settings>({
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
  defaultValues: Partial<Settings> = defaults,
  schema: Schema = settingsSchema,
): RenderResult & { onSubmit: Mock<(values: Settings) => void> } {
  const onSubmit = vi.fn<(values: Settings) => void>();
  const result = render(
    <Harness defaultValues={defaultValues} schema={schema} onSubmit={onSubmit}>
      {children}
    </Harness>,
  );
  return { ...result, onSubmit };
}
