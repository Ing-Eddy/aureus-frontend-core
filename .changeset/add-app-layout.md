---
"@aureus-core/ui": minor
---

Add `AppLayout` (`@aureus-core/ui/components/app-layout`), an application shell based on the shadcn sidebar blocks: a sidebar with a header, a scrolling content area and a footer that collapses to icons (with a letter fallback), off the screen, or never, and becomes a sheet on phones; a top bar with the sidebar toggle, a managed breadcrumb and an actions area that pages fill with `AppLayoutTopbarActions`; and a main area that scrolls on its own with a minimum padding. Navigation is written with JSX parts or a configuration array (groups, simple rows with optional "more actions" menus, submenus with a collapsed flyout). The side is logical (`start` by default) and changes at runtime. Links go through `renderLink`, so any router works. The hooks are `useAppLayoutSidebar`, `useAppLayoutBreadcrumb`, `useAppLayoutBreadcrumbItems` and `useAppLayoutMain`. Persistence and a keyboard shortcut are opt-in, and the layout renders no text of its own.
