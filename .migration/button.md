# button

2026-07-17, transformation engine follow-up for legacy `new-york` styling, corrected successfully; all non-native Button render targets now declare their semantics and regression coverage passes.

## Changed

- `src/components/ui/button.tsx:1` remains on the real `@base-ui/react/button` primitive with the existing CVA variants, sizes, classes, and exports.
- `src/app/not-found.tsx:23` marks the rendered home Link as a non-native button.
- `src/components/cards/cta-card.tsx:44` marks both conditional internal and external CTA links as non-native buttons.
- `src/components/feat/load-more/load-more.tsx:40` marks the paginated Link as a non-native button.
- `src/components/modules/edition/edition-info.tsx:64` marks the external purchase link as a non-native button.
- `src/components/modules/journal/journal-article-cta.tsx:30` marks the external newsletter link as a non-native button.
- `src/components/navigation/navigation-mobile.tsx:101` and `src/components/navigation/navigation-mobile.tsx:146` mark mobile navigation Links as non-native buttons while preserving their click handlers.
- `src/components/navigation/resources-navigation.tsx:25` marks resource Links as non-native buttons while preserving the active-state data attribute.
- `src/components/resources/book-details-drawer.tsx:135` marks the tracked affiliate link as a non-native button.
- `src/components/ui/base-ui-consumer-contracts.test.ts:104` adds regression coverage that scans every direct Button render target and rejects non-button elements missing `nativeButton={false}`.
- `.migration/button.md` records the corrected consumer sweep and verification.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/button.tsx` returns no matches.

## Left alone

- `components.json` remains on the legacy `new-york`/Radix base because this is a progressive single-component migration and the style has no `base-new-york` counterpart.
- `package.json` and `bun.lock` are unchanged. `@base-ui/react` was already installed, and Radix dependencies remain until the final Radix wrapper is migrated.
- Native Button consumers were left unchanged so Base UI keeps native `<button>` semantics by default.

## Behavior changes

None. The explicit `nativeButton={false}` props align Base UI's internal behavior with the existing rendered `<a>` elements and remove the development warning without changing navigation.

## Verify by hand

- Open `/design-system` and confirm every button variant and size looks unchanged.
- Tab to native buttons and link-rendered buttons; confirm the focus ring is visible and Enter activates each control.
- Visit the 404 page and resource navigation; confirm internal button links navigate normally.
- Open an edition or book detail with an external purchase link; confirm it opens a new tab.
- Open the mobile menu; confirm its button links navigate and still close the menu.
- Confirm disabled buttons cannot be activated.
