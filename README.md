# aureus-frontend-core

Monorepo of shared frontend resources (React + TypeScript), published to npm under the `@aureus-core` scope.

| Package                                | Description                                                         |
| -------------------------------------- | ------------------------------------------------------------------- |
| [`@aureus-core/ui`](packages/ui)       | shadcn/ui base layer + custom components, Tailwind v4               |
| [`@aureus-core/utils`](packages/utils) | Framework-free utilities: shared date-format catalog, value display |
| `apps/storybook` (private)             | Component playground and docs                                       |
| `tooling/typescript` (private)         | Shared tsconfig bases                                               |

**Documentation:** <https://ing-eddy.github.io/aureus-frontend-core/>. Every component has a bilingual (English/Spanish) page with its API, examples, keyboard and accessibility notes, and a Playground; it is published from `main` on every push.

## Using `@aureus-core/ui` in a project

### Requirements

- React 19 and React DOM 19.
- Tailwind CSS v4. With Vite, use `@tailwindcss/vite`.
- react-hook-form 7, used by the form controls (`*-control` components).
- `@tanstack/react-table` 9, only for `DataTable` (optional peer dependency).

### Install

```sh
pnpm add @aureus-core/ui react-hook-form
pnpm add -D tailwindcss @tailwindcss/vite
```

`DataTable` needs `@tanstack/react-table@^9`, an **optional** peer dependency: install it only if you use the data table (`pnpm add @tanstack/react-table`), and your app and the package share one copy. `date-fns` is **not** a dependency (no component imports it); install it yourself to build a DatePicker. To compose charts with `Chart`, install `recharts@3.8.0`, the version the package uses, so your app and the package share one copy.

### CSS

In your main CSS file, **replace** `@import "tailwindcss";` with:

```css
@import "@aureus-core/ui/styles.css";
```

It brings Tailwind, the shadcn tokens, the Aureus theme overrides and an `@source` rule so Tailwind generates the classes the package components use.

### Imports

| What              | Import path                         | Example                                                          |
| ----------------- | ----------------------------------- | ---------------------------------------------------------------- |
| shadcn components | `@aureus-core/ui/shadcn/<name>`     | `import { Button } from "@aureus-core/ui/shadcn/button"`         |
| Aureus components | `@aureus-core/ui/components/<name>` | `import { X } from "@aureus-core/ui/components/x"`               |
| Hooks             | `@aureus-core/ui/hooks/<name>`      | `import { useIsMobile } from "@aureus-core/ui/hooks/use-mobile"` |
| Utilities         | `@aureus-core/ui/lib/utils`         | `import { cn } from "@aureus-core/ui/lib/utils"`                 |
| Styles            | `@aureus-core/ui/styles.css`        | `@import "@aureus-core/ui/styles.css";`                          |

Every component has its own entry point, so you only ship what you import.

### Providers

Mount them once, near the root of the app:

```tsx
import { DirectionProvider } from "@aureus-core/ui/shadcn/direction";
import { TooltipProvider } from "@aureus-core/ui/shadcn/tooltip";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DirectionProvider dir="ltr">
      <TooltipProvider>{children}</TooltipProvider>
    </DirectionProvider>
  );
}
```

- `TooltipProvider`: required by Tooltip, Sidebar, and the `info` and `action.tooltip` tooltips of fields and controls.
- `FormProvider` (from `react-hook-form`): wraps every form that uses `*-control` components.
- `SidebarProvider` (`@aureus-core/ui/shadcn/sidebar`): wraps the layout that contains a Sidebar.
- `DirectionProvider`: only needed for right-to-left languages.

### Fields & controls

Each input comes as a pair that looks the same: a **field** for general use and a **control** bound to react-hook-form. Available pairs: `TextField` / `TextControl`, `PasswordField` / `PasswordControl` (with a built-in show/hide toggle), `TextAreaField` / `TextAreaControl` (multi-line: grows with its content, optional character counter, and its action in a footer bar) and `NumberField` / `NumberControl` (value `number | null`; separators, decimals, currency, prefix/suffix, accounting negatives, custom step buttons, shorthand and calculations, each an independent opt-in prop) and `SelectField` / `SelectControl` (single `string | null` or multiple `string[]` shown as chips or a summary; optional search inside the list, groups, descriptions, server search, a selection limit, select all and creatable options). `CheckboxField` / `CheckboxControl` add a checkbox with two texts (the field `label` above and a clickable `checkboxLabel` beside the box); its value is a `boolean`, or the custom values you pass with `checkedValue`/`uncheckedValue`, with opt-in `indeterminate`, `checkboxPosition="end"` and `appearance="card"`. `CheckboxGroupField` / `CheckboxGroupControl` hold a `string[]` in the order of `options`, with opt-in select all, selection limit, horizontal or column layouts and cards. `RadioGroupField` / `RadioGroupControl` choose exactly one value (`string | null`) with the WAI-ARIA radio group keyboard, plus opt-in cards, segments, an "other" option with free text and deselection. `SwitchField` / `SwitchControl` add an on/off switch for settings that apply immediately, with optional custom values, decorative state labels and thumb icons, and `onBeforeChange` to confirm each change (for example after saving it) with a spinner in the thumb. `OtpField` / `OtpControl` add one-time codes and PINs: boxes over one real input (SMS autofill, pasting), with opt-in character sets, groups, masking and submitting on completion. `FileField` / `FileControl` attach files in create and update forms: the value mixes new files with the files your backend already stores (any shape, shown through `getFileInfo`), `diffFiles` and `toFormData` turn it into what to send, and lists, thumbnails, a single preview, a dropzone, immediate upload with progress, reordering, paste and camera capture are opt-in. `AvatarField` / `AvatarControl` handle a profile photo with the same value model: the stored photo or a fallback (initials or your content), a dialog to inspect, change, remove or open it, and an opt-in editor to crop, zoom, rotate and flip before saving. `SliderField` / `SliderControl` pick a `number`, or a `[low, high]` range with two thumbs, within limits: every shown and announced value uses one formatter (`Intl.NumberFormat` or your `formatValue`), and the value in the header or a tooltip, marks, snapping to marks, linked number inputs and a vertical layout are opt-in. `DateTimeField` / `DateTimeControl` hold a date, a time or both as a local ISO string (`"2026-08-01"`, `"14:30"`, `"2026-08-01T14:30"`), typed in segments in the locale's order with a calendar in a popover, and `DateSelectionField` / `DateSelectionControl` choose a range (`{ from, to }`) or several separate days in the calendar; limits, blocked days, presets, minute steps and range lengths are opt-in, and every caption, weekday and segment name comes from `Intl`. No component ships texts of its own: every message is yours, in your language, and the texts a feature needs (such as `loadingLabel` for `loading`, `infoLabel` for `info` or `searchLabel` for `searchable`) are required by TypeScript when you enable it. The guide lists every feature and the texts it requires. Controls only take a `name` (plus visual props) and must be rendered inside a `FormProvider`; values, defaults and validation (for example a zod schema) belong to the form, and validation messages appear as the helper text.

```tsx
import { CheckboxControl } from "@aureus-core/ui/components/checkbox-control";
import { CheckboxGroupControl } from "@aureus-core/ui/components/checkbox-group-control";
import { NumberControl } from "@aureus-core/ui/components/number-control";
import { OtpControl } from "@aureus-core/ui/components/otp-control";
import { RadioGroupControl } from "@aureus-core/ui/components/radio-group-control";
import { SwitchControl } from "@aureus-core/ui/components/switch-control";
import { PasswordControl } from "@aureus-core/ui/components/password-control";
import { SelectControl } from "@aureus-core/ui/components/select-control";
import { TextAreaControl } from "@aureus-core/ui/components/text-area-control";
import { TextControl } from "@aureus-core/ui/components/text-control";
import { TextField } from "@aureus-core/ui/components/text-field";
import { AvatarControl } from "@aureus-core/ui/components/avatar-control";
import { FileControl } from "@aureus-core/ui/components/file-control";
import { SliderControl } from "@aureus-core/ui/components/slider-control";
import { toExistingFile, toExistingFiles } from "@aureus-core/ui/components/file-field";
import { FormProvider, useForm } from "react-hook-form";

<TextField label="Search" helperText="At least 3 characters" />;

function ProfileForm() {
  const form = useForm({
    resolver,
    defaultValues: {
      username: "",
      password: "",
      bio: "",
      amount: null,
      country: null,
      terms: false,
      channels: [],
      plan: null,
      alerts: false,
      code: "",
      attachments: toExistingFiles(storedAttachments, (file) => file.id),
      photo: storedPhoto ? toExistingFile(storedPhoto, (photo) => photo.id) : null,
      price: [0, 1000],
    },
  });
  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={form.handleSubmit(save)}>
        <TextControl name="username" label="Username" required helperText="Visible to others" />
        <PasswordControl
          name="password"
          label="Password"
          required
          showPasswordLabel="Show password"
          hidePasswordLabel="Hide password"
        />
        <TextAreaControl
          name="bio"
          label="Bio"
          maxLength={280}
          showCount
          countLabel={(count, max) => `${(max ?? 0) - count} characters remaining`}
        />
        <NumberControl
          name="amount"
          label="Amount"
          currency="USD"
          decimals={2}
          grouping
          incrementLabel="Increase"
          decrementLabel="Decrease"
        />
        <SelectControl
          name="country"
          label="Country"
          options={countries}
          placeholder="Choose a country"
        />
        <CheckboxControl name="terms" checkboxLabel="I accept the terms" required />
        <CheckboxGroupControl name="channels" label="Channels" options={channels} />
        <RadioGroupControl name="plan" label="Plan" options={plans} />
        <SwitchControl name="alerts" switchLabel="Email alerts" />
        <OtpControl name="code" label="Verification code" length={6} />
        <FileControl
          name="attachments"
          label="Attachments"
          multiple
          chooseLabel="Choose files"
          removeLabel={(name) => `Remove ${name}`}
          getFileInfo={(file: StoredAttachment) => ({ name: file.filename, url: file.url })}
        />
        <AvatarControl
          name="photo"
          label="Profile photo"
          getFileInfo={(photo: StoredPhoto) => ({ name: photo.filename, url: photo.url })}
          chooseLabel="Upload photo"
          changeLabel="Change photo"
          inspectLabel={(name) => `View ${name}`}
          dialogTitle="Profile photo"
          closeLabel="Close"
        />
        <SliderControl
          name="price"
          label="Price"
          range
          max={1000}
          thumbLabels={["Minimum price", "Maximum price"]}
          formatOptions={{ style: "currency", currency: "USD" }}
          showValue="header"
        />
      </form>
    </FormProvider>
  );
}
```

See the "Fields & controls" guide in the documentation for the shared props.

### Modal

`Modal` is a centred dialog on wide viewports and a bottom drawer (swipe to close) below `breakpoint` (768 px by default); `mode` can force either. Compose it from parts: `Modal` holds the state and behaviour, `ModalTrigger` opens it, `ModalContent` is the panel, and `ModalHeader`, `ModalTitle`, `ModalDescription`, `ModalBody` (scrolls on its own) and `ModalFooter` lay it out. `onOpenChange` receives the reason of every change, `closeOnEscape`, `closeOnOutsidePress` and `closeOnSwipe` are independent, and `useModal()` closes it from any child. Like every component, it renders no text of its own: `closeButton` requires `closeLabel`.

```tsx
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@aureus-core/ui/components/modal";

<Modal onOpenChange={(open, { reason }) => track(open, reason)} lockModeWhileOpen>
  <ModalTrigger asChild>
    <Button>Edit profile</Button>
  </ModalTrigger>
  <ModalContent size="md" closeButton closeLabel="Close">
    <ModalHeader>
      <ModalTitle>Edit profile</ModalTitle>
      <ModalDescription>Change how your name appears.</ModalDescription>
    </ModalHeader>
    <ModalBody>…</ModalBody>
    <ModalFooter>
      <ModalClose asChild>
        <Button variant="outline">Cancel</Button>
      </ModalClose>
    </ModalFooter>
  </ModalContent>
</Modal>;
```

### Data table

`DataTable` (`@aureus-core/ui/components/data-table`) is a full data table on TanStack Table v9 and the shadcn table parts: a header (title, subtitle, search, reload, filters slot, columns menu), the table and pagination. Each feature is an object prop: passing it turns the feature on, and TypeScript requires the texts it needs. `header={false}` and `pagination={false}` hide those areas.

- **Columns:** text or rich headers with a `subtitle`, nested columns, three-state sorting, hiding, start/end pinning, resizing and a footer row.
- **Interaction:** mark a column and a row (the crossing cell stands out), row and column hover, row selection with bulk actions, expandable detail rows, a per-row actions menu and `onRowClick`.
- **States and layout:** loading skeleton, empty and error slots, `density`, `striped`, `stickyHeader` and `maxHeight`.
- **Control:** every state slice takes `value` / `defaultValue` / `onChange`, and search, sorting and pagination each have their own `manual` flag for server data. `tableRef` exposes the TanStack instance.

```tsx
import { DataTable, type DataTableColumn } from "@aureus-core/ui/components/data-table";

const columns: DataTableColumn<User>[] = [
  { accessorKey: "name", header: t("users.name"), sortable: true, pin: "start" },
  {
    id: "contact",
    header: t("users.contact"),
    columns: [
      { accessorKey: "email", header: t("users.email"), hideable: true },
      { accessorKey: "phone", header: t("users.phone"), hideable: true },
    ],
  },
];

<DataTable
  data={users}
  columns={columns}
  getRowId={(user) => user.id}
  header={{ title: t("users.title") }}
  search={{
    label: t("search.label"),
    submitLabel: t("search.submit"),
    clearLabel: t("search.clear"),
    manual: true,
    onSearch: setQuery,
  }}
  sorting={{
    manual: true,
    value: sorting,
    onChange: setSorting,
    sortLabel: (column) => t("table.sortBy", { column }),
  }}
  selection={{
    selectRowLabel: (user) => t("table.select", { name: user.name }),
    selectAllLabel: t("table.selectAll"),
    actionsLabel: t("table.actions"),
    actions: [
      {
        id: "delete",
        label: t("users.delete"),
        variant: "destructive",
        onSelect: (rows, clear) => remove(rows).then(clear),
      },
    ],
  }}
  pagination={{
    manual: true,
    rowCount: total,
    value: page,
    onChange: setPage,
    previousLabel: t("page.previous"),
    nextLabel: t("page.next"),
    pageLabel: (page, count) => t("page.of", { page, count }),
  }}
  loading={isFetching}
  loadingLabel={t("table.loading")}
/>;
```

Its icon buttons show their label as a tooltip, so mount `TooltipProvider` (see Providers).

### Dark mode

Add the `dark` class to `<html>`; every token switches to its dark value:

```ts
document.documentElement.classList.toggle("dark", isDark);
```

### Right-to-left

Set `dir="rtl"` (and `lang`) on `<html>` and pass `dir="rtl"` to `DirectionProvider`. Layout mirrors through logical utilities; Radix components mirror their keyboard behaviour.

### Theming

Override tokens after the package import, light values on `:root` and dark values on `.dark`:

```css
@import "@aureus-core/ui/styles.css";

:root {
  --primary: oklch(0.55 0.2 260);
  --radius: 0.5rem;
}
.dark {
  --primary: oklch(0.72 0.15 260);
}
```

When a token is not enough: pass `className` (merged last with `cn`), target the `data-slot` / `data-variant` attributes, or wrap the component in your own. See the Theming guide in the documentation for the full list of tokens.

## Using `@aureus-core/utils` in a project

```sh
pnpm add @aureus-core/utils
```

No dependencies and no React. Each module has its own entry point (`@aureus-core/utils/<module>`):

- **`display`**: configure it once, then show every value with the same rules. `null` / `undefined` give your `empty` text, text is trimmed and can be cut, numbers, booleans and lists follow independent opt-in options, and dates use the shared catalog.
- **`date-formats`**: the single catalog of named date and time formats (`short`, `long`, `monthYear`, `time`, `shortDateTime`…). Apps pick a name; each name is written the way the active language writes it.

Neither module fixes a language or a time zone. `locale` can be a getter read on every call, so the output follows i18next, and both default to the browser's.

```ts
import { createDisplay } from "@aureus-core/utils/display";
import i18n from "./i18n";

export const display = createDisplay({ empty: "-", locale: () => i18n.resolvedLanguage });

display.text(user.name, { maxLength: 40, ellipsis: "…" });
display.date(order.date, { format: "long" }); // es: 21 de noviembre de 2026 · en: November 21, 2026
display.number(invoice.total, { decimals: 2, padDecimals: true, grouping: true, currency: "EUR" });
```

See [`packages/utils/README.md`](packages/utils/README.md) and the **utils** section of the documentation.

## Development

```sh
pnpm install
pnpm --filter @aureus-core/storybook exec playwright install chromium   # once: browser for story tests
pnpm dev             # ui and utils in watch mode + Storybook on http://localhost:6006
pnpm build           # build everything
pnpm lint            # biome
pnpm typecheck
pnpm test            # unit tests + every Storybook story in Chromium (interactions + axe)
pnpm check:package   # verifies the built ui and utils packages (artifacts, aliases, publint, attw, tarball)
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for conventions, including the story and docs contract.
