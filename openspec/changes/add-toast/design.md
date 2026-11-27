## Context

See proposal.md. `@base-ui/react` 1.9.0 is already a dependency (used by `combobox` and `select-field`) and ships a headless `toast` module. shadcn publishes a toast on Base UI only for the `base-nova` style; `radix-nova` has none.

## Decisions

### 1. Base UI Toast as the engine

| Option | Trade-off | Decision |
|---|---|---|
| Base UI Toast | Headless, re-measures heights by itself, swipe ignores buttons and inputs, no new dependency. Positions and stacking are our CSS | Chosen |
| Sonner 2.0.8 | shadcn's choice for Radix, but it does not re-measure when content changes from internal state, dragging an input moves the toast, and shadcn's wrapper imports `next-themes` | Rejected |
| Radix Toast | Deprecated by shadcn | Rejected |

The component is our own (`src/components/toast/`), not a file of `src/shadcn/`.

### 2. A module-level manager with a queue
`createToastManager()` has no memory: calls made before a `Provider` subscribes are lost. Our manager wrapper keeps operations until a `Toaster` is mounted and then replays them in order.

### 3. Mapping to Base UI
`status` → `type`; `duration: Infinity` → `timeout: 0`; every other option goes in `data`. The mapper always writes every key, so replacing a toast by `id` keeps nothing from the previous one. `promise` uses our own `add` and `update`, because Base UI fixes the failure type to `error`.

### 4. Click without nested controls
The title is a real button for the keyboard; pointer clicks on the card are delegated and ignored on interactive elements, text selections and drags. Swipe keeps working.

### 5. Styles
Stacking, positions and appearances are CSS on data attributes (`styles/toast.css`), as in `data-table.css`. Status tokens live in their own stylesheet so other components can use them.

## Risks

- Radix's focus trap may keep an input inside a toast from receiving focus while a modal dialog is open. Verified in a story and documented.
