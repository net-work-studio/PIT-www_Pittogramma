# popover

2026-07-17, transformation engine after legacy new-york classification, migrated to Base UI with customized styling preserved.

## Changed

- `src/components/ui/popover.tsx:3` replaces the Radix package with `@base-ui/react/popover` and updates wrapper prop types to Base UI part types.
- `src/components/ui/popover.tsx:32` moves positioning props to `Positioner`, renders the styled surface with `Popup`, and rewrites Radix state animations and CSS variables to Base UI hooks.
- `src/components/ui/popover.tsx:22` keeps the unused public `PopoverAnchor` export as an inert `div` compatibility wrapper because Base UI has no Anchor part.
- `src/components/feat/filter/filter.tsx:89` replaces the Radix `asChild` trigger composition with Base UI's `render` prop.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/popover.tsx src/components/feat/filter/filter.tsx` returned no matches.

## Left alone

- `.migration/navigation-menu.md` already had an unrelated user change and was preserved.
- Other UI wrappers and their Radix dependencies were left in place because this is a progressive, single-component migration.

## Behavior changes

- `PopoverAnchor` is now an inert compatibility wrapper. Base UI positions against the trigger by default; a future consumer needing a separate anchor must pass an anchor element or ref to the Popover positioner through an expanded wrapper API.
- Base UI's `onOpenChange` callback includes event details as a second argument. Existing one-argument handlers remain compatible.

## Verify by hand - OK

- Open Filters and confirm the popover aligns to the trigger's start edge with the expected spacing.
- Use Tab and Shift+Tab inside the popover, then press Escape and confirm focus returns to Filters.
- Click outside the popover and confirm it closes; reopen it and confirm the enter and exit motion comes from the correct side.
