# Base UI migration

2026-07-17, whole-project migration completed successfully. All UI wrappers and application consumers are off direct Radix imports, shadcn resolves the project as Base UI with the Maia style, and the production build passes.

## Dependency swap

- `@base-ui/react@^1.6.0` is the project's primitive dependency.
- Removed the direct `radix-ui` package and the seven direct `@radix-ui/react-*` packages from `package.json`.
- Refreshed `bun.lock` with Bun. Radix packages may still occur transitively through third-party packages, but the application has no direct Radix imports or dependencies.

## Application sweep

- Scanned `src` for `radix-ui`, `@radix-ui`, `asChild`, `activationMode`, `forceMount`, Radix state selectors, and Radix CSS variables.
- No direct Radix imports or unresolved Radix-only consumer props remain.
- Non-Radix libraries were intentionally left unchanged.
- `components.json` now uses `base-maia`; `shadcn info --json` reports `style: base-maia` and `base: base`.

## Verification

- `bun run typecheck`: pass.
- `bun test`: 54 pass, 0 fail.
- `bun run build`: pass; all 299 static pages generated. The build retains existing warnings about Node local storage and an unhandled Portable Text `codeBlock` type.
- Focused Biome check for `tabs.tsx`, `components.json`, and `package.json`: pass.
- Full `bun run check`: still fails on pre-existing repository-wide formatting and lint findings outside this migration, as documented in `AGENTS.md`; the migrated files pass focused checks.

Derived status: 0 wrappers remain on Radix.
