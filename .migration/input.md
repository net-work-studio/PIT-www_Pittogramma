# input

2026-07-17, transformation engine for legacy `new-york` styling, migrated successfully to Base UI while preserving the customized input appearance and consumer API.

## Changed

- `src/components/ui/input.tsx:1` replaces the native input wrapper with `@base-ui/react/input` and types the wrapper from the Base UI primitive.
- `src/components/ui/input.tsx:14` preserves the existing underline, focus, invalid-state, width, file-input, and disabled-state classes on `InputPrimitive`.
- `.migration/input.md` records this component migration.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/input.tsx` returns no matches.
- Verification passes: targeted Ultracite check, `bun run typecheck`, `bun test` (54 tests), and `bun run build`.

## Left alone

- Existing Input consumers were not edited because their native input props and call sites remain compatible with Base UI Input.
- `components.json` remains on the legacy `new-york`/Radix base because this is a progressive single-component migration and the style has no `base-new-york` counterpart.
- `package.json` and `bun.lock` are unchanged. `@base-ui/react` was already installed, and Radix dependencies remain until the final Radix wrapper is migrated.

## Behavior changes

The input now integrates automatically with Base UI Field state and supports `onValueChange`, state-based `className`/`style`, and `render`. Existing standalone consumers retain native input behavior.

## Verify by hand

- Open `/design-system` and confirm default, prefilled, and disabled inputs retain their underline layout and width.
- Tab through each input and confirm its focus underline and ring are visible.
- Enter text in resource search inputs and confirm filtering still works.
- Render an invalid input and confirm its destructive border and ring appear.
- Check a file input and confirm its file selector remains visually aligned.
