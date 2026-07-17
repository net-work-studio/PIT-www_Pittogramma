# navigation-menu

2026-07-17 — transformation engine for legacy `new-york`; migrated the customized wrapper and its only consumer to Base UI successfully.

## Changed

- `src/components/ui/navigation-menu.tsx:3` now imports `NavigationMenu` from `@base-ui/react/navigation-menu` and uses Base UI part prop types.
- `src/components/ui/navigation-menu.tsx:10` preserves the controlled backdrop and body scroll lock while representing the closed Base UI value as `null`.
- `src/components/ui/navigation-menu.tsx:56` replaces the Radix `viewport` branch with the Base UI `Portal > Positioner > Popup > Viewport` composition defined at line 133; positioning props are destructured and explicitly forwarded.
- `src/components/ui/navigation-menu.tsx:91` replaces Radix state selectors with Base UI `data-popup-open`, `data-starting-style`, `data-ending-style`, and `data-activation-direction` hooks while retaining the customized visual treatment.
- `src/components/ui/navigation-menu.tsx:178` maps the public `NavigationMenuIndicator` wrapper to Base UI's `Icon` part.
- `src/components/navigation/navigation-desktop.tsx:19` removes the unsupported `viewport={false}` prop and uses the shared positioned popup.
- `src/components/navigation/navigation-desktop.tsx:42` replaces every Radix `asChild` composition with Base UI's `render` prop and opts links into `closeOnClick` to preserve close-on-navigation behavior.
- The required leftover scan is clean: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/ui/navigation-menu.tsx src/components/navigation/navigation-desktop.tsx` returns no matches.

## Left alone

- `src/components/ui/input.tsx` and `.migration/input.md` were already modified before this migration and are unrelated.
- `components.json` remains on the legacy `new-york`/Radix style because this is a progressive migration; changing it now would make the CLI inconsistent with the three wrappers still using Radix.
- Radix dependencies remain installed until the last Radix wrapper is migrated, per the progressive migration strategy.

## Behavior changes

- Base UI anchors the shared popup to the active trigger. This replaces the consumer's former `viewport={false}` item-local popup mode, which Base UI does not provide.
- Base UI's default open delay is 50 ms instead of Radix Navigation Menu's 200 ms, and Radix's `skipDelayDuration` has no equivalent. Base UI also applies its 50 ms default close delay.
- Radix's list-level active-trigger `Indicator` has no Base UI equivalent. The compatibility export now wraps Base UI's trigger `Icon`; it is currently unused by the application.

## Verify by hand

- At desktop width, open Features and Resources with the pointer and confirm the popup is aligned below the active trigger and switches content cleanly.
- Confirm the blurred backdrop appears, background scrolling locks while open, and clicking the backdrop closes the menu and restores scrolling.
- Use Tab, arrow keys, Enter/Space, and Escape to verify trigger navigation, link focus, popup dismissal, and focus return.
- Click a popup link and confirm the menu closes while navigation proceeds; resize near the viewport edges and confirm the popup remains visible.
