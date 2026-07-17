# dropdown-menu

2026-07-17, transformation engine for legacy `new-york` styling, migrated successfully from Radix Dropdown Menu to Base UI Menu; typecheck, tests, focused lint, and production build pass.

## Changed

- `src/components/ui/dropdown-menu.tsx:3` replaces `@radix-ui/react-dropdown-menu` with `@base-ui/react/menu` while preserving the public wrapper names and existing visual styling.
- `src/components/ui/dropdown-menu.tsx:36` moves positioning props onto `Menu.Positioner` and renders the menu as `Portal > Positioner > Popup`; Radix CSS variables and state animations are replaced with Base UI variables and transition state hooks.
- `src/components/ui/dropdown-menu.tsx:72` changes item focus styling to Base UI's `data-highlighted` hook.
- `src/components/ui/dropdown-menu.tsx:95` and `src/components/ui/dropdown-menu.tsx:132` use the split checkbox and radio item indicators.
- `src/components/ui/dropdown-menu.tsx:156` maps the public label wrapper to `Menu.GroupLabel`.
- `src/components/ui/dropdown-menu.tsx:205` maps submenu parts to `SubmenuRoot`, `SubmenuTrigger`, and a positioned submenu popup with the Base UI alignment defaults required by the wrapper.
- `src/components/design-system/navigation-dropdown.tsx:21`, `src/components/mode-toggle.tsx:24`, `src/components/feat/sort/sort-dropdown.tsx:46`, and `src/app/(frontend)/design-system/_components/ui-section.tsx:252` replace Radix `asChild` triggers with Base UI `render` elements.
- `src/app/(frontend)/design-system/_components/ui-section.tsx:256` groups each label with its related checkbox or radio items so `Menu.GroupLabel` retains its accessible association.
- `.migration/dropdown-menu.md` records the migration and verification.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/dropdown-menu.tsx` returns no matches.

## Left alone

- `components.json` remains on the legacy `new-york`/Radix base because this is a progressive single-component migration and the style has no `base-new-york` counterpart.
- `package.json` and `bun.lock` are unchanged. `@base-ui/react` was already installed, and Radix dependencies remain until the final Radix wrapper is migrated.
- The pre-existing `.migration/dialog.md` worktree change was not touched.
- The repository-wide Ultracite failures outside the five migrated source files were not changed; focused Ultracite verification for these files passes.

## Behavior changes

- Base UI loops keyboard focus through menu items by default; Radix Dropdown Menu did not loop unless requested.
- Base UI checkbox and radio items stay open after selection by default, whereas Radix closed the menu. No `closeOnClick` override was added, following the migration policy to flag this behavior delta rather than silently patch it.
- Base UI's default collision padding is 5px rather than Radix's 0px, so popups may keep slightly more distance from viewport edges.
- Change callbacks can receive Base UI's additional event-details argument. Existing single-argument callbacks remain compatible.

## Verify by hand - OK

- Open the theme, sort, navigation, and `/design-system` dropdowns; confirm each trigger opens and closes its menu and focus returns to the trigger.
- Use Arrow Up/Down, Home/End, typeahead, Enter, Space, and Escape; confirm highlighting, selection, focus looping, and dismissal work.
- Toggle the checkbox and radio examples and confirm their indicators update; note that these item types intentionally keep the menu open.
- Open a submenu and confirm it aligns to the right, highlights its trigger while open, and supports keyboard navigation back to the parent menu.
- Resize near each viewport edge and confirm the popup flips or shifts without clipping.
