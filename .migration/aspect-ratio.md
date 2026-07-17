# aspect-ratio

2026-07-16, transformation engine, migrated from Radix AspectRatio to a native CSS aspect-ratio wrapper.

## Changed

`src/components/ui/aspect-ratio.tsx:1` replaces `@radix-ui/react-aspect-ratio` with a typed native `<div>`, preserves the public `ratio` prop and its default of `1`, forwards ordinary div props, maps the ratio to the CSS `aspect-ratio` property, and preserves Radix's full-width sizing for flex-column card layouts. The component no longer needs a client boundary.

`src/components/ui/aspect-ratio.test.tsx:1` locks down the full-width and ratio styles that card layouts depend on.

`.migration/aspect-ratio.md` records the migration and verification results.

The leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/aspect-ratio.tsx` returned no matches.

Verification passed with `bun test src/components/ui/aspect-ratio.test.tsx`, `bun run typecheck`, `bunx ultracite check src/components/ui/aspect-ratio.tsx src/components/ui/aspect-ratio.test.tsx`, and `bun run build`. The build retained the pre-existing Portable Text `codeBlock` warning.

## Left alone

All AspectRatio consumers were left unchanged because their existing `ratio`, `className`, and child usage remains compatible with the wrapper API.

`package.json` and `bun.lock` were left unchanged by this component migration. Radix dependencies remain until the final Radix wrapper is migrated, as required by the progressive migration strategy; `@base-ui/react` was already installed by the preceding accordion migration.

## Behavior changes

The wrapper now uses the browser's native CSS `aspect-ratio` sizing and renders one `<div>` instead of Radix's two nested `<div>` elements. It explicitly retains Radix's `width: 100%` sizing so card media does not collapse inside `items-start` flex columns.

## Verify by hand OK

Open representative designer, project, interview, journal, and event pages and confirm images retain their intended ratios without layout shift. Check an interview or journal video and iframe, then load a project detail skeleton and confirm each placeholder fills its frame.

Derived status: 8 wrappers remain on Radix.
