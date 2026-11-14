import { zodResolver } from "@hookform/resolvers/zod";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type Mock, vi } from "vitest";
import { z } from "zod";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export const bioSchema = z.object({
  bio: z.string().min(20, "Write at least 20 characters.").max(500),
  notes: z.string(),
});

/** Accepts any value, to observe what react-hook-form submits for disabled or loading fields. */
export const lenientSchema = z.object({ bio: z.unknown(), notes: z.unknown() });

export type Profile = z.infer<typeof bioSchema>;
type Schema = typeof bioSchema | typeof lenientSchema;

interface HarnessProps {
  children: ReactNode;
  defaultValues: Profile;
  schema: Schema;
  onSubmit: (values: Profile) => void;
}

function Harness({ children, defaultValues, schema, onSubmit }: HarnessProps) {
  const form = useForm<Profile>({
    resolver: zodResolver(schema as typeof bioSchema),
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
  defaultValues: Profile,
  schema: Schema = bioSchema,
): RenderResult & { onSubmit: Mock<(values: Profile) => void> } {
  const onSubmit = vi.fn<(values: Profile) => void>();
  const result = render(
    <Harness defaultValues={defaultValues} schema={schema} onSubmit={onSubmit}>
      {children}
    </Harness>,
  );
  return { ...result, onSubmit };
}
