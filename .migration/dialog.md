# dialog

2026-07-17, transformation engine follow-up for customized legacy `new-york` styling, corrected successfully; structured submit-dialog description content now renders valid HTML and regression coverage passes.

## Changed

- `src/components/ui/dialog.tsx:3` now imports `@base-ui/react/dialog`; wrapper prop types use Base UI namespaces, `Overlay` maps to `Backdrop`, and `Content` maps to the centered `Popup` without a Positioner.
- `src/components/ui/dialog.tsx:29` and `src/components/ui/dialog.tsx:51` replace Radix state-keyframe classes with Base UI starting/ending-style opacity and scale transitions while preserving the customized layout, sizing, colors, and close-button option.
- `src/components/ui/dialog.tsx:61` keeps the close button on Base UI's `Close` part and derives its open styling from the parent Popup's `data-open` state.
- `src/app/(frontend)/design-system/_components/ui-section.tsx:224` replaces the Radix `asChild` trigger with Base UI's `render` composition.
- `src/components/modules/designer/designer-modal.tsx:57` requires the trigger child to be a `ReactElement`; `src/components/modules/designer/designer-modal.tsx:97` composes that element through `render`, and `src/components/modules/designer/designer-modal.tsx:100` maps the prevented close autofocus to `finalFocus={false}`.
- `src/components/feat/submit/submit-dialog.tsx:17` replaces the Radix `asChild` trigger with Base UI's `render` composition.
- `src/components/feat/submit/submit-dialog.tsx:21` renders the structured description through a `<div>` while retaining Base UI's accessible description association, preventing block elements from nesting inside the primitive's default `<p>`.
- `src/components/ui/base-ui-consumer-contracts.test.ts:146` adds regression coverage that rejects block content inside paragraph-backed DialogDescription consumers.
- `.migration/dialog.md` records the corrected consumer markup and verification.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/dialog.tsx` returns no matches.

## Left alone

- `src/components/ui/sheet.tsx` still uses `@radix-ui/react-dialog` and retains its Radix-only consumer props; sheet migration is a separate component-scoped change.
- `@radix-ui/react-dialog` remains in `package.json` because the remaining Radix sheet wrapper still requires it.
- `src/components/ui/dropdown-menu.tsx`, `src/components/ui/navigation-menu.tsx`, `src/components/ui/popover.tsx`, `src/components/ui/sheet.tsx`, and `src/components/ui/tabs.tsx` remain on Radix and were outside this migration.

## Behavior changes

- Base UI's Portal renders a wrapper `<div>` where Radix Portal did not add an element; selectors that depend on the exact portal child structure may need adjustment.
- Base UI's `onOpenChange` callback supplies an additional event-details argument. Existing single-argument handlers remain valid.
- On touch-open, Base UI focuses the Popup instead of the first tabbable control to avoid opening the virtual keyboard. Keyboard and pointer opens retain normal initial focus behavior.

## Verify by hand

- Open `/design-system`, activate the dialog with mouse and keyboard, and confirm the backdrop plus fade/scale transitions render correctly.
- Close with the X button, Escape, and an outside press; confirm focus returns to the design-system trigger each time.
- Open a designer modal on desktop, close it, and confirm focus is not forcibly restored, matching the previous prevented `onCloseAutoFocus` behavior.
- Open the submit dialog, Tab through its controls, and confirm focus remains trapped until the dialog closes.
