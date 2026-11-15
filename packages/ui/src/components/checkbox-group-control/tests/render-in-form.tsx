import { zodResolver } from "@hookform/resolvers/zod";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type Mock, vi } from "vitest";
import { z } from "zod";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export const preferencesSchema = z.object({
  channels: z.array(z.string()).min(1, "Choose at least one channel."),
  permissions: z.array(z.string()).max(2, "Choose at most two permissions."),
});

/** Accepts any value, to observe what react-hook-form submits for disabled or loading fields. */
export const lenientSchema = z.object({ channels: z.unknown(), permissions: z.unknown() });

export type Preferences = { channels: string[]; permissions: string[] };
type Schema = typeof preferencesSchema | typeof lenientSchema;

export const channels = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push", disabled: true },
];

export const permissions = [
  { value: "read", label: "Read" },
  { value: "write", label: "Write" },
  { value: "delete", label: "Delete" },
];

function Harness({
  children,
  defaultValues,
  schema,
  onSubmit,
}: {
  children: ReactNode;
  defaultValues: Partial<Preferences>;
  schema: Schema;
  onSubmit: (values: Preferences) => void;
}) {
  const form = useForm<Preferences>({
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
  defaultValues: Partial<Preferences> = { channels: [], permissions: [] },
  schema: Schema = preferencesSchema,
): RenderResult & { onSubmit: Mock<(values: Preferences) => void> } {
  const onSubmit = vi.fn<(values: Preferences) => void>();
  const result = render(
    <Harness defaultValues={defaultValues} schema={schema} onSubmit={onSubmit}>
      {children}
    </Harness>,
  );
  return { ...result, onSubmit };
}
