# accordion

2026-07-16, transformation engine for legacy `new-york` styling, migrated successfully; typecheck, focused Biome check, and production build pass.

## Changed

- `src/components/ui/accordion.tsx:3` now uses `@base-ui/react/accordion`; `Content` became `Panel`, component prop types use Base UI namespaces, trigger state/disabled selectors use Base UI attributes, and the height transition uses `--accordion-panel-height` with starting/ending styles on the inner element.
- `src/app/(frontend)/design-system/_components/ui-section.tsx:165` removes Radix-only `type="single"` and `collapsible` props; Base UI single mode is the default and is always collapsible.
- `src/app/(frontend)/(resources)/glossary/page.tsx:107` removes the same Radix-only root props.
- `package.json:3` adds `@base-ui/react` alongside Radix while nine other UI wrappers remain on Radix.
- `bun.lock` records the Base UI dependency graph.
- `.migration/accordion.md` records this migration and its verification.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/accordion.tsx` returns no matches.

## Left alone

- `@radix-ui/react-accordion` remains in `package.json` until the last Radix wrapper is migrated, as required for progressive migration dependency cleanup.
- The nine other Radix wrappers in `src/components/ui` were not part of this component-scoped migration.

## Behavior changes

- Base UI follows the updated accordion APG guidance and does not provide Radix's roving Up/Down arrow-key focus between triggers. Tab navigation and Enter/Space activation remain available.

## Verify by hand - OK

- Open `/design-system`, expand each accordion item, confirm only one remains open, confirm an open item can close, and check the chevron and height animations in both directions.
- On `/glossary`, expand and collapse several cards and confirm their custom zero-padding content styling remains intact.
- Keyboard through the triggers with Tab, toggle each with Enter and Space, and confirm focus rings and disabled styling if a disabled item is added.
