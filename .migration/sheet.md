# sheet

2026-07-17, transformation engine after legacy `new-york` classification, migrated successfully with customized styling and extensions preserved.

## Changed

- `src/components/ui/sheet.tsx:3` replaces `@radix-ui/react-dialog` with `@base-ui/react/dialog` and updates wrapper prop types to Base UI part types.
- `src/components/ui/sheet.tsx:26` maps Radix `Overlay` to Base UI `Backdrop`; `src/components/ui/sheet.tsx:69` maps `Content` to the unpositioned dialog `Popup` used by sheets.
- `src/components/ui/sheet.tsx:40` rewrites the customized full-panel side transitions from Radix state keyframes to Base UI starting/ending-style transforms while retaining the existing overlay opacity, panel widths, header/footer spacing, and `overlayClassName` extension.
- `src/components/ui/sheet.tsx:75` keeps the close control on Base UI's `Close` part and derives its open styling from the parent Popup's `data-open` state.
- `src/components/modules/designer/designer-modal.tsx:111` replaces `asChild` with `render` and maps prevented close autofocus to `finalFocus={false}`.
- `src/components/feat/feed/feed-dialog.tsx:62` replaces the Radix `asChild` trigger composition with Base UI's `render` prop.
- `src/app/(frontend)/design-system/_components/ui-section.tsx:300` replaces the Radix `asChild` trigger composition with Base UI's `render` prop.
- `.migration/sheet.md:1` records this migration and its verification checklist.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/sheet.tsx` returns no matches.

## Left alone

- `src/components/resources/book-details-drawer.tsx` uses no Radix-only Sheet props, so its stable import remains unchanged.
- `package.json`, `bun.lock`, and `components.json` remain unchanged because this is a progressive migration and one UI wrapper still imports Radix.
- Other UI wrappers and their dependencies were outside this component-scoped migration.

## Behavior changes

- Base UI's Portal renders a wrapper `<div>` where Radix Portal did not add an element; selectors that depend on the exact portal child structure may need adjustment.
- Base UI's `onOpenChange` callback supplies an additional event-details argument. Existing single-argument handlers remain valid.
- On touch-open, Base UI focuses the Popup instead of the first tabbable control to avoid opening the virtual keyboard; keyboard and pointer opens retain normal initial-focus behavior.

## Verify by hand

- Open the Sheet example on `/design-system` with mouse and keyboard; confirm the backdrop and right-side full-panel transition render correctly.
- Close it with the X button, Escape, and an outside press; confirm focus returns to the trigger each time.
- Open Feed at desktop and mobile widths; confirm the right and bottom variants retain their sizing, scrolling, and custom blurred overlay.
- Open a designer sheet on mobile, close it, and confirm focus is not forcibly restored, matching the previous prevented `onCloseAutoFocus` behavior.
