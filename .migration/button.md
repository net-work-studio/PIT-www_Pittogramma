# button

2026-07-17, transformation engine for legacy `new-york` style; migrated successfully to the Base UI Button primitive while preserving the customized variants and classes.

## Changed

- `src/components/ui/button.tsx:1` replaces Radix Slot with `@base-ui/react/button`; the wrapper now exposes Base UI's `render` composition API and retains the existing CVA variants, sizes, classes, and exports.
- `src/app/not-found.tsx:23` composes the home link through `render`.
- `src/components/modules/edition/edition-info.tsx:64` composes the external purchase link through `render`.
- `src/components/modules/journal/journal-article-cta.tsx:30` composes the external newsletter link through `render`.
- `src/components/cards/cta-card.tsx:44` composes the conditional internal or external CTA target through `render`.
- `src/components/feat/load-more/load-more.tsx:39` composes the paginated Next.js link through `render`.
- `src/components/resources/book-details-drawer.tsx:135` composes the tracked affiliate link through `render`.
- `src/components/navigation/navigation-mobile.tsx:102` and `src/components/navigation/navigation-mobile.tsx:146` compose mobile navigation links through `render` while preserving click handlers.
- `src/components/navigation/resources-navigation.tsx:25` composes resource links through `render` while preserving the active-state data attribute.
- `.migration/button.md` records the migration and verification scope.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/button.tsx` returns no matches.

## Left alone

- `components.json` remains on the legacy `new-york`/Radix base because this is a progressive single-component migration and the style has no `base-new-york` counterpart.
- `package.json` and `bun.lock` are unchanged. `@base-ui/react` was already installed, and Radix dependencies remain until the final Radix wrapper is migrated.
- Existing unrelated changes in `.migration/accordion.md`, `.migration/badge.md`, and `src/components/ui/badge.tsx` were not modified.
- Button consumers without `asChild` were left unchanged because their public props remain compatible.

## Behavior changes

None identified. Link composition uses Base UI's supported `render` prop in place of Radix Slot's `asChild` prop.

## Verify by hand

- Open `/design-system` and confirm every button variant and size looks unchanged.
- Tab to native buttons and link-rendered buttons; confirm the focus ring is visible and Enter activates each control.
- Visit the 404 page and resource navigation; confirm internal button links navigate normally.
- Open an edition or book detail with an external purchase link; confirm it opens a new tab.
- Open the mobile menu; confirm its button links navigate and still close the menu.
- Confirm disabled buttons cannot be activated.
