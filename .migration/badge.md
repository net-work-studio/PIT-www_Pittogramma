# badge

2026-07-16, engine (legacy new-york Slot migration), migrated successfully while preserving the customized badge API and styles.

## Changed

- `src/components/ui/badge.tsx:1` replaces Radix Slot with Base UI `useRender` and `mergeProps`; the polymorphic prop is now `render` instead of `asChild`.
- `src/components/ui/badge.tsx:45` keeps the default `span`, custom variants, classes, and variant-label fallback unchanged while merging props through Base UI.
- `.migration/badge.md` records this component migration.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/badge.tsx` returns no matches.
- Verification passes: `bun run typecheck`, targeted Ultracite check, and `bun run build`.

## Left alone

- Existing badge consumers were not edited because none uses the removed `asChild` prop; their imports and call sites remain compatible.
- `components.json` remains on the legacy `new-york` style during this progressive migration, as required until the remaining Radix wrappers are migrated.
- `.migration/accordion.md` was already modified before this run and was intentionally left untouched.

## Behavior changes


## Verify by hand - OK

- Open the design-system badge section and confirm every variant retains its label, outline, colors, and hover treatment.
- Check badges in cards and event pages to confirm explicit children still override the automatic uppercase variant label.
- Render a badge with `render={<a href="#" />}` and confirm the link receives the badge classes, attributes, and children.
