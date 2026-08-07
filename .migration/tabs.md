# tabs

2026-07-17, transformation engine for legacy `new-york` styling, migrated successfully from Radix Tabs to Base UI Tabs; focused lint, typecheck, tests, and production build pass.

## Changed

- `src/components/ui/tabs.tsx:3` replaces `@radix-ui/react-tabs` with `@base-ui/react/tabs` while preserving the public wrapper names and existing visual styling.
- `src/components/ui/tabs.tsx:30` maps Radix `Trigger` to Base UI `Tab`; active and disabled selectors now use Base UI's `data-active` and `aria-disabled` hooks.
- `src/components/ui/tabs.tsx:43` maps Radix `Content` to Base UI `Panel`.
- `package.json:2` removes all obsolete direct Radix dependencies after the final Radix wrapper was migrated; `bun.lock` was refreshed with Bun.
- `components.json:3` changes the shadcn style to `base-maia`, which the CLI resolves as Base UI with the Maia style.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/tabs.tsx` returns no matches.

## Left alone

- `src/components/resources/resource-view-tabs.tsx`, `src/components/resources/bibliography-content.tsx`, and `src/app/(frontend)/design-system/_components/ui-section.tsx` use no Radix-only Tabs props, so their stable imports and call sites remain unchanged.
- Existing component classes were preserved instead of overwriting the customized wrappers with the Maia registry variants; `components.json` now controls future shadcn additions.

## Behavior changes

- Base UI tabs use manual keyboard activation by default: arrow keys move focus and Enter/Space selects the focused tab. Radix tabs selected on arrow-key focus by default. This follows the Base UI registry behavior and is intentionally flagged rather than patched.

## Verify by hand

- Open `/bibliography`, switch between List and Grid by mouse, then focus a tab and confirm Left/Right moves focus while Enter/Space activates it.
- Open a resources page with List, Grid, and Map enabled and confirm the selected panel and sticky list header update together.
- Open `/design-system` and confirm the active tab styling, focus ring, and all three panels.
- Derived status: 0 wrappers remain on Radix.
