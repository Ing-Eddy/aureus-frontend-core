# @aureus-core/ui

## 1.1.0

### Minor Changes

- 0967ae4: Add toasts (`@aureus-core/ui/components/toast`): a `Toaster` mounted once and a `toast` API callable from anywhere, with statuses and promises, click to open, action buttons, custom content and layouts, expandable descriptions and card or tinted appearances. The stylesheet adds the `--success`, `--warning` and `--info` tokens. `Modal` no longer closes when a toast is pressed.

## 1.0.0

### Major Changes

- 780b46b: First stable release.
  
  React components for Aureus projects: the shadcn/ui base layer; form fields and react-hook-form controls (text, password, text area, number, select, checkbox, checkbox group, radio group, switch, OTP, slider, date and time, date selection, file and avatar); `DataTable`, `AppLayout`, `Modal` and `Typography`; and the Aureus brand theme for Tailwind CSS v4. No component ships texts of its own.
